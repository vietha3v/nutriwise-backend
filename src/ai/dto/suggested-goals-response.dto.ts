import { ApiProperty } from '@nestjs/swagger';

export class HealthAssessmentDto {
  @ApiProperty({ enum: ['GOOD', 'AVERAGE', 'NEEDS_IMPROVEMENT'] })
  overallHealth: 'GOOD' | 'AVERAGE' | 'NEEDS_IMPROVEMENT';

  @ApiProperty({ enum: ['ECTOMORPH', 'MESOMORPH', 'ENDOMORPH'] })
  bodyType: 'ECTOMORPH' | 'MESOMORPH' | 'ENDOMORPH';

  @ApiProperty({ description: 'Điểm sức khỏe tổng thể (0-100)' })
  healthScore: number;

  @ApiProperty({ description: 'Phân tích cân nặng' })
  weightAnalysis: {
    status: 'UNDERWEIGHT' | 'NORMAL' | 'OVERWEIGHT' | 'OBESE';
    recommendation: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  };

  @ApiProperty({ description: 'Phân tích tỷ lệ mỡ' })
  bodyFatAnalysis: {
    status: 'LOW' | 'NORMAL' | 'HIGH' | 'VERY_HIGH';
    recommendation: string;
    healthRisks: string[];
  };

  @ApiProperty({ description: 'Phân tích cơ bắp' })
  muscleAnalysis: {
    status: 'LOW' | 'NORMAL' | 'HIGH';
    recommendation: string;
    potential: string;
  };

  @ApiProperty({ description: 'Phân tích mỡ nội tạng' })
  visceralFatAnalysis: {
    status: 'LOW' | 'NORMAL' | 'HIGH';
    recommendation: string;
    healthRisks: string[];
  };
}

export class SuggestedGoalDto {
  @ApiProperty({ description: 'ID gợi ý mục tiêu' })
  id: string;

  @ApiProperty({ description: 'Tên mục tiêu' })
  name: string;

  @ApiProperty({ 
    enum: ['LOSE_WEIGHT', 'MAINTAIN_WEIGHT', 'GAIN_WEIGHT', 'BUILD_MUSCLE', 'IMPROVE_HEALTH'],
    description: 'Loại mục tiêu'
  })
  goalType: 'LOSE_WEIGHT' | 'MAINTAIN_WEIGHT' | 'GAIN_WEIGHT' | 'BUILD_MUSCLE' | 'IMPROVE_HEALTH';

  @ApiProperty({ description: 'Mô tả mục tiêu' })
  description: string;

  @ApiProperty({ description: 'Thứ tự ưu tiên (1-10)' })
  priority: number;

  @ApiProperty({ description: 'Thời gian ước tính (tuần)' })
  estimatedDuration: number;

  @ApiProperty({ enum: ['EASY', 'MEDIUM', 'HARD'], description: 'Độ khó' })
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';

  @ApiProperty({ description: 'Tỷ lệ thành công (%)' })
  successRate: number;

  @ApiProperty({ description: 'Các mục tiêu cụ thể' })
  targets: {
    weight?: number;
    bodyFat?: number;
    muscleMass?: number;
    visceralFat?: number;
  };

  @ApiProperty({ description: 'Kế hoạch dinh dưỡng' })
  nutritionPlan: {
    targetCalories: number;
    targetProtein: number;
    targetCarbs: number;
    targetFats: number;
    targetWater: number;
    mealTiming: string[];
    foodRecommendations: string[];
    restrictions: string[];
  };

  @ApiProperty({ description: 'Kế hoạch tập luyện' })
  exercisePlan: {
    frequency: string;
    duration: string;
    intensity: string;
    exercises: string[];
    equipment: string[];
    progression: string;
  };

  @ApiProperty({ description: 'Lý do đề xuất' })
  reasoning: {
    healthFactors: string[];
    benefits: string[];
    risks: string[];
  };

  @ApiProperty({ description: 'Cảnh báo' })
  warnings: string[];

  @ApiProperty({ description: 'Ghi chú' })
  notes: string[];
}

export class SuggestedGoalsResponseDto {
  @ApiProperty({ description: 'Đánh giá sức khỏe' })
  healthAssessment: HealthAssessmentDto;

  @ApiProperty({ description: 'So sánh với tiêu chuẩn' })
  comparisonWithStandards: {
    ageGroup: string;
    genderGroup: string;
    percentile: number;
    ranking: 'BOTTOM_25%' | '25-50%' | '50-75%' | 'TOP_25%';
  };

  @ApiProperty({ description: 'Các vấn đề sức khỏe' })
  healthIssues: {
    immediate: string[];
    longTerm: string[];
    recommendations: string[];
  };

  @ApiProperty({ type: [SuggestedGoalDto], description: 'Danh sách gợi ý mục tiêu' })
  suggestedGoals: SuggestedGoalDto[];

  @ApiProperty({ description: 'Tùy chọn tạo mục tiêu tùy chỉnh' })
  customGoalOption: {
    description: string;
    allowCustom: boolean;
    guidance: string;
  };

  @ApiProperty({ description: 'Tóm tắt tổng quan' })
  summary: {
    totalSuggestions: number;
    primaryGoal: string;
    estimatedTimeline: string;
    overallSuccessRate: number;
  };
}
