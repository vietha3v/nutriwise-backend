import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  Index,
} from 'typeorm';
import { UserFoodPreference } from './user-food-preference.entity';

export enum FoodCategory {
  Meat = 'Meat',
  Fish = 'Fish',
  Vegetables = 'Vegetables',
  Fruits = 'Fruits',
  Grains = 'Grains',
  Dairy = 'Dairy',
  Nuts = 'Nuts',
  Legumes = 'Legumes',
  Spices = 'Spices',
  Beverages = 'Beverages',
  Processed = 'Processed',
  Other = 'Other',
}

export enum CookingMethod {
  Raw = 'Raw',
  Boiled = 'Boiled',
  Steamed = 'Steamed',
  Grilled = 'Grilled',
  Fried = 'Fried',
  Baked = 'Baked',
  StirFried = 'StirFried',
  SlowCooked = 'SlowCooked',
  Other = 'Other',
}

@Entity('foods')
@Index(['name', 'brand'])
@Index(['categories'])
export class Food {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nameEn?: string;

  @Column({
    type: 'enum',
    enum: FoodCategory,
    array: true,
    default: [FoodCategory.Other],
  })
  categories: FoodCategory[];

  @Column({ type: 'varchar', length: 100, nullable: true })
  brand?: string;

  @Column({ type: 'jsonb', default: [] })
  servingSizes: Array<{
    size: number;
    unit: string;
    description?: string;
  }>;

  // Basic nutrition information (main components)
  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0, transformer: { to: (value: number) => value, from: (value: string) => parseFloat(value) || 0 } })
  calories: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0, transformer: { to: (value: number) => value, from: (value: string) => parseFloat(value) || 0 } })
  protein: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0, transformer: { to: (value: number) => value, from: (value: string) => parseFloat(value) || 0 } })
  carbs: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0, transformer: { to: (value: number) => value, from: (value: string) => parseFloat(value) || 0 } })
  fat: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0, transformer: { to: (value: number) => value, from: (value: string) => parseFloat(value) || 0 } })
  fiber: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0, transformer: { to: (value: number) => value, from: (value: string) => parseFloat(value) || 0 } })
  sugar: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0, transformer: { to: (value: number) => value, from: (value: string) => parseFloat(value) || 0 } })
  sodium: number;

  // Micronutrients (vitamins and minerals) - stored as JSON
  @Column({ type: 'jsonb', default: {} })
  micronutrients: {
    // Vitamins
    vitaminA?: number;
    vitaminC?: number;
    vitaminD?: number;
    vitaminE?: number;
    vitaminK?: number;
    vitaminB1?: number;
    vitaminB2?: number;
    vitaminB3?: number;
    vitaminB6?: number;
    vitaminB12?: number;
    folate?: number;
    // Minerals
    calcium?: number;
    iron?: number;
    magnesium?: number;
    phosphorus?: number;
    potassium?: number;
    zinc?: number;
    copper?: number;
    manganese?: number;
    selenium?: number;
    // Other micronutrients can be added here
    [key: string]: number | undefined;
  };

  // Allergens and cooking methods
  @Column({ type: 'text', array: true, default: [] })
  allergens: string[];

  @Column({ type: 'text', array: true, default: [] })
  cookingMethods: string[];

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl?: string;

  @Column({ type: 'text', array: true, default: [] })
  keywords: string[];

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => UserFoodPreference, (preference) => preference.food)
  userPreferences: UserFoodPreference[];
} 