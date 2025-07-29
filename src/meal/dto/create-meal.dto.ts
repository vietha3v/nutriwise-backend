import { IsString, IsEnum, IsDateString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MealType } from '../../common/enums/role.enum';

export class CreateMealDto {
  @ApiProperty({
    description: 'Name of the meal',
    example: 'Breakfast'
  })
  @IsString()
  name: string;

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
    description: 'Total calories of the meal',
    example: 450,
    minimum: 0
  })
  @IsNumber()
  totalCalories: number;

  @ApiProperty({
    description: 'Total protein in grams',
    example: 25,
    minimum: 0
  })
  @IsNumber()
  totalProtein: number;

  @ApiProperty({
    description: 'Total carbohydrates in grams',
    example: 60,
    minimum: 0
  })
  @IsNumber()
  totalCarbs: number;

  @ApiProperty({
    description: 'Total fat in grams',
    example: 15,
    minimum: 0
  })
  @IsNumber()
  totalFat: number;

  @ApiProperty({
    description: 'Notes about the meal',
    required: false,
    example: 'Healthy breakfast with eggs and whole grain bread'
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'User ID',
    example: 1
  })
  @IsNumber()
  userId: number;
} 