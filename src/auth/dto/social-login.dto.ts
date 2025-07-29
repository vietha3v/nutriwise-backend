import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

export class SocialLoginDto {
  @ApiProperty({ 
    description: 'Social provider ID (Google ID or Facebook ID)',
    example: '123456789'
  })
  @IsString()
  socialId: string;

  @ApiProperty({ 
    description: 'Email from social provider',
    example: 'john.doe@gmail.com'
  })
  @IsString()
  email: string;

  @ApiProperty({ 
    description: 'Display name from social provider',
    example: 'John Doe'
  })
  @IsString()
  displayName: string;

  @ApiProperty({ 
    description: 'Profile picture URL from social provider',
    required: false,
    example: 'https://lh3.googleusercontent.com/a/ACg8ocJ...'
  })
  @IsString()
  @IsOptional()
  profilePicture?: string;

  @ApiProperty({ 
    description: 'User locale from social provider',
    required: false,
    example: 'en_US'
  })
  @IsString()
  @IsOptional()
  locale?: string;

  @ApiProperty({ 
    description: 'User timezone from social provider',
    required: false,
    example: 'America/New_York'
  })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiProperty({ 
    enum: Role, 
    description: 'User role',
    example: Role.User
  })
  @IsEnum(Role)
  role: Role = Role.User;
} 