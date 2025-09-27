import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum StatsPeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year'
}

export class ExerciseStatsDto {
  @ApiProperty({ 
    description: 'Stats period',
    enum: StatsPeriod,
    required: false,
    example: StatsPeriod.WEEK
  })
  @IsOptional()
  @IsEnum(StatsPeriod)
  period?: StatsPeriod = StatsPeriod.WEEK;

  @ApiProperty({ 
    description: 'Start date for stats (YYYY-MM-DD)',
    required: false,
    example: '2024-01-01'
  })
  @IsOptional()
  @IsString()
  startDate?: string;
}
