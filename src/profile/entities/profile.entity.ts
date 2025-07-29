import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
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

  @Column({ type: 'simple-array', nullable: true })
  allergies: string[];

  @Column({ type: 'simple-array', nullable: true })
  dietaryRestrictions: string[];

  @Column({ type: 'simple-array', nullable: true })
  preferences: string[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne('User', 'profile', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: any;

  @Column({ unique: true })
  userId: number;
} 