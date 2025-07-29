import { IsString, IsNumber, IsEnum, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender, ActivityLevel, GoalType } from '../../common/enums/role.enum';

export class CreateProfileDto {
  @ApiProperty({ 
    description: 'First name of the user',
    example: 'John'
  })
  @IsString()
  firstName: string;

  @ApiProperty({ 
    description: 'Last name of the user',
    example: 'Doe'
  })
  @IsString()
  lastName: string;

  @ApiProperty({ 
    description: 'Age of the user',
    example: 30,
    minimum: 1,
    maximum: 120
  })
  @IsNumber()
  age: number;

  @ApiProperty({ 
    description: 'Height in cm',
    example: 175,
    minimum: 50,
    maximum: 250
  })
  @IsNumber()
  height: number;

  @ApiProperty({ 
    description: 'Weight in kg',
    example: 70,
    minimum: 20,
    maximum: 300
  })
  @IsNumber()
  weight: number;

  @ApiProperty({ 
    enum: Gender, 
    description: 'Gender of the user',
    example: Gender.Male
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ 
    enum: ActivityLevel, 
    description: 'Activity level',
    example: ActivityLevel.ModeratelyActive
  })
  @IsEnum(ActivityLevel)
  activityLevel: ActivityLevel;

  @ApiProperty({ 
    enum: GoalType, 
    description: 'Fitness goal type',
    example: GoalType.WeightLoss
  })
  @IsEnum(GoalType)
  goalType: GoalType;

  @ApiProperty({ 
    type: [String], 
    description: 'Food allergies',
    required: false,
    example: ['Peanuts', 'Shellfish']
  })
  @IsArray()
  @IsOptional()
  allergies?: string[];

  @ApiProperty({ 
    type: [String], 
    description: 'Dietary restrictions',
    required: false,
    example: ['Vegetarian', 'Gluten-free']
  })
  @IsArray()
  @IsOptional()
  dietaryRestrictions?: string[];

  @ApiProperty({ 
    type: [String], 
    description: 'Food preferences',
    required: false,
    example: ['Low-carb', 'High-protein']
  })
  @IsArray()
  @IsOptional()
  preferences?: string[];

  @ApiProperty({ 
    description: 'User ID',
    required: false,
    example: 1
  })
  @IsNumber()
  @IsOptional()
  userId?: number;
} 