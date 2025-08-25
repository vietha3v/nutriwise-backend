import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ChatRequestDto {
  @ApiProperty({
    description: 'Nội dung tin nhắn từ người dùng. Có thể là: text thông thường, URL file, hoặc base64 data (data:image/jpeg;base64,/9j/4AAQ...). Hỗ trợ voice/audio và image.',
    example: 'Tôi muốn tạo profile mới',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Platform nơi gửi tin nhắn',
    example: 'web',
    required: false,
  })
  @IsOptional()
  @IsString()
  platform?: string;

  @ApiProperty({
    description: 'ID người dùng trên platform',
    example: '123',
    required: false,
  })
  @IsOptional()
  @IsString()
  platformUserId?: string;

  @ApiProperty({
    description: 'Loại nội dung',
    example: 'text',
    required: false,
  })
  @IsOptional()
  @IsString()
  contentType?: string;
}
