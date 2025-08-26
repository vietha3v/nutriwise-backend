import { ApiProperty } from '@nestjs/swagger';
import { Gender, ActivityLevel, GoalType } from '../../common/enums/role.enum';

export class ProfileResponseDto {
  @ApiProperty({ example: 1, description: 'ID của profile' })
  id: number;

  @ApiProperty({ example: 'Nguyễn', description: 'Tên' })
  firstName: string;

  @ApiProperty({ example: 'Văn A', description: 'Họ' })
  lastName: string;

  @ApiProperty({ example: 25, description: 'Tuổi' })
  age: number;

  @ApiProperty({ example: 170.5, description: 'Chiều cao (cm)' })
  height: number;

  @ApiProperty({ example: 65.2, description: 'Cân nặng (kg)' })
  weight: number;

  @ApiProperty({ example: 70.0, description: 'Cân nặng mục tiêu (kg)' })
  goalWeight: number;

  @ApiProperty({ enum: Gender, example: 'Male', description: 'Giới tính' })
  gender: Gender;

  @ApiProperty({ enum: ActivityLevel, example: 'ModeratelyActive', description: 'Mức độ hoạt động' })
  activityLevel: ActivityLevel;

  @ApiProperty({ enum: GoalType, example: 'LoseWeight', description: 'Mục tiêu' })
  goalType: GoalType;

  @ApiProperty({ 
    type: [String], 
    example: ['Giảm cân', 'Tăng cơ'], 
    description: 'Mục tiêu cá nhân' 
  })
  personalGoals: string[];

  // === CHỈ SỐ INBODY ===
  @ApiProperty({ example: 35.5, description: 'Tổng lượng nước (L)' })
  totalBodyWater: number;

  @ApiProperty({ example: 23.8, description: 'Nước nội bào (L)' })
  intracellularWater: number;

  @ApiProperty({ example: 11.7, description: 'Nước ngoại bào (L)' })
  extracellularWater: number;

  @ApiProperty({ example: 2.03, description: 'Tỷ lệ ICW/ECW' })
  icwEcwRatio: number;

  @ApiProperty({ example: 8.5, description: 'Tổng lượng mỡ dưới da (kg)' })
  subcutaneousFat: number;

  @ApiProperty({ example: 12.3, description: 'Tỷ lệ mỡ dưới da (%)' })
  subcutaneousFatPercentage: number;

  @ApiProperty({ example: 1.2, description: 'Lượng mỡ nội tạng (kg)' })
  visceralFat: number;

  @ApiProperty({ example: 8, description: 'Chỉ số mỡ nội tạng (1-30)' })
  visceralFatLevel: number;

  @ApiProperty({ example: 45.6, description: 'Diện tích mỡ nội tạng (cm²)' })
  visceralFatArea: number;

  @ApiProperty({ example: 28.5, description: 'Khối lượng cơ xương (kg)' })
  skeletalMuscleMass: number;

  @ApiProperty({ example: 43.8, description: 'Tỷ lệ cơ bắp (%)' })
  muscleMassPercentage: number;

  @ApiProperty({ example: 9.8, description: 'Chỉ số cơ bắp (SMM)' })
  smmIndex: number;

  @ApiProperty({ example: 22.5, description: 'BMI hiện tại' })
  bmi: number;

  @ApiProperty({ example: 'Normal', description: 'Phân loại BMI' })
  bmiCategory: string;

  @ApiProperty({ example: 20.8, description: 'Fat-Free Mass Index' })
  ffmi: number;

  @ApiProperty({ example: 18.5, description: 'Tỷ lệ mỡ cơ thể (%)' })
  bodyFatPercentage: number;

  @ApiProperty({ example: 2.8, description: 'Khối lượng xương (kg)' })
  boneMass: number;

  @ApiProperty({ example: 4.3, description: 'Tỷ lệ xương (%)' })
  boneMassPercentage: number;

  // === CHỈ SỐ DINH DƯỠNG ===
  @ApiProperty({ example: 1456, description: 'Basal Metabolic Rate' })
  bmr: number;

  @ApiProperty({ example: 2257, description: 'Total Daily Energy Expenditure' })
  tdee: number;

  @ApiProperty({ example: 2000, description: 'Mục tiêu calo hàng ngày' })
  dailyCalorieGoal: number;

  @ApiProperty({ example: 150, description: 'Mục tiêu protein hàng ngày (g)' })
  dailyProteinGoal: number;

  @ApiProperty({ example: 200, description: 'Mục tiêu carb hàng ngày (g)' })
  dailyCarbGoal: number;

  @ApiProperty({ example: 67, description: 'Mục tiêu fat hàng ngày (g)' })
  dailyFatGoal: number;

  @ApiProperty({ example: 2500, description: 'Mục tiêu nước hàng ngày (ml)' })
  dailyWaterGoal: number;

  // === THÔNG TIN Y TẾ ===
  @ApiProperty({ 
    type: [String], 
    example: ['Đậu phộng', 'Hải sản'], 
    description: 'Danh sách dị ứng' 
  })
  allergies: string[];

  @ApiProperty({ 
    type: [String], 
    example: ['Tiểu đường'], 
    description: 'Danh sách bệnh nền' 
  })
  medicalConditions: string[];

  @ApiProperty({ 
    type: [String], 
    example: ['Đau lưng'], 
    description: 'Danh sách vấn đề sức khỏe' 
  })
  healthIssues: string[];

  @ApiProperty({ 
    example: 'Ghi chú về tình trạng sức khỏe', 
    description: 'Ghi chú bổ sung' 
  })
  notes: string;

  // === HÌNH MẪU LÝ TƯỞNG ===
  @ApiProperty({ example: 68.0, description: 'Cân nặng lý tưởng' })
  idealWeight: number;

  @ApiProperty({ example: 15.0, description: 'Tỷ lệ mỡ lý tưởng' })
  idealBodyFatPercentage: number;

  @ApiProperty({ example: 30.5, description: 'Khối lượng cơ lý tưởng' })
  idealMuscleMass: number;

  @ApiProperty({ example: 'Good', description: 'Đánh giá sức khỏe' })
  healthAssessment: string;

  @ApiProperty({ 
    example: '2024-01-15T10:30:00.000Z', 
    description: 'Thời gian tạo profile' 
  })
  createdAt: string;

  @ApiProperty({ 
    example: '2024-01-15T10:30:00.000Z', 
    description: 'Thời gian cập nhật profile' 
  })
  updatedAt: string;
}
