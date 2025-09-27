import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePantryFoodDto {
  @ApiProperty({ description: 'ID của thực phẩm' })
  @IsNumber()
  @Type(() => Number)
  foodId: number;

  @ApiPropertyOptional({ description: 'Số lượng thực phẩm', minimum: 0 })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  amount?: number;
}
