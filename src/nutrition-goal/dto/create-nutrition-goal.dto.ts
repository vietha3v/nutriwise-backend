import { IsEnum, IsNumber, IsDateString, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GoalType } from '../../common/enums/role.enum';

export class CreateNutritionGoalDto {
  @ApiProperty({ 
    enum: GoalType, 
    description: 'Type of nutrition goal',
    example: GoalType.WeightLoss
  })
  @IsEnum(GoalType)
  goalType: GoalType;

  @ApiProperty({ 
    description: 'Target weight in kg',
    example: 65,
    minimum: 20,
    maximum: 300
  })
  @IsNumber()
  targetWeight: number;

  @ApiProperty({ 
    description: 'Current weight in kg',
    example: 75,
    minimum: 20,
    maximum: 300
  })
  @IsNumber()
  currentWeight: number;

  @ApiProperty({ 
    description: 'Daily calorie goal',
    example: 2000,
    minimum: 800,
    maximum: 5000
  })
  @IsNumber()
  dailyCalorieGoal: number;

  @ApiProperty({ 
    description: 'Daily protein goal in grams',
    example: 150,
    minimum: 20,
    maximum: 500
  })
  @IsNumber()
  dailyProteinGoal: number;

  @ApiProperty({ 
    description: 'Daily carb goal in grams',
    example: 200,
    minimum: 20,
    maximum: 800
  })
  @IsNumber()
  dailyCarbGoal: number;

  @ApiProperty({ 
    description: 'Daily fat goal in grams',
    example: 65,
    minimum: 20,
    maximum: 200
  })
  @IsNumber()
  dailyFatGoal: number;

  @ApiProperty({ 
    description: 'Daily water goal in ml',
    example: 2500,
    minimum: 500,
    maximum: 10000
  })
  @IsNumber()
  dailyWaterGoal: number;

  @ApiProperty({ 
    description: 'Start date of the goal (ISO format)',
    example: new Date().toISOString()
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({ 
    description: 'Target date to achieve the goal (ISO format)',
    example: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
  })
  @IsDateString()
  targetDate: string;

  @ApiProperty({ 
    description: 'Whether the goal is active',
    example: true,
    default: true
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ 
    description: 'Notes about the nutrition goal',
    required: false,
    example: 'Focus on high protein diet for muscle gain'
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