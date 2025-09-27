import { IsString, IsEnum, IsNumber, IsArray, IsOptional, Min, Max, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BodyPart, ExerciseType } from '../entities/exercise-template.entity';

export class CreateExerciseTemplateDto {
  @ApiProperty({ 
    description: 'Exercise name',
    example: 'Cardio HIIT 20 phút'
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Exercise description',
    required: false,
    example: 'Bài tập cardio cường độ cao giúp đốt cháy calo hiệu quả'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Exercise instructions (JSON array)',
    required: false,
    example: ['Bước 1: Khởi động 5 phút', 'Bước 2: Tập động tác A', 'Bước 3: Nghỉ 30 giây']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  instructions?: string[];

  @ApiProperty({ 
    description: 'YouTube video URL',
    required: false,
    example: 'https://www.youtube.com/watch?v=LXb3EKWsInQ'
  })
  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @ApiProperty({ 
    description: 'Thumbnail image URL',
    required: false,
    example: 'https://img.youtube.com/vi/LXb3EKWsInQ/maxresdefault.jpg'
  })
  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @ApiProperty({ 
    description: 'Body part targeted',
    enum: BodyPart,
    example: BodyPart.FULL_BODY
  })
  @IsEnum(BodyPart)
  bodyPart: BodyPart;

  @ApiProperty({ 
    description: 'Exercise type',
    enum: ExerciseType,
    example: ExerciseType.CARDIO
  })
  @IsEnum(ExerciseType)
  exerciseType: ExerciseType;

  @ApiProperty({ 
    description: 'Difficulty level (1-5)',
    example: 3,
    minimum: 1,
    maximum: 5
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  difficultyLevel: number;

  @ApiProperty({ 
    description: 'Duration in minutes',
    example: 20,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  durationMinutes: number;

  @ApiProperty({ 
    description: 'Calories per minute',
    example: 8.5,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  caloriesPerMinute: number;

  @ApiProperty({ 
    description: 'Equipment needed',
    required: false,
    example: ['Thảm tập', 'Tạ tay 2kg'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  equipmentNeeded?: string[];

  @ApiProperty({ 
    description: 'Target muscles',
    required: false,
    example: ['Cơ bụng', 'Cơ đùi', 'Cơ tay'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  targetMuscles?: string[];
}
