import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    description: 'Username or email',
    example: 'john_doe'
  })
  @IsString()
  username: string;

  @ApiProperty({ 
    description: 'Password',
    example: 'password123',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;
} 