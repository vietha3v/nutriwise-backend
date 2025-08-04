import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    description: 'Tên đăng nhập hoặc email',
    example: 'john_doe',
    examples: {
      username: { value: 'john_doe', summary: 'Đăng nhập bằng username' },
      email: { value: 'john.doe@example.com', summary: 'Đăng nhập bằng email' }
    }
  })
  @IsString()
  username: string;

  @ApiProperty({ 
    description: 'Mật khẩu',
    example: 'password123',
    minLength: 6,
    format: 'password'
  })
  @IsString()
  @MinLength(6)
  password: string;
} 