import { ApiProperty } from '@nestjs/swagger';
import { MessageType } from '../entities/chat-message.entity';
import { Platform } from '../entities/user-platform.entity';

export class ChatHistoryDto {
  @ApiProperty({
    description: 'ID của tin nhắn',
    example: 'msg_123456'
  })
  id: string;

  @ApiProperty({
    description: 'Nội dung tin nhắn',
    example: 'Tôi muốn tạo profile mới'
  })
  message: string;

  @ApiProperty({
    description: 'Loại tin nhắn',
    enum: MessageType,
    example: MessageType.TEXT
  })
  messageType: MessageType;

  @ApiProperty({
    description: 'Nền tảng',
    enum: Platform,
    example: Platform.WEB
  })
  platform: Platform;

  @ApiProperty({
    description: 'ID người dùng trên nền tảng',
    example: 'user123'
  })
  platformUserId: string;

  @ApiProperty({
    description: 'Thời gian tạo tin nhắn',
    example: '2024-01-15T10:30:00Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Phản hồi từ AI (nếu có)',
    example: 'Tôi sẽ giúp bạn tạo profile. Bạn tên gì?',
    required: false
  })
  aiResponse?: string;

  @ApiProperty({
    description: 'Ý định được nhận diện',
    example: 'create_profile',
    required: false
  })
  intent?: string;

  @ApiProperty({
    description: 'Độ tin cậy',
    example: 0.95,
    required: false
  })
  confidence?: number;
}
