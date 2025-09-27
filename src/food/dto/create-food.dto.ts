import { IsString, IsEnum, IsOptional, IsNumber, IsArray, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FoodCategory, CookingMethod } from '../entities/food.entity';

export class CreateFoodDto {
  @ApiProperty({ description: 'Tên thực phẩm', example: 'Gạo lứt' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Tên tiếng Anh', example: 'Brown Rice', required: false })
  @IsString()
  @IsOptional()
  nameEn?: string;

  @ApiProperty({ enum: FoodCategory, isArray: true, description: 'Danh mục thực phẩm', example: [FoodCategory.Grains] })
  @IsArray()
  @IsEnum(FoodCategory, { each: true })
  categories: FoodCategory[];



  @ApiProperty({ description: 'Thương hiệu', example: 'Vinafood', required: false })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({ 
    description: 'Danh sách các đơn vị đo khác nhau', 
    example: [
      { size: 100, unit: 'g', description: '100g' },
      { size: 1, unit: 'kg', description: '1kg' },
      { size: 1, unit: 'piece', description: '1 quả' }
    ],
    required: false 
  })
  @IsArray()
  @IsOptional()
  servingSizes?: Array<{
    size: number;
    unit: string;
    description?: string;
  }>;

  @ApiProperty({ description: 'Kích thước khẩu phần chuẩn', example: 100 })
  @IsNumber()
  @Min(0)
  servingSize: number;

  @ApiProperty({ description: 'Đơn vị khẩu phần chuẩn', example: 'g' })
  @IsString()
  servingUnit: string;

  // Nutrition information
  @ApiProperty({ description: 'Calories', example: 350, minimum: 0 })
  @IsNumber()
  @Min(0)
  calories: number;

  @ApiProperty({ description: 'Protein (g)', example: 8, minimum: 0 })
  @IsNumber()
  @Min(0)
  protein: number;

  @ApiProperty({ description: 'Carbs (g)', example: 75, minimum: 0 })
  @IsNumber()
  @Min(0)
  carbs: number;

  @ApiProperty({ description: 'Fat (g)', example: 2, minimum: 0 })
  @IsNumber()
  @Min(0)
  fat: number;

  @ApiProperty({ description: 'Fiber (g)', example: 3, minimum: 0 })
  @IsNumber()
  @Min(0)
  fiber: number;

  @ApiProperty({ description: 'Sugar (g)', example: 1, minimum: 0 })
  @IsNumber()
  @Min(0)
  sugar: number;

  @ApiProperty({ description: 'Sodium (mg)', example: 5, minimum: 0 })
  @IsNumber()
  @Min(0)
  sodium: number;

  // Micronutrients (vitamins and minerals)
  @ApiProperty({ 
    description: 'Thành phần vi lượng (vitamin và khoáng chất)', 
    example: {
      vitaminA: 0,
      vitaminC: 0,
      vitaminD: 0,
      vitaminE: 0,
      vitaminK: 0,
      vitaminB1: 0.1,
      vitaminB2: 0.05,
      vitaminB3: 1.6,
      vitaminB6: 0.2,
      vitaminB12: 0,
      folate: 8,
      calcium: 10,
      iron: 0.8,
      magnesium: 43,
      phosphorus: 115,
      potassium: 115,
      zinc: 1.2,
      copper: 0.2,
      manganese: 1.1,
      selenium: 15
    },
    required: false 
  })
  @IsOptional()
  micronutrients?: {
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

  // Allergens and cooking methods
  @ApiProperty({ description: 'Danh sách chất gây dị ứng', example: ['Gluten', 'Lactose'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergens?: string[];

  @ApiProperty({ enum: CookingMethod, isArray: true, description: 'Phương pháp nấu ăn', required: false })
  @IsArray()
  @IsEnum(CookingMethod, { each: true })
  @IsOptional()
  cookingMethods?: CookingMethod[];

  @ApiProperty({ description: 'Mô tả thực phẩm', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'URL hình ảnh', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ description: 'Từ khóa tìm kiếm', example: ['gạo', 'rice', 'cơm'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keywords?: string[];

  @ApiProperty({ description: 'Đã xác minh', example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}
