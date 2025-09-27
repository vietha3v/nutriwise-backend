import { IsNumber, IsOptional, IsString, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFoodPreferenceDto {
  @ApiProperty({ description: 'ID thực phẩm', example: 1 })
  @IsNumber()
  foodId: number;

  @ApiProperty({ description: 'Mức độ ưa thích (1-5)', example: 4, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  preferenceLevel: number;

  @ApiProperty({ description: 'Lý do không thích', example: 'Không hợp khẩu vị', required: false })
  @IsString()
  @IsOptional()
  dislikeReason?: string;

  @ApiProperty({ description: 'Có dị ứng không', example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isAllergic?: boolean;

  @ApiProperty({ description: 'Phản ứng dị ứng', example: 'Nổi mẩn ngứa', required: false })
  @IsString()
  @IsOptional()
  allergicReaction?: string;

  @ApiProperty({ description: 'Ghi chú', example: 'Thích ăn vào buổi sáng', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
