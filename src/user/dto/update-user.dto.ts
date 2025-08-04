import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, MinLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class UpdateUserDto {
  @ApiProperty({ 
    description: 'Tên đăng nhập mới (tối thiểu 3 ký tự)',
    example: 'jane_doe_updated',
    minLength: 3,
    maxLength: 50,
    required: false
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;

  @ApiProperty({ 
    description: 'Địa chỉ email mới',
    example: 'jane.doe.updated@example.com',
    format: 'email',
    required: false
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ 
    description: 'Vai trò mới',
    enum: Role,
    example: Role.Trainer,
    required: false
  })
  @IsOptional()
  role?: Role;

  @ApiProperty({ 
    description: 'Trạng thái xác thực',
    example: true,
    required: false
  })
  @IsOptional()
  isVerified?: boolean;
} 