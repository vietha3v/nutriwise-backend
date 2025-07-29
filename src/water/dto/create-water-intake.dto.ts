import { IsNumber, IsDateString, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWaterIntakeDto {
  @ApiProperty({
    description: 'Amount of water in ml',
    example: 250,
    minimum: 1
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Date of water intake (ISO format)',
    example: new Date().toISOString()
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Time of water intake (HH:MM)',
    example: '10:30'
  })
  @IsString()
  time: string;

  @ApiProperty({
    description: 'Notes about water intake',
    required: false,
    example: 'After workout'
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'User ID',
    example: 1
  })
  @IsNumber()
  userId: number;
} 