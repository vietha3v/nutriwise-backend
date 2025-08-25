import { ApiProperty } from '@nestjs/swagger';

export class WaterResponseDto {
  @ApiProperty({ example: 1, description: 'ID của bản ghi uống nước' })
  id: number;

  @ApiProperty({ example: 250, description: 'Lượng nước uống (ml)' })
  amount: number;

  @ApiProperty({ 
    example: '2024-01-15T10:30:00.000Z', 
    description: 'Thời gian uống nước (ISO 8601)' 
  })
  datetime: string;

  @ApiProperty({ 
    example: '2024-01-15T10:30:00.000Z', 
    description: 'Thời gian tạo bản ghi' 
  })
  createdAt: string;

  @ApiProperty({ 
    example: '2024-01-15T10:30:00.000Z', 
    description: 'Thời gian cập nhật bản ghi' 
  })
  updatedAt: string;
}
