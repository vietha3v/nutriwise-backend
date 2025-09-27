import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Food, FoodCategory } from '../entities/food.entity';
import OpenAI from 'openai';

@Injectable()
export class FoodAiService {
  private readonly logger = new Logger(FoodAiService.name);
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (openaiApiKey) {
      this.openai = new OpenAI({ apiKey: openaiApiKey });
    }
  }

  async generateFoodFromQuery(query: string, foodRepository?: any): Promise<Food | null> {
    try {
      if (!this.openai) {
        this.logger.warn('OpenAI not configured, skipping AI generation');
        return null;
      }

      // Check if food already exists before generating
      if (foodRepository) {
        const existingFood = await foodRepository
          .createQueryBuilder('food')
          .where('food.isDeleted = :isDeleted', { isDeleted: false })
          .andWhere('LOWER(food.name) LIKE LOWER(:query) OR LOWER(food.nameEn) LIKE LOWER(:query)', {
            query: `%${query}%`
          })
          .getOne();

        if (existingFood) {
          this.logger.log(`Food already exists for query "${query}": ${existingFood.name}`);
          return null; // Return null to indicate food already exists
        }
      }

      const prompt = `
 Bạn là một chuyên gia dinh dưỡng. Hãy phân tích từ khóa "${query}" và xác định xem đây có phải là một loại thực phẩm hay không.
 
 Lưu ý về đơn vị:
 - Thực phẩm rắn: dùng g (gram), kg (kilogram), miếng, cái, quả, củ, lá
 - Thực phẩm lỏng: dùng ml (milliliter), l (liter), ly, chén, bát
 - Thực phẩm đóng gói: dùng gói, hộp, lon, chai, lọ
 - Đơn vị phải phù hợp với loại thực phẩm
 
 Nếu đây là thực phẩm, hãy trả về thông tin chi tiết dưới dạng JSON với cấu trúc sau:
{
  "isFood": true,
  "name": "Tên thực phẩm bằng tiếng Việt",
  "nameEn": "Tên thực phẩm bằng tiếng Anh",
     "categories": ["Meat", "Fish", "Vegetables", "Fruits", "Grains", "Dairy", "Nuts", "Legumes", "Spices", "Beverages", "Processed", "Other"],
  "description": "Mô tả ngắn gọn về thực phẩm",
  "calories": số_calories_trên_100g,
  "protein": số_protein_g_trên_100g,
  "carbs": số_carb_g_trên_100g,
  "fat": số_fat_g_trên_100g,
  "fiber": số_fiber_g_trên_100g,
  "sugar": số_sugar_g_trên_100g,
  "sodium": số_sodium_mg_trên_100g,
     "servingSizes": [
     {
       "size": số_khẩu_phần,
       "unit": "đơn_vị_phù_hợp_như_g_ml_l_kg_miếng_cái_quả",
       "description": "Mô tả khẩu phần"
     }
   ],
  "micronutrients": {
    "vitaminA": số_vitaminA_mcg,
    "vitaminC": số_vitaminC_mg,
    "vitaminD": số_vitaminD_mcg,
    "vitaminE": số_vitaminE_mg,
    "vitaminK": số_vitaminK_mcg,
    "vitaminB1": số_vitaminB1_mg,
    "vitaminB2": số_vitaminB2_mg,
    "vitaminB3": số_vitaminB3_mg,
    "vitaminB6": số_vitaminB6_mg,
    "vitaminB12": số_vitaminB12_mcg,
    "folate": số_folate_mcg,
    "calcium": số_calcium_mg,
    "iron": số_iron_mg,
    "magnesium": số_magnesium_mg,
    "phosphorus": số_phosphorus_mg,
    "potassium": số_potassium_mg,
    "zinc": số_zinc_mg,
    "copper": số_copper_mg,
    "manganese": số_manganese_mg,
    "selenium": số_selenium_mcg
  },
  "allergens": ["danh_sách_chất_gây_dị_ứng_nếu_có"],
  "cookingMethods": ["các_phương_pháp_chế_biến_phổ_biến"]
}

Nếu đây không phải thực phẩm, trả về:
{
  "isFood": false
}

Chỉ trả về JSON thuần, KHÔNG có markdown code blocks, KHÔNG có text giải thích.
`;

      const completion = await this.openai.chat.completions.create({
        model: this.configService.get<string>('OPENAI_MODEL', 'gpt-3.5-turbo'),
        messages: [
          {
            role: 'system',
            content: 'Bạn là một chuyên gia dinh dưỡng chuyên phân tích thực phẩm. Trả về kết quả dưới dạng JSON thuần, KHÔNG có markdown code blocks, KHÔNG có text giải thích.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: parseFloat(this.configService.get<string>('OPENAI_TEMPERATURE', '0.3')),
        max_tokens: parseInt(this.configService.get<string>('OPENAI_MAX_TOKENS', '1000')),
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) return null;

      // Extract JSON from response (handle markdown code blocks)
      let jsonString = response.trim();

      // Remove markdown code blocks if present
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const result = JSON.parse(jsonString);

      if (!result.isFood) {
        return null;
      }

      // Create new food from AI response
      const newFood = new Food();
      newFood.name = result.name;
      newFood.nameEn = result.nameEn;

      // Validate and map categories
      const validCategories = result.categories || [];
      const mappedCategories = validCategories
        .map(cat => {
          // Map string to enum value
          const categoryMap = {
            'Meat': FoodCategory.Meat,
            'Fish': FoodCategory.Fish,
            'Vegetables': FoodCategory.Vegetables,
            'Fruits': FoodCategory.Fruits,
            'Grains': FoodCategory.Grains,
            'Dairy': FoodCategory.Dairy,
            'Nuts': FoodCategory.Nuts,
            'Legumes': FoodCategory.Legumes,
            'Spices': FoodCategory.Spices,
            'Beverages': FoodCategory.Beverages,
            'Processed': FoodCategory.Processed,
            'Other': FoodCategory.Other,
          };
          return categoryMap[cat] || FoodCategory.Other;
        })
        .filter((cat, index, arr) => arr.indexOf(cat) === index); // Remove duplicates

      newFood.categories = mappedCategories.length > 0 ? mappedCategories : [FoodCategory.Other];
      newFood.description = result.description;
      newFood.calories = result.calories || 0;
      newFood.protein = result.protein || 0;
      newFood.carbs = result.carbs || 0;
      newFood.fat = result.fat || 0;
      newFood.fiber = result.fiber || 0;
      newFood.sugar = result.sugar || 0;
      newFood.sodium = result.sodium || 0;
      newFood.servingSizes = result.servingSizes || [{ size: 100, unit: 'g', description: 'Khẩu phần chuẩn' }];
      newFood.micronutrients = result.micronutrients || {};
      newFood.allergens = result.allergens || [];
      newFood.cookingMethods = result.cookingMethods || []; // Now accepts any string array
      newFood.keywords = [result.name.toLowerCase(), result.nameEn?.toLowerCase()].filter(Boolean);
      newFood.isVerified = false; // AI generated foods are not verified
      newFood.isDeleted = false;

      this.logger.log(`AI generated food: ${newFood.name}`);

      return newFood;

    } catch (error) {
      this.logger.error('Error generating food with AI:', error);
      return null;
    }
  }
}
