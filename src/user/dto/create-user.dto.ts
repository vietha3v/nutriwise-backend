import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ 
    description: 'Tên đăng nhập (tối thiểu 3 ký tự)',
    example: 'jane_doe',
    minLength: 3,
    maxLength: 50
  })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ 
    description: 'Địa chỉ email hợp lệ',
    example: 'jane.doe@example.com',
    format: 'email'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'Mật khẩu (tối thiểu 6 ký tự)',
    example: 'password123',
    minLength: 6,
    format: 'password'
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ 
    description: 'Vai trò người dùng (mặc định: User)',
    enum: Role,
    example: Role.User,
    required: false
  })
  @IsOptional()
  role?: Role;
} 