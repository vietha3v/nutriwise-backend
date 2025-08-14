import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChatRequestDto {
  @ApiProperty({
    description: 'Nội dung tin nhắn từ người dùng. Có thể là: text thông thường, URL file, hoặc base64 data (data:image/jpeg;base64,/9j/4AAQ...). Hỗ trợ voice/audio và image.',
    example: 'Tôi muốn tạo profile mới',
  })
  @IsString()
  message: string;
}
