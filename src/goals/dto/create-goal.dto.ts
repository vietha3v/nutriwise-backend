import { IsString, IsEnum, IsNumber, IsOptional, IsDateString, IsObject, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GoalType, GoalStatus } from '../entities/goal.entity';

export class CreateGoalDto {
  @ApiProperty({ description: 'Tên mục tiêu' })
  @IsString()
  name: string;

  @ApiProperty({ enum: GoalType, description: 'Loại mục tiêu' })
  @IsEnum(GoalType)
  goalType: GoalType;

  @ApiProperty({ description: 'Mô tả mục tiêu' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ description: 'Thứ tự ưu tiên', minimum: 1, maximum: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  priority?: number;

  @ApiPropertyOptional({ enum: GoalStatus, description: 'Trạng thái mục tiêu' })
  @IsOptional()
  @IsEnum(GoalStatus)
  status?: GoalStatus;

  // Mục tiêu cụ thể
  @ApiPropertyOptional({ description: 'Cân nặng mục tiêu (kg)' })
  @IsOptional()
  @IsNumber()
  targetWeight?: number;

  @ApiPropertyOptional({ description: 'Tỷ lệ mỡ mục tiêu (%)' })
  @IsOptional()
  @IsNumber()
  targetBodyFat?: number;

  @ApiPropertyOptional({ description: 'Khối lượng cơ mục tiêu (kg)' })
  @IsOptional()
  @IsNumber()
  targetMuscleMass?: number;

  @ApiPropertyOptional({ description: 'Mỡ nội tạng mục tiêu' })
  @IsOptional()
  @IsNumber()
  targetVisceralFat?: number;

  // Mục tiêu dinh dưỡng
  @ApiPropertyOptional({ description: 'Calo mục tiêu mỗi ngày' })
  @IsOptional()
  @IsNumber()
  targetCalories?: number;

  @ApiPropertyOptional({ description: 'Protein mục tiêu (g)' })
  @IsOptional()
  @IsNumber()
  targetProtein?: number;

  @ApiPropertyOptional({ description: 'Carb mục tiêu (g)' })
  @IsOptional()
  @IsNumber()
  targetCarbs?: number;

  @ApiPropertyOptional({ description: 'Fat mục tiêu (g)' })
  @IsOptional()
  @IsNumber()
  targetFats?: number;

  @ApiPropertyOptional({ description: 'Nước mục tiêu (lít)' })
  @IsOptional()
  @IsNumber()
  targetWater?: number;

  // Thời gian
  @ApiProperty({ 
    description: 'Ngày bắt đầu (ISO 8601 format: YYYY-MM-DD)',
    example: new Date().toISOString().split('T')[0]
  })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ 
    description: 'Ngày mục tiêu (ISO 8601 format: YYYY-MM-DD) - thường cách ngày bắt đầu 3-7 ngày',
    example: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  })
  @IsOptional()
  @IsDateString()
  targetDate?: string;

  @ApiPropertyOptional({ description: 'Thời gian ước tính (tuần)' })
  @IsOptional()
  @IsNumber()
  estimatedDuration?: number;

  // Dữ liệu từ AI suggestion
  @ApiPropertyOptional({ description: 'Dữ liệu gợi ý AI' })
  @IsOptional()
  @IsObject()
  aiSuggestionData?: object;

  @ApiPropertyOptional({ description: 'Kế hoạch dinh dưỡng' })
  @IsOptional()
  @IsObject()
  nutritionPlan?: object;

  @ApiPropertyOptional({ description: 'Kế hoạch tập luyện' })
  @IsOptional()
  @IsObject()
  exercisePlan?: object;
}
