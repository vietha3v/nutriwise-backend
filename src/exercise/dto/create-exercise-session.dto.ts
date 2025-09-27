import { IsNumber, IsString, IsOptional, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExerciseSessionDto {
  @ApiProperty({ 
    description: 'Template ID to base session on',
    example: 1
  })
  @IsNumber()
  templateId: number;

  @ApiProperty({ 
    description: 'Session start time (ISO timestamp)',
    example: '2024-01-15T08:30:00Z'
  })
  @IsDateString()
  startedAt: string;

  @ApiProperty({ 
    description: 'Duration in minutes',
    example: 20,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ 
    description: 'User notes (optional)',
    required: false,
    example: 'Tập sáng, cảm thấy tốt',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
