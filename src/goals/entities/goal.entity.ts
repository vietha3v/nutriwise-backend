import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

export enum GoalType {
  LOSE_WEIGHT = 'LOSE_WEIGHT',
  MAINTAIN_WEIGHT = 'MAINTAIN_WEIGHT',
  GAIN_WEIGHT = 'GAIN_WEIGHT',
  BUILD_MUSCLE = 'BUILD_MUSCLE',
  IMPROVE_HEALTH = 'IMPROVE_HEALTH'
}

export enum GoalStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED'
}

@Entity('goals')
@Index(['userId', 'status'])
@Index(['userId', 'priority'])
export class Goal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: GoalType
  })
  goalType: GoalType;

  @Column('text')
  description: string;

  @Column({ type: 'int', default: 1 })
  priority: number;

  @Column({ type: 'enum', enum: GoalStatus, default: GoalStatus.ACTIVE })
  status: GoalStatus;

  // Mục tiêu cụ thể
  @Column({ type: 'float', nullable: true })
  targetWeight: number;

  @Column({ type: 'float', nullable: true })
  targetBodyFat: number;

  @Column({ type: 'float', nullable: true })
  targetMuscleMass: number;

  @Column({ type: 'float', nullable: true })
  targetVisceralFat: number;

  // Mục tiêu dinh dưỡng
  @Column({ type: 'int', nullable: true })
  targetCalories: number;

  @Column({ type: 'float', nullable: true })
  targetProtein: number;

  @Column({ type: 'float', nullable: true })
  targetCarbs: number;

  @Column({ type: 'float', nullable: true })
  targetFats: number;

  @Column({ type: 'float', nullable: true })
  targetWater: number;

  // Thời gian
  @ApiProperty({ 
    description: 'Ngày bắt đầu mục tiêu',
    example: new Date().toISOString()
  })
  @Column({ type: 'date' })
  startDate: Date;

  @ApiProperty({ 
    description: 'Ngày mục tiêu dự kiến',
    example: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    nullable: true
  })
  @Column({ type: 'date', nullable: true })
  targetDate: Date;

  @ApiProperty({ 
    description: 'Thời gian tạo mục tiêu',
    example: new Date().toISOString()
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ 
    description: 'Thời gian cập nhật cuối',
    example: new Date().toISOString()
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'int', nullable: true })
  estimatedDuration: number; // Số tuần

  // Dữ liệu từ AI suggestion
  @Column({ type: 'jsonb', nullable: true })
  aiSuggestionData: object;

  @Column({ type: 'jsonb', nullable: true })
  nutritionPlan: object;

  @Column({ type: 'jsonb', nullable: true })
  exercisePlan: object;

  @ManyToOne(() => User, user => user.goals)
  @JoinColumn({ name: 'userId' })
  user: User;
}
