import { ApiProperty } from '@nestjs/swagger';

export interface ParamDefinition {
  name: string;
  type: 'string' | 'number' | 'enum' | 'date' | 'boolean' | 'array' | 'object';
  description: string;
  required: boolean;
  validation?: any[];
}

export interface ActionDefinition {
  action: string;
  description: string;
  requiredParams: ParamDefinition[];
  optionalParams: ParamDefinition[];
  confirmationRequired: boolean;
}

export enum MediaType {
  TEXT = 'text',
  VOICE = 'voice',
  IMAGE = 'image'
}

export class AIActionRequestDto {
  @ApiProperty({
    description: 'Nội dung tin nhắn tự nhiên từ người dùng',
    example: 'Tôi muốn tạo profile mới'
  })
  message: string;

  @ApiProperty({
    description: 'Context của cuộc hội thoại (tự động lấy từ session)',
    required: false,
    example: {}
  })
  context?: any;
}

export class AIActionResponseDto {
  @ApiProperty({
    description: 'Ý định được xác định',
    example: 'add_meal'
  })
  intent: string;

  @ApiProperty({
    description: 'Độ tin cậy của phân tích (0-1)',
    example: 0.95
  })
  confidence: number;

  @ApiProperty({
    description: 'Mô tả ý định của người dùng',
    example: 'Người dùng muốn ghi nhận bữa ăn'
  })
  userIntent: string;

  @ApiProperty({
    description: 'Thông tin cần thiết cho action',
    required: false
  })
  requiredInfo?: {
    action: string;
    requiredParams: string[];
    providedParams: Record<string, any>;
    missingParams: string[];
    smartQuestions: string[];
  };

  @ApiProperty({
    description: 'Phản hồi ngữ cảnh cho người dùng',
    example: 'Tôi đã ghi nhận bữa trưa với cơm và thịt kho. Bạn ăn bao nhiêu và lúc mấy giờ vậy?'
  })
  contextualResponse: string;

  @ApiProperty({
    description: 'Các hành động tiếp theo',
    example: ['collect_info', 'confirm_action']
  })
  nextActions: string[];

  @ApiProperty({
    description: 'Thông tin phân tích từ media (nếu có)',
    required: false,
    example: {
      detectedFoods: ['rice', 'chicken'],
      estimatedCalories: 450,
      confidence: 0.85,
      suggestions: ['ADD_MEAL', 'SEARCH_FOOD']
    }
  })
  mediaAnalysis?: {
    detectedFoods?: string[];
    estimatedCalories?: number;
    confidence?: number;
    suggestions?: string[];
    transcription?: string; // for voice
    imageDescription?: string; // for image
  };

  @ApiProperty({
    description: 'Thông tin về media được detect',
    required: false,
    example: {
      mediaType: 'image',
      detectedFrom: 'file_extension',
      originalMessage: 'https://example.com/food.jpg'
    }
  })
  mediaInfo?: {
    mediaType: MediaType;
    detectedFrom: 'content_type' | 'file_extension' | 'url_pattern' | 'base64' | 'manual';
    originalMessage: string;
  };
}

export class AIActionDefinitionDto {
  @ApiProperty({
    description: 'Tên action',
    example: 'ADD_MEAL'
  })
  action: string;

  @ApiProperty({
    description: 'Mô tả chức năng',
    example: 'Ghi nhận thông tin về bữa ăn đã ăn'
  })
  description: string;

  @ApiProperty({
    description: 'Thông tin cần thu thập',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        type: { type: 'string' },
        description: { type: 'string' },
        required: { type: 'boolean' }
      }
    }
  })
  requiredParams: ParamDefinition[];

  @ApiProperty({
    description: 'Thông tin tùy chọn',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        type: { type: 'string' },
        description: { type: 'string' },
        required: { type: 'boolean' }
      }
    }
  })
  optionalParams: ParamDefinition[];

  @ApiProperty({
    description: 'Cần xác nhận trước khi thực hiện',
    example: false
  })
  confirmationRequired: boolean;
}
