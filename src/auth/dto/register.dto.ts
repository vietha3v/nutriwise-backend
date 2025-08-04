import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ 
    description: 'Tên đăng nhập (tối thiểu 3 ký tự)',
    example: 'john_doe',
    minLength: 3,
    maxLength: 50
  })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ 
    description: 'Địa chỉ email hợp lệ',
    example: 'john.doe@example.com',
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
} 