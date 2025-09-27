import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Food } from '../../food/entities/food.entity';

@Entity('meal_foods')
export class MealFood {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column()
  unit: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  calories: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  protein: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  carbs: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fat: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fiber: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  sugar: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  sodium: number;

  @Column({ nullable: true })
  barcode: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @ManyToOne('Meal', 'mealFoods', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mealId' })
  meal: any;

  @Column()
  mealId: number;

  @Column({ nullable: true })
  foodId: number;

  @ManyToOne(() => Food, { nullable: true })
  @JoinColumn({ name: 'foodId' })
  food: Food;
} 