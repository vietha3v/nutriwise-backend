import { IsOptional, IsString, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BodyPart, ExerciseType } from '../entities/exercise-template.entity';

export class ExerciseTemplateSearchDto {
  @ApiProperty({ 
    description: 'Search by name or description',
    required: false,
    example: 'yoga'
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ 
    description: 'Filter by body part',
    enum: BodyPart,
    required: false,
    example: BodyPart.FULL_BODY
  })
  @IsOptional()
  @IsEnum(BodyPart)
  bodyPart?: BodyPart;

  @ApiProperty({ 
    description: 'Filter by exercise type',
    enum: ExerciseType,
    required: false,
    example: ExerciseType.CARDIO
  })
  @IsOptional()
  @IsEnum(ExerciseType)
  exerciseType?: ExerciseType;

  @ApiProperty({ 
    description: 'Filter by difficulty level (1-5)',
    required: false,
    example: 3,
    minimum: 1,
    maximum: 5
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  difficultyLevel?: number;

  @ApiProperty({ 
    description: 'Page number',
    required: false,
    example: 1,
    minimum: 1
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ 
    description: 'Items per page',
    required: false,
    example: 20,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
