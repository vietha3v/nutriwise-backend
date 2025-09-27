import { IsString, IsEnum, IsDateString, IsOptional, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MealType } from '../../common/enums/role.enum';

export class CreateMealFoodDto {
  @ApiProperty({
    description: 'Food ID',
    example: 1
  })
  @IsNumber()
  foodId: number;

  @ApiProperty({
    description: 'Quantity of the food',
    example: 100
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Unit of measurement',
    example: 'g'
  })
  @IsString()
  unit: string;
}

export class CreateMealDto {
  @ApiProperty({
    enum: MealType,
    description: 'Type of meal',
    example: MealType.Breakfast
  })
  @IsEnum(MealType)
  type: MealType;

  @ApiProperty({
    description: 'Date of the meal (ISO format)',
    example: new Date().toISOString()
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Time of the meal (HH:MM)',
    example: '12:30'
  })
  @IsString()
  time: string;

  @ApiProperty({
    description: 'Notes about the meal',
    required: false,
    example: 'Healthy breakfast with eggs and whole grain bread'
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'List of foods in the meal with quantities',
    type: [CreateMealFoodDto],
    example: [
      {
        foodId: 1,
        quantity: 100,
        unit: 'g'
      },
      {
        foodId: 2,
        quantity: 2,
        unit: 'pieces'
      }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMealFoodDto)
  mealFoods: CreateMealFoodDto[];
} 