import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GoalType } from '../../common/enums/role.enum';

@Entity('nutrition_goals')
export class NutritionGoal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: GoalType,
  })
  goalType: GoalType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  targetWeight: number; // in kg

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  currentWeight: number; // in kg

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  dailyCalorieGoal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  dailyProteinGoal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  dailyCarbGoal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  dailyFatGoal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  dailyWaterGoal: number; // in ml

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  targetDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne('User', 'nutritionGoals', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: any;

  @Column()
  userId: number;
} 