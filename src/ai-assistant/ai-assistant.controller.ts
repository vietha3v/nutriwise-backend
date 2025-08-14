import { Controller, Post, Body, Get, Query, Param, Headers, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiAssistantService } from './ai-assistant.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { ChatResponseDto } from './dto/chat-response.dto';
import { ChatHistoryDto } from './dto/chat-history.dto';

@ApiTags('AI Assistant')
@Controller('ai-assistant')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiAssistantController {
  constructor(private readonly aiAssistantService: AiAssistantService) {}

  @Post('chat')
  @ApiOperation({ 
    summary: 'Chat với AI Assistant',
    description: 'Endpoint chính để tương tác với AI Assistant. Hỗ trợ tin nhắn text, voice và image. Backend tự động detect loại media từ Content-Type header hoặc nội dung message.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Phản hồi từ AI thành công',
    type: ChatResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dữ liệu không hợp lệ'
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Lỗi server'
  })
  async chat(
    @Request() req,
    @Body() chatRequest: ChatRequestDto
  ): Promise<ChatResponseDto> {
    const userId = req.user?.userId;
    const contentType = req.headers['content-type'];
    return this.aiAssistantService.processChatMessage(chatRequest, userId, contentType);
  }

  @Get('history')
  @ApiOperation({
    summary: 'Lấy lịch sử cuộc hội thoại',
    description: 'Truy xuất lịch sử các tin nhắn đã trao đổi với AI Assistant. User ID được tự động lấy từ JWT token.'
  })
  @ApiQuery({
    name: 'limit',
    description: 'Số lượng tin nhắn (mặc định: 50)',
    required: false,
    example: 50
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy lịch sử thành công',
    type: [ChatHistoryDto]
  })
  async getHistory(
    @Request() req,
    @Query('limit') limit?: number
  ): Promise<ChatHistoryDto[]> {
    const userId = req.user?.userId;
    return this.aiAssistantService.getChatHistory(userId, limit);
  }
}
