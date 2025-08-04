import { IsString, IsNumber, IsEnum, IsArray, IsOptional, IsDecimal } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender, ActivityLevel, GoalType } from '../../common/enums/role.enum';

export class CreateProfileDto {
  @ApiProperty({ 
    description: 'Tên của người dùng',
    example: 'Nguyễn'
  })
  @IsString()
  firstName: string;

  @ApiProperty({ 
    description: 'Họ của người dùng',
    example: 'Văn A'
  })
  @IsString()
  lastName: string;

  @ApiProperty({ 
    description: 'Tuổi của người dùng',
    example: 25,
    minimum: 1,
    maximum: 120
  })
  @IsNumber()
  age: number;

  @ApiProperty({ 
    description: 'Chiều cao (cm)',
    example: 170,
    minimum: 50,
    maximum: 250
  })
  @IsNumber()
  height: number;

  @ApiProperty({ 
    description: 'Cân nặng (kg)',
    example: 65,
    minimum: 20,
    maximum: 300
  })
  @IsNumber()
  weight: number;

  @ApiProperty({ 
    enum: Gender, 
    description: 'Giới tính của người dùng',
    example: Gender.Male
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ 
    enum: ActivityLevel, 
    description: 'Mức độ hoạt động',
    example: ActivityLevel.ModeratelyActive
  })
  @IsEnum(ActivityLevel)
  activityLevel: ActivityLevel;

  @ApiProperty({ 
    enum: GoalType, 
    description: 'Loại mục tiêu thể hình',
    example: GoalType.WeightLoss
  })
  @IsEnum(GoalType)
  goalType: GoalType;

  @ApiProperty({ 
    type: [String], 
    description: 'Mục tiêu cá nhân cụ thể (người dùng tự chọn)',
    required: false,
    example: ['Giảm mỡ bụng', 'Tăng vòng ngực', 'Cải thiện sức bền', 'Tăng cơ tay']
  })
  @IsArray()
  @IsOptional()
  personalGoals?: string[];

  // === CHỈ SỐ INBODY ===
  
  @ApiProperty({ 
    description: 'Tổng lượng nước trong cơ thể (L)',
    required: false,
    example: 45.2
  })
  @IsNumber()
  @IsOptional()
  totalBodyWater?: number;

  @ApiProperty({ 
    description: 'Nước nội bào (L)',
    required: false,
    example: 28.5
  })
  @IsNumber()
  @IsOptional()
  intracellularWater?: number;

  @ApiProperty({ 
    description: 'Nước ngoại bào (L)',
    required: false,
    example: 16.7
  })
  @IsNumber()
  @IsOptional()
  extracellularWater?: number;

  @ApiProperty({ 
    description: 'Tỷ lệ ICW/ECW',
    required: false,
    example: 1.71
  })
  @IsNumber()
  @IsOptional()
  icwEcwRatio?: number;

  @ApiProperty({ 
    description: 'Mỡ dưới da (kg)',
    required: false,
    example: 12.5
  })
  @IsNumber()
  @IsOptional()
  subcutaneousFat?: number;

  @ApiProperty({ 
    description: 'Tỷ lệ mỡ dưới da (%)',
    required: false,
    example: 18.5
  })
  @IsNumber()
  @IsOptional()
  subcutaneousFatPercentage?: number;

  @ApiProperty({ 
    description: 'Mỡ nội tạng (kg)',
    required: false,
    example: 2.1
  })
  @IsNumber()
  @IsOptional()
  visceralFat?: number;

  @ApiProperty({ 
    description: 'Chỉ số mỡ nội tạng (1-30)',
    required: false,
    example: 7
  })
  @IsNumber()
  @IsOptional()
  visceralFatLevel?: number;

  @ApiProperty({ 
    description: 'Diện tích mỡ nội tạng (cm²)',
    required: false,
    example: 85.2
  })
  @IsNumber()
  @IsOptional()
  visceralFatArea?: number;

  @ApiProperty({ 
    description: 'Khối lượng cơ xương (kg)',
    required: false,
    example: 32.0
  })
  @IsNumber()
  @IsOptional()
  skeletalMuscleMass?: number;

  @ApiProperty({ 
    description: 'Tỷ lệ cơ bắp (%)',
    required: false,
    example: 42.5
  })
  @IsNumber()
  @IsOptional()
  muscleMassPercentage?: number;

  @ApiProperty({ 
    description: 'Chỉ số cơ bắp (SMM)',
    required: false,
    example: 8.2
  })
  @IsNumber()
  @IsOptional()
  smmIndex?: number;

  @ApiProperty({ 
    description: 'Chỉ số khối cơ thể (BMI)',
    required: false,
    example: 22.8
  })
  @IsNumber()
  @IsOptional()
  bmi?: number;

  @ApiProperty({ 
    description: 'Phân loại BMI',
    required: false,
    example: 'Normal'
  })
  @IsString()
  @IsOptional()
  bmiCategory?: string;

  @ApiProperty({ 
    description: 'Chỉ số khối không mỡ (FFMI)',
    required: false,
    example: 18.5
  })
  @IsNumber()
  @IsOptional()
  ffmi?: number;

  @ApiProperty({ 
    description: 'Tỷ lệ mỡ cơ thể (%)',
    required: false,
    example: 18.5
  })
  @IsNumber()
  @IsOptional()
  bodyFatPercentage?: number;

  @ApiProperty({ 
    description: 'Khối lượng xương (kg)',
    required: false,
    example: 3.2
  })
  @IsNumber()
  @IsOptional()
  boneMass?: number;

  @ApiProperty({ 
    description: 'Tỷ lệ xương (%)',
    required: false,
    example: 4.5
  })
  @IsNumber()
  @IsOptional()
  boneMassPercentage?: number;

  // === CHỈ SỐ DINH DƯỠNG ===
  @ApiProperty({ 
    description: 'Tỷ lệ trao đổi chất cơ bản (kcal/ngày)',
    required: false,
    example: 1600
  })
  @IsNumber()
  @IsOptional()
  bmr?: number;

  @ApiProperty({ 
    description: 'Tổng năng lượng tiêu thụ hàng ngày (kcal/ngày)',
    required: false,
    example: 2200
  })
  @IsNumber()
  @IsOptional()
  tdee?: number;

  @ApiProperty({ 
    description: 'Mục tiêu calo hàng ngày',
    required: false,
    example: 2000
  })
  @IsNumber()
  @IsOptional()
  dailyCalorieGoal?: number;

  @ApiProperty({ 
    description: 'Mục tiêu protein hàng ngày (g)',
    required: false,
    example: 150
  })
  @IsNumber()
  @IsOptional()
  dailyProteinGoal?: number;

  @ApiProperty({ 
    description: 'Mục tiêu carb hàng ngày (g)',
    required: false,
    example: 250
  })
  @IsNumber()
  @IsOptional()
  dailyCarbGoal?: number;

  @ApiProperty({ 
    description: 'Mục tiêu fat hàng ngày (g)',
    required: false,
    example: 67
  })
  @IsNumber()
  @IsOptional()
  dailyFatGoal?: number;

  @ApiProperty({ 
    description: 'Mục tiêu nước hàng ngày (ml)',
    required: false,
    example: 2500
  })
  @IsNumber()
  @IsOptional()
  dailyWaterGoal?: number;

  // === THÔNG TIN Y TẾ ===
  @ApiProperty({ 
    type: [String], 
    description: 'Dị ứng thực phẩm',
    required: false,
    example: ['Đậu phộng', 'Hải sản']
  })
  @IsArray()
  @IsOptional()
  allergies?: string[];

  @ApiProperty({ 
    type: [String], 
    description: 'Bệnh nền, bệnh lý',
    required: false,
    example: ['Tiểu đường', 'Cao huyết áp', 'Bệnh tim']
  })
  @IsArray()
  @IsOptional()
  medicalConditions?: string[];

  @ApiProperty({ 
    type: [String], 
    description: 'Vấn đề sức khỏe hiện tại',
    required: false,
    example: ['Đau khớp', 'Mất ngủ', 'Stress']
  })
  @IsArray()
  @IsOptional()
  healthIssues?: string[];

  @ApiProperty({ 
    description: 'Ghi chú bổ sung',
    required: false,
    example: 'Đo sau kỳ nghỉ Tết'
  })
  @IsString()
  @IsOptional()
  notes?: string;
} 