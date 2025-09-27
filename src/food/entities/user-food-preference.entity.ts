import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Food } from './food.entity';

@Entity('user_food_preferences')
@Index(['userId', 'foodId'], { unique: true })
export class UserFoodPreference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  foodId: number;

  @Column({ type: 'int', default: 3 })
  preferenceLevel: number; // 1-5: 1=dislike, 3=neutral, 5=like

  @Column({ type: 'text', nullable: true })
  dislikeReason?: string;

  @Column({ type: 'boolean', default: false })
  isAllergic: boolean;

  @Column({ type: 'text', nullable: true })
  allergicReaction?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.foodPreferences)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Food, (food) => food.userPreferences)
  @JoinColumn({ name: 'foodId' })
  food: Food;
} 