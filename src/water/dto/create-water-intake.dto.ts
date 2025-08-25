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
    description: 'Datetime of water intake (ISO 8601)',
    example: new Date().toISOString(),
  })
  @IsDateString()
  datetime: string;
} 