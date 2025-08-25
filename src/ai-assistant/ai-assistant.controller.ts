import { Controller, Get, Post, Delete, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AiAssistantService } from './ai-assistant.service';

interface ChatMessage {
  message: string;
  context?: string;
}

interface AskQuestionDto {
  question: string;
  context?: 'water' | 'profile' | 'general';
}

@ApiTags('AI Assistant')
@Controller('ai-assistant')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AiAssistantController {
  constructor(private readonly aiAssistantService: AiAssistantService) {}

  @Post('chat')
  @ApiOperation({ 
    summary: 'Chat với AI Assistant',
    description: 'Tương tác chat với AI assistant để nhận lời khuyên và hỗ trợ'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Chat thành công',
    schema: {
      type: 'object',
      properties: {
        response: { type: 'string' },
        messageId: { type: 'string' },
        timestamp: { type: 'string' },
        context: { type: 'string' },
        suggestions: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  async chat(
    @Request() req,
    @Body() chatMessage: ChatMessage,
  ): Promise<any> {
    return this.aiAssistantService.chat(req.user.userId, chatMessage.message, chatMessage.context);
  }

  @Post('ask-question')
  @ApiOperation({ 
    summary: 'Hỏi đáp nhanh',
    description: 'Đặt câu hỏi nhanh và nhận câu trả lời từ AI'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Trả lời thành công',
    schema: {
      type: 'object',
      properties: {
        answer: { type: 'string' },
        confidence: { type: 'number' },
        sources: {
          type: 'array',
          items: { type: 'string' }
        },
        relatedQuestions: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  async askQuestion(
    @Request() req,
    @Body() askQuestionDto: AskQuestionDto,
  ): Promise<any> {
    return this.aiAssistantService.askQuestion(req.user.userId, askQuestionDto.question, askQuestionDto.context);
  }

  @Get('chat-history')
  @ApiOperation({ 
    summary: 'Lịch sử chat',
    description: 'Lấy lịch sử chat của người dùng'
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number, 
    description: 'Số lượng tin nhắn tối đa (mặc định: 50)' 
  })
  @ApiQuery({ 
    name: 'offset', 
    required: false, 
    type: Number, 
    description: 'Số tin nhắn bỏ qua (mặc định: 0)' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lấy lịch sử thành công',
    schema: {
      type: 'object',
      properties: {
        messages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              message: { type: 'string' },
              response: { type: 'string' },
              timestamp: { type: 'string' },
              context: { type: 'string' }
            }
          }
        },
        total: { type: 'number' },
        hasMore: { type: 'boolean' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  async getChatHistory(
    @Request() req,
    @Query('limit') limit: number = 50,
    @Query('offset') offset: number = 0,
  ): Promise<any> {
    return this.aiAssistantService.getChatHistory(req.user.userId, limit, offset);
  }

  @Delete('clear-chat-history')
  @ApiOperation({ 
    summary: 'Xóa lịch sử chat',
    description: 'Xóa toàn bộ lịch sử chat của người dùng'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Xóa thành công',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        deletedCount: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  async clearChatHistory(@Request() req): Promise<any> {
    return this.aiAssistantService.clearChatHistory(req.user.userId);
  }

  @Get('suggestions')
  @ApiOperation({ 
    summary: 'Gợi ý câu hỏi',
    description: 'Lấy danh sách câu hỏi gợi ý dựa trên context'
  })
  @ApiQuery({ 
    name: 'context', 
    required: false, 
    enum: ['water', 'profile', 'general'], 
    description: 'Context để lấy gợi ý phù hợp' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lấy gợi ý thành công',
    schema: {
      type: 'object',
      properties: {
        suggestions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              question: { type: 'string' },
              category: { type: 'string' },
              description: { type: 'string' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  async getSuggestions(
    @Query('context') context?: 'water' | 'profile' | 'general',
  ): Promise<any> {
    return this.aiAssistantService.getSuggestions(context);
  }

  @Get('assistant-status')
  @ApiOperation({ summary: 'Kiểm tra trạng thái AI Assistant' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lấy trạng thái thành công', 
    schema: {
      type: 'object',
      properties: {
        isAvailable: { type: 'boolean' },
        message: { type: 'string' },
        features: {
          type: 'array',
          items: { type: 'string' }
        },
        model: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  async getAssistantStatus(): Promise<any> {
    return this.aiAssistantService.getAssistantStatus();
  }
}
