import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

@Entity('users')
export class User {
  @ApiProperty({ 
    description: 'ID duy nhất của người dùng',
    example: 1
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    description: 'Tên đăng nhập (unique)',
    example: 'john_doe'
  })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ 
    description: 'Địa chỉ email (unique)',
    example: 'john.doe@example.com'
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ 
    description: 'Mật khẩu đã mã hóa',
    example: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.i8eO'
  })
  @Column()
  password: string;

  @ApiProperty({ 
    enum: Role, 
    description: 'Vai trò người dùng',
    example: Role.User
  })
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User
  })
  role: Role;

  @ApiProperty({ 
    description: 'Trạng thái xác thực tài khoản',
    example: false
  })
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty({ 
    description: 'Token reset mật khẩu',
    example: 'reset_token_123456',
    nullable: true
  })
  @Column({ nullable: true })
  resetPasswordToken: string;

  @ApiProperty({ 
    description: 'Thời gian hết hạn token reset mật khẩu',
    example: '2024-01-01T12:00:00.000Z',
    nullable: true
  })
  @Column({ nullable: true })
  resetPasswordExpires: Date;

  // Social login fields
  @ApiProperty({ 
    description: 'ID từ Google OAuth',
    example: '123456789',
    nullable: true
  })
  @Column({ nullable: true, unique: true })
  googleId: string;

  @ApiProperty({ 
    description: 'ID từ Facebook OAuth',
    example: '987654321',
    nullable: true
  })
  @Column({ nullable: true, unique: true })
  facebookId: string;

  @ApiProperty({ 
    description: 'URL ảnh đại diện',
    example: 'https://example.com/avatar.jpg',
    nullable: true
  })
  @Column({ nullable: true })
  profilePicture: string;

  @ApiProperty({ 
    description: 'Tên hiển thị',
    example: 'John Doe',
    nullable: true
  })
  @Column({ nullable: true })
  displayName: string;

  @ApiProperty({ 
    description: 'Ngôn ngữ',
    example: 'vi',
    nullable: true
  })
  @Column({ nullable: true })
  locale: string;

  @ApiProperty({ 
    description: 'Múi giờ',
    example: 'Asia/Ho_Chi_Minh',
    nullable: true
  })
  @Column({ nullable: true })
  timezone: string;

  @ApiProperty({ 
    description: 'Trạng thái xóa mềm',
    example: false
  })
  @Column({ default: false })
  isDeleted: boolean;

  @ApiProperty({ 
    description: 'Thời gian tạo tài khoản',
    example: '2024-01-01T00:00:00.000Z'
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ 
    description: 'Thời gian cập nhật cuối',
    example: '2024-01-01T12:00:00.000Z'
  })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations - sử dụng string để tránh circular dependency
  @OneToMany('Profile', 'user')
  profiles: any[];

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