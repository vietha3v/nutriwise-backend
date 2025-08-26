import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('meal_suggestions')
export class MealSuggestion {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'User ID' })
  @Column()
  userId: number;

  @ApiProperty({ description: 'Ngày gợi ý' })
  @Column({ type: 'date' })
  date: Date;

  @ApiProperty({ description: 'Loại bữa ăn' })
  @Column()
  mealType: string; // 'breakfast', 'lunch', 'dinner', 'snack'

  @ApiProperty({ description: 'Gợi ý bữa ăn từ AI (JSON)' })
  @Column({ type: 'jsonb' })
  suggestion: {
    mealName: string;
    ingredients: {
      foodId: number;
      foodName: string;
      quantity: number;
      unit: string;
    }[];
    nutritionInfo: {
      totalCalories: number;
      totalProtein: number;
      totalCarbs: number;
      totalFat: number;
    };
    cookingInstructions: string[];
    estimatedCookingTime: number; // minutes
    difficulty: string; // 'easy', 'medium', 'hard'
    tips: string[];
  };

  @ApiProperty({ description: 'Nguồn gợi ý' })
  @Column()
  source: string; // 'manual', 'system'

  @ApiProperty({ description: 'Người dùng đã chọn gợi ý này' })
  @Column({ default: false })
  isSelected: boolean;

  @ApiProperty({ description: 'Đánh giá của người dùng (1-5)' })
  @Column({ type: 'integer', nullable: true })
  userRating: number;

  @ApiProperty({ description: 'Phản hồi của người dùng' })
  @Column({ type: 'text', nullable: true })
  userFeedback: string;

  @ApiProperty({ description: 'Thời gian tạo' })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @ApiProperty({ description: 'Thời gian cập nhật' })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @ManyToOne('User', 'mealSuggestions')
  @JoinColumn({ name: 'userId' })
  user: any;
} 