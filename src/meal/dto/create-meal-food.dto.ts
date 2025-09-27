import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMealFoodDto {
  @ApiProperty({
    description: 'ID thực phẩm từ database',
    example: 1,
    required: false
  })
  @IsNumber()
  @IsOptional()
  foodId?: number;

  @ApiProperty({
    description: 'Tên thực phẩm',
    example: 'Gạo lứt'
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Số lượng',
    example: 100,
    minimum: 0
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Đơn vị đo',
    example: 'g'
  })
  @IsString()
  unit: string;

  @ApiProperty({
    description: 'Calories',
    example: 350,
    minimum: 0
  })
  @IsNumber()
  @IsOptional()
  calories?: number;

  @ApiProperty({
    description: 'Protein (g)',
    example: 8,
    minimum: 0
  })
  @IsNumber()
  @IsOptional()
  protein?: number;

  @ApiProperty({
    description: 'Carbs (g)',
    example: 75,
    minimum: 0
  })
  @IsNumber()
  @IsOptional()
  carbs?: number;

  @ApiProperty({
    description: 'Fat (g)',
    example: 2,
    minimum: 0
  })
  @IsNumber()
  @IsOptional()
  fat?: number;

  @ApiProperty({
    description: 'Fiber (g)',
    example: 3,
    minimum: 0
  })
  @IsNumber()
  @IsOptional()
  fiber?: number;

  @ApiProperty({
    description: 'Sugar (g)',
    example: 1,
    minimum: 0
  })
  @IsNumber()
  @IsOptional()
  sugar?: number;

  @ApiProperty({
    description: 'Sodium (mg)',
    example: 5,
    minimum: 0
  })
  @IsNumber()
  @IsOptional()
  sodium?: number;

  @ApiProperty({
    description: 'Mã vạch thực phẩm',
    required: false,
    example: '1234567890123'
  })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiProperty({
    description: 'Ghi chú',
    required: false,
    example: 'Gạo lứt hữu cơ'
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
