import { IsString, IsEnum, IsOptional, IsNumber, IsArray, Min, Max, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { FoodCategory } from '../entities/food.entity';

export class FoodSearchDto {
  @ApiProperty({ description: 'Từ khóa tìm kiếm', example: 'gạo', required: false })
  @IsString()
  @IsOptional()
  query?: string;

  @ApiProperty({ enum: FoodCategory, isArray: true, description: 'Danh mục thực phẩm (ngăn cách bằng dấu phẩy)', required: false })
  @IsString()
  @IsOptional()
  categories?: string;

  @ApiProperty({ description: 'Tên danh mục tìm kiếm', example: 'grains', required: false })
  @IsString()
  @IsOptional()
  categoryName?: string;

  @ApiProperty({ description: 'Thương hiệu', example: 'Vinafood', required: false })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({ description: 'Chất gây dị ứng', example: ['Gluten'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  hasAllergens?: string[];

  @ApiProperty({ description: 'Calories tối thiểu', example: 100, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  minCalories?: number;

  @ApiProperty({ description: 'Calories tối đa', example: 500, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  maxCalories?: number;

  @ApiProperty({ description: 'Protein tối thiểu (g)', example: 5, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  minProtein?: number;

  @ApiProperty({ description: 'Protein tối đa (g)', example: 50, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  maxProtein?: number;

  @ApiProperty({ description: 'Trang hiện tại', example: 1, required: false })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty({ description: 'Số lượng mỗi trang', example: 10, required: false })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({ description: 'Bắt buộc tạo mới bằng AI', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  forceAI?: boolean = false;
}
