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

@Entity('foods')
export class Food {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Tên thực phẩm' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Danh mục thực phẩm' })
  @Column()
  category: string; // 'protein', 'vegetable', 'fruit', 'grain', 'dairy', 'spice', etc.

  @ApiProperty({ description: 'Thông tin dinh dưỡng cơ bản (JSON)' })
  @Column({ type: 'jsonb' })
  nutritionInfo: {
    caloriesPer100g: number;
    proteinPer100g: number;
    carbsPer100g: number;
    fatPer100g: number;
    fiberPer100g?: number;
  };

  @ApiProperty({ description: 'Cách chế biến phổ biến' })
  @Column({ type: 'simple-array', nullable: true })
  cookingMethods: string[]; // ['raw', 'steamed', 'fried', 'baked', 'boiled']

  @ApiProperty({ description: 'Mùa vụ' })
  @Column({ type: 'simple-array', nullable: true })
  seasons: string[]; // ['spring', 'summer', 'autumn', 'winter', 'all-year']

  @ApiProperty({ description: 'Thực phẩm có sẵn' })
  @Column({ default: true })
  isAvailable: boolean;

  @ApiProperty({ description: 'Thời gian tạo' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Thời gian cập nhật' })
  @UpdateDateColumn()
  updatedAt: Date;
} 