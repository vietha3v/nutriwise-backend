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

@Entity('daily_food_availability')
export class DailyFoodAvailability {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'User ID' })
  @Column()
  userId: number;

  @ApiProperty({ description: 'Ngày' })
  @Column({ type: 'date' })
  date: Date;

  @ApiProperty({ description: 'Danh sách thực phẩm có sẵn (JSON)' })
  @Column({ type: 'jsonb' })
  availableFoods: {
    foodId: number;
    foodName: string;
    quantity: number;
    unit: string;
    notes?: string;
  }[];

  @ApiProperty({ description: 'Ghi chú bổ sung' })
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ApiProperty({ description: 'Thời gian tạo' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Thời gian cập nhật' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne('User', 'dailyFoodAvailabilities')
  @JoinColumn({ name: 'userId' })
  user: any;
} 