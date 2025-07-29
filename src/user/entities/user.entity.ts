import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

@Entity('users')
export class User {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Username' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ description: 'Email address' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'Hashed password' })
  @Column()
  password: string;

  @ApiProperty({ enum: Role, description: 'User role' })
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User
  })
  role: Role;

  @ApiProperty({ description: 'Whether user is verified' })
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty({ description: 'Password reset token' })
  @Column({ nullable: true })
  resetPasswordToken: string;

  @ApiProperty({ description: 'Password reset token expiry' })
  @Column({ nullable: true })
  resetPasswordExpires: Date;

  // Social login fields
  @ApiProperty({ description: 'Google ID for OAuth', required: false })
  @Column({ nullable: true, unique: true })
  googleId: string;

  @ApiProperty({ description: 'Facebook ID for OAuth', required: false })
  @Column({ nullable: true, unique: true })
  facebookId: string;

  @ApiProperty({ description: 'Profile picture URL', required: false })
  @Column({ nullable: true })
  profilePicture: string;

  @ApiProperty({ description: 'User display name', required: false })
  @Column({ nullable: true })
  displayName: string;

  @ApiProperty({ description: 'User locale', required: false })
  @Column({ nullable: true })
  locale: string;

  @ApiProperty({ description: 'User timezone', required: false })
  @Column({ nullable: true })
  timezone: string;

  @ApiProperty({ description: 'Whether user is deleted' })
  @Column({ default: false })
  isDeleted: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations - sử dụng string để tránh circular dependency
  @OneToOne('Profile', 'user')
  profile: any;

  @OneToMany('Meal', 'user')
  meals: any[];

  @OneToMany('WaterIntake', 'user')
  waterIntakes: any[];

  @OneToMany('Exercise', 'user')
  exercises: any[];

  @OneToMany('NutritionGoal', 'user')
  nutritionGoals: any[];

  @OneToMany('AiCache', 'user')
  aiCaches: any[];

  // Food system relations
  @OneToMany('UserFoodPreference', 'user')
  foodPreferences: any[];

  @OneToMany('DailyFoodAvailability', 'user')
  dailyFoodAvailabilities: any[];

  @OneToMany('MealSuggestion', 'user')
  mealSuggestions: any[];
} 