import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Food } from './food.entity';

@Entity('pantry_items')
export class PantryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  foodId: number;

  @Column({ 
    type: 'decimal', 
    precision: 8, 
    scale: 2, 
    default: 0
  })
  amount: number;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Food)
  @JoinColumn({ name: 'foodId' })
  food: Food;
}
