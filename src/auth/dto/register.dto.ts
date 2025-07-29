import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ 
    description: 'Username for the account',
    example: 'john_doe',
    minLength: 3
  })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ 
    description: 'Email address',
    example: 'john.doe@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'Password (minimum 6 characters)',
    example: 'password123',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;
} 