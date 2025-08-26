import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { MealType } from '../../common/enums/role.enum';

@Entity('meals')
export class Meal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: MealType,
  })
  type: MealType;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  time: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalCalories: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalProtein: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalCarbs: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalFat: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalFiber: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalSugar: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalSodium: number;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @ManyToOne('User', 'meals', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: any;

  @Column()
  userId: number;

  @OneToMany('MealFood', 'meal', { cascade: true })
  mealFoods: any[];
} 