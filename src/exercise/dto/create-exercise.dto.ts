import { IsString, IsEnum, IsDateString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ExerciseType } from '../../common/enums/role.enum';

export class CreateExerciseDto {
  @ApiProperty({
    description: 'Name of the exercise',
    example: 'Morning Run'
  })
  @IsString()
  name: string;

  @ApiProperty({
    enum: ExerciseType,
    description: 'Type of exercise',
    example: ExerciseType.Cardio
  })
  @IsEnum(ExerciseType)
  type: ExerciseType;

  @ApiProperty({
    description: 'Date of the exercise (ISO format)',
    example: new Date().toISOString()
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Time of the exercise (HH:MM)',
    example: '07:00'
  })
  @IsString()
  time: string;

  @ApiProperty({
    description: 'Duration of exercise in minutes',
    example: 45,
    minimum: 1
  })
  @IsNumber()
  duration: number;

  @ApiProperty({
    description: 'Calories burned during exercise',
    example: 300,
    minimum: 0
  })
  @IsNumber()
  caloriesBurned: number;

  @ApiProperty({
    description: 'Notes about the exercise',
    required: false,
    example: 'Felt great today, increased pace'
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