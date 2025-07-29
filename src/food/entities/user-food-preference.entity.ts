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

@Entity('user_food_preferences')
export class UserFoodPreference {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'User ID' })
  @Column()
  userId: number;

  @ApiProperty({ description: 'Food ID' })
  @Column()
  foodId: number;

  @ApiProperty({ description: 'Mức độ yêu thích (1-5)' })
  @Column({ type: 'integer', default: 3 })
  preferenceLevel: number; // 1: không thích, 5: rất thích

  @ApiProperty({ description: 'Lý do không thích' })
  @Column({ type: 'text', nullable: true })
  dislikeReason: string;

  @ApiProperty({ description: 'Dị ứng với thực phẩm này' })
  @Column({ default: false })
  isAllergic: boolean;

  @ApiProperty({ description: 'Thời gian tạo' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Thời gian cập nhật' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne('User', 'foodPreferences')
  @JoinColumn({ name: 'userId' })
  user: any;

  @ManyToOne('Food', 'userPreferences')
  @JoinColumn({ name: 'foodId' })
  food: any;
} 