import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Gender, ActivityLevel, GoalType } from '../../common/enums/role.enum';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'integer' })
  age: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  height: number; // in cm

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  weight: number; // in kg

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  goalWeight: number; // in kg

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column({
    type: 'enum',
    enum: ActivityLevel,
  })
  activityLevel: ActivityLevel;

  @Column({
    type: 'enum',
    enum: GoalType,
  })
  goalType: GoalType;

  @Column({ type: 'simple-array', nullable: true })
  personalGoals: string[];

  // === CHỈ SỐ INBODY ===
  
  // Chỉ số nước (Total Body Water)
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  totalBodyWater: number; // Tổng lượng nước (L)

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  intracellularWater: number; // Nước nội bào (L)

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  extracellularWater: number; // Nước ngoại bào (L)

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  icwEcwRatio: number; // Tỷ lệ ICW/ECW

  // Mỡ dưới da (Subcutaneous Fat)
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  subcutaneousFat: number; // Tổng lượng mỡ dưới da (kg)

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  subcutaneousFatPercentage: number; // Tỷ lệ mỡ dưới da (%)

  // Mỡ nội tạng (Visceral Fat)
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  visceralFat: number; // Lượng mỡ nội tạng (kg)

  @Column({ type: 'integer', nullable: true })
  visceralFatLevel: number; // Chỉ số mỡ nội tạng (1-30)

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  visceralFatArea: number; // Diện tích mỡ nội tạng (cm²)

  // Cơ bắp (Skeletal Muscle Mass)
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  skeletalMuscleMass: number; // Khối lượng cơ xương (kg)

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  muscleMassPercentage: number; // Tỷ lệ cơ bắp (%)

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  smmIndex: number; // Chỉ số cơ bắp (SMM)

  // Chỉ số khối cơ thể (BMI)
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  bmi: number; // BMI hiện tại

  @Column({ type: 'varchar', length: 20, nullable: true })
  bmiCategory: string; // Phân loại BMI: Underweight, Normal, Overweight, Obese

  // Chỉ số khối không mỡ (FFMI)
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  ffmi: number; // Fat-Free Mass Index

  // Tỷ lệ cơ thể
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  bodyFatPercentage: number; // Tỷ lệ mỡ cơ thể (%)

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  boneMass: number; // Khối lượng xương (kg)

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  boneMassPercentage: number; // Tỷ lệ xương (%)

  // === CHỈ SỐ DINH DƯỠNG ===
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  bmr: number; // Basal Metabolic Rate

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  tdee: number; // Total Daily Energy Expenditure

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  dailyCalorieGoal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  dailyProteinGoal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  dailyCarbGoal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  dailyFatGoal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  dailyWaterGoal: number; // in ml

  // === THÔNG TIN Y TẾ ===
  @Column({ type: 'simple-array', nullable: true })
  allergies: string[];

  @Column({ type: 'simple-array', nullable: true })
  medicalConditions: string[];

  @Column({ type: 'simple-array', nullable: true })
  healthIssues: string[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  // === HÌNH MẪU LÝ TƯỞNG ===
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  idealWeight: number; // Cân nặng lý tưởng

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  idealBodyFatPercentage: number; // Tỷ lệ mỡ lý tưởng

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  idealMuscleMass: number; // Khối lượng cơ lý tưởng

  @Column({ type: 'varchar', length: 20, nullable: true })
  healthAssessment: string; // Đánh giá sức khỏe: Perfect, Good, Average, Needs Improvement

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne('User', 'profiles', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: any;

  @Column({ unique: false })
  userId: number;
} 