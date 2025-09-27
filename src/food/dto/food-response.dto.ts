import { ApiProperty } from '@nestjs/swagger';
import { FoodCategory } from '../entities/food.entity';

export class FoodResponseDto {
  @ApiProperty({ description: 'ID thực phẩm' })
  id: number;

  @ApiProperty({ description: 'Tên thực phẩm' })
  name: string;

  @ApiProperty({ description: 'Tên thực phẩm bằng tiếng Anh', required: false })
  nameEn?: string;

  @ApiProperty({ enum: FoodCategory, isArray: true, description: 'Danh mục thực phẩm' })
  categories: FoodCategory[];

  @ApiProperty({ description: 'Thương hiệu', required: false })
  brand?: string;

  @ApiProperty({ description: 'Thông tin khẩu phần', type: 'array' })
  servingSizes: Array<{
    size: number;
    unit: string;
    description?: string;
  }>;

  @ApiProperty({ description: 'Calories' })
  calories: number;

  @ApiProperty({ description: 'Protein (g)' })
  protein: number;

  @ApiProperty({ description: 'Carbohydrate (g)' })
  carbs: number;

  @ApiProperty({ description: 'Fat (g)' })
  fat: number;

  @ApiProperty({ description: 'Fiber (g)' })
  fiber: number;

  @ApiProperty({ description: 'Sugar (g)' })
  sugar: number;

  @ApiProperty({ description: 'Sodium (mg)' })
  sodium: number;

  @ApiProperty({ 
    description: 'Vi chất dinh dưỡng', 
    type: 'object',
    additionalProperties: { type: 'number' }
  })
  micronutrients: {
    vitaminA?: number;
    vitaminC?: number;
    vitaminD?: number;
    vitaminE?: number;
    vitaminK?: number;
    vitaminB1?: number;
    vitaminB2?: number;
    vitaminB3?: number;
    vitaminB6?: number;
    vitaminB12?: number;
    folate?: number;
    calcium?: number;
    iron?: number;
    magnesium?: number;
    phosphorus?: number;
    potassium?: number;
    zinc?: number;
    copper?: number;
    manganese?: number;
    selenium?: number;
    [key: string]: number | undefined;
  };

  @ApiProperty({ description: 'Chất gây dị ứng', type: 'array' })
  allergens: string[];

  @ApiProperty({ description: 'Phương pháp nấu', type: 'array' })
  cookingMethods: string[];

  @ApiProperty({ description: 'Mô tả', required: false })
  description?: string;

  @ApiProperty({ description: 'URL hình ảnh', required: false })
  imageUrl?: string;

  @ApiProperty({ description: 'Từ khóa', type: 'array' })
  keywords: string[];

  @ApiProperty({ description: 'Đã được xác minh' })
  isVerified: boolean;

  @ApiProperty({ description: 'Ngày tạo' })
  createdAt: Date;

  @ApiProperty({ description: 'Ngày cập nhật' })
  updatedAt: Date;

  // Thông tin bổ sung cho user
  @ApiProperty({ description: 'Có trong tủ đồ của user không' })
  isInPantry: boolean;

  @ApiProperty({ description: 'Số lượng trong tủ đồ', required: false })
  pantryAmount?: number;

  @ApiProperty({ description: 'Đánh giá của user (1-5)', required: false })
  rating?: number;

  @ApiProperty({ description: 'Lý do không thích', required: false })
  dislikeReason?: string;

  @ApiProperty({ description: 'Có dị ứng không' })
  isAllergic: boolean;

  @ApiProperty({ description: 'Phản ứng dị ứng', required: false })
  allergicReaction?: string;

  @ApiProperty({ description: 'Ghi chú', required: false })
  notes?: string;
}

export class FoodSearchResponseDto {
  @ApiProperty({ description: 'Danh sách thực phẩm', type: [FoodResponseDto] })
  foods: FoodResponseDto[];

  @ApiProperty({ description: 'Tổng số kết quả' })
  total: number;

  @ApiProperty({ description: 'Trang hiện tại' })
  page: number;

  @ApiProperty({ description: 'Số lượng mỗi trang' })
  limit: number;

  @ApiProperty({ description: 'Tổng số trang' })
  totalPages: number;
}
