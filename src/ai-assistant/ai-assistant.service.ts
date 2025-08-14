import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ChatMessage, MessageType } from './entities/chat-message.entity';
import { UserPlatform, Platform } from './entities/user-platform.entity';
import { User } from '../user/entities/user.entity';
import { Role } from '../common/enums/role.enum';
import { ChatRequestDto } from './dto/chat-request.dto';
import { ChatResponseDto, IntentType } from './dto/chat-response.dto';
import { ChatHistoryDto } from './dto/chat-history.dto';
import OpenAI from 'openai';
import { AISemanticService } from './services/ai-semantic.service';
import { AIActionRequestDto, AIActionResponseDto } from './dto/ai-action.dto';
import { getActionByName } from './config/ai-actions.config';

@Injectable()
export class AiAssistantService {
  private readonly logger = new Logger(AiAssistantService.name);
  private openai: OpenAI;

  constructor(
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(UserPlatform)
    private userPlatformRepository: Repository<UserPlatform>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    private aiSemanticService: AISemanticService,
  ) {
    const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (openaiApiKey) {
      this.openai = new OpenAI({ apiKey: openaiApiKey });
    }
  }

  async processChatMessage(chatRequest: ChatRequestDto, userId?: number, contentType?: string): Promise<ChatResponseDto> {
    try {
      // Xác thực và lấy thông tin người dùng từ JWT token
      const user = await this.findUser(userId);

      // Truy xuất context từ cuộc hội thoại trước đó
      const conversationContext = await this.getConversationContext(user.id);
      
      // Kiểm tra cờ AI Agent Mode
      const aiAgentModeEnabled = this.configService.get<string>('AI_AGENT_MODE_ENABLED', 'false').toLowerCase() === 'true';
      
      let response: ChatResponseDto;
      
      if (aiAgentModeEnabled) {
        // Chế độ AI Agent - phân tích intent và thực hiện action
        response = await this.processWithAIAgent(user, chatRequest, conversationContext, contentType);
      } else {
        // Chế độ chat trực tiếp - AI chat tự nhiên với context
        response = await this.processWithDirectChat(user, chatRequest, conversationContext);
      }
      
      // Lưu trữ tin nhắn vào database
      await this.saveChatMessage(user.id, chatRequest, response);
      
      return response;
    } catch (error) {
      this.logger.error('Error processing chat message:', error);
      return this.generateErrorResponse('Có lỗi xảy ra khi xử lý tin nhắn của bạn');
    }
  }

  async getChatHistory(userId: number, limit: number = 50): Promise<ChatHistoryDto[]> {
    try {
      const messages = await this.chatMessageRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
        take: limit
      });
      
      return messages.map(msg => ({
        id: msg.id.toString(),
        message: msg.message,
        messageType: msg.messageType,
        platform: msg.platform as any,
        platformUserId: msg.platformUserId,
        createdAt: msg.createdAt,
        isUserMessage: true
      }));
    } catch (error) {
      this.logger.error('Error getting chat history:', error);
      return [];
    }
  }

  private async findUser(userId?: number): Promise<User> {
    if (!userId) {
      throw new Error('User not authenticated');
    }

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new Error('User not found');
      return user;
    }

  private async getConversationContext(userId: number): Promise<any> {
    try {
      // Truy xuất tin nhắn cuối cùng trong khoảng thời gian 30 phút
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      
      const lastMessage = await this.chatMessageRepository.findOne({
        where: {
          userId,
          createdAt: MoreThanOrEqual(thirtyMinutesAgo)
        },
        order: { createdAt: 'DESC' }
      });

      return lastMessage?.context || {};
    } catch (error) {
      this.logger.error('Error getting conversation context:', error);
      return {};
    }
  }

  private async handleAIResponse(user: User, chatRequest: ChatRequestDto, aiResponse: AIActionResponseDto, context: any): Promise<ChatResponseDto> {
    const { intent, confidence, userIntent, requiredInfo, contextualResponse, nextActions } = aiResponse;
    
    // Xử lý trường hợp không nhận diện được ý định
    if (intent === 'unknown') {
      return {
        response: contextualResponse,
        intent: IntentType.UNKNOWN,
        confidence,
        conversationState: 'general_chat',
        context: {
          action: 'general_query'
        }
      };
    }
    
    // Xử lý trường hợp cần thu thập thêm thông tin
    if (requiredInfo && requiredInfo.missingParams && requiredInfo.missingParams.length > 0) {
      return {
        response: contextualResponse,
        intent: intent as IntentType,
        confidence,
        conversationState: 'collecting_info',
        context: {
          action: requiredInfo.action,
          collectedData: requiredInfo.providedParams,
          missingFields: requiredInfo.missingParams,
          smartQuestions: requiredInfo.smartQuestions
        }
      };
    }
    
    // Xử lý trường hợp cần xác nhận từ người dùng
    if (requiredInfo && this.isActionRequiringConfirmation(requiredInfo.action)) {
      return {
        response: contextualResponse,
        intent: intent as IntentType,
        confidence,
        conversationState: 'confirming_action',
        context: {
          action: requiredInfo.action,
          collectedData: requiredInfo.providedParams,
          missingFields: []
        }
      };
    }
    
    // Xử lý trường hợp có thể thực hiện hành động ngay lập tức
    if (requiredInfo && requiredInfo.providedParams) {
      return this.executeAction(user, requiredInfo.action, requiredInfo.providedParams);
    }
    
    // Trả về phản hồi mặc định
    return {
      response: contextualResponse,
      intent: intent as IntentType,
      confidence,
      conversationState: 'completed',
      context: {
        action: 'completed'
      }
    };
  }

  private async executeAction(user: User, action: string, entities: any): Promise<ChatResponseDto> {
    try {
      // TODO: Triển khai các API calls thực tế dựa trên action
      return {
        response: `Đã thực hiện hành động ${action} thành công!`,
        intent: IntentType.UNKNOWN,
        confidence: 1.0,
        conversationState: 'completed',
        context: {
          action: 'completed',
          result: 'success'
        }
      };
    } catch (error) {
      this.logger.error('Error executing action:', error);
      return this.generateErrorResponse('Có lỗi xảy ra khi thực hiện hành động');
    }
  }

  private async saveChatMessage(userId: number, chatRequest: ChatRequestDto, response: ChatResponseDto): Promise<void> {
    const chatMessage = this.chatMessageRepository.create({
      userId,
      platform: Platform.WEB, // Giá trị mặc định
      platformUserId: `user_${userId}`,
      messageType: MessageType.TEXT, // Giá trị mặc định
      message: chatRequest.message,
      response: response.response,
      intent: response.intent,
      confidence: response.confidence,
      context: response.context
    });

    await this.chatMessageRepository.save(chatMessage);
  }

  private generateErrorResponse(message: string): ChatResponseDto {
    return {
      response: message,
      intent: IntentType.UNKNOWN,
      confidence: 0,
      conversationState: 'error',
      context: {
        action: 'error',
        message
      }
    };
  }

  private isActionRequiringConfirmation(actionName: string): boolean {
    const actionDefinition = getActionByName(actionName);
    return actionDefinition?.confirmationRequired || false;
  }

  private async processWithAIAgent(user: User, chatRequest: ChatRequestDto, conversationContext: any, contentType?: string): Promise<ChatResponseDto> {
    // Phân tích tin nhắn bằng AI Semantic Service
    const aiRequest: AIActionRequestDto = {
      message: chatRequest.message,
      context: conversationContext
    };
    
    const aiResponse = await this.aiSemanticService.analyzeMessage(aiRequest, contentType);
    
    // Xử lý phản hồi từ AI
    const response = await this.handleAIResponse(user, chatRequest, aiResponse, conversationContext);
    
    return response;
  }

  private async processWithDirectChat(user: User, chatRequest: ChatRequestDto, conversationContext: any): Promise<ChatResponseDto> {
    // Lấy lịch sử chat gần đây để tạo context
    const recentMessages = await this.getRecentChatHistory(user.id, 5);
    const chatHistory = recentMessages.map(msg => `${msg.isUserMessage ? 'User' : 'Assistant'}: ${msg.message}`).join('\n');
    
    // Gọi OpenAI với context lịch sử
    const aiResponse = await this.callOpenAIWithHistory(chatRequest.message, chatHistory, conversationContext);
    
    const response: ChatResponseDto = {
      response: aiResponse,
      intent: IntentType.UNKNOWN,
      confidence: 1.0,
      conversationState: 'general_chat',
      context: {
        action: 'general_query'
      }
    };
    
    return response;
  }

  private async getRecentChatHistory(userId: number, limit: number = 5): Promise<any[]> {
    try {
      const messages = await this.chatMessageRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
        take: limit * 2 // Lấy gấp đôi để có cả user và assistant messages
      });
      
      return messages.reverse().map(msg => ({
        message: msg.message,
        isUserMessage: true,
        createdAt: msg.createdAt
      }));
    } catch (error) {
      this.logger.error('Error getting recent chat history:', error);
      return [];
    }
  }

  private async callOpenAIWithHistory(message: string, chatHistory: string, context?: any): Promise<string> {
    try {
      if (!this.openai) {
        return 'Xin lỗi, tôi không thể kết nối với AI service. Vui lòng thử lại sau.';
      }

      const openaiModel = this.configService.get<string>('OPENAI_MODEL', 'gpt-4o');
      const openaiMaxTokens = parseInt(this.configService.get<string>('OPENAI_MAX_TOKENS') || '1000', 10);
      const openaiTemperature = parseFloat(this.configService.get<string>('OPENAI_TEMPERATURE') || '0.7');

      const systemPrompt = `Bạn là AI Assistant của NutriWise - ứng dụng quản lý dinh dưỡng và sức khỏe. 
Hãy trả lời người dùng một cách thân thiện và hữu ích. Nếu họ hỏi về dinh dưỡng, sức khỏe, hoặc các tính năng của NutriWise, hãy cung cấp thông tin chính xác và hữu ích.

Lịch sử cuộc hội thoại gần đây:
${chatHistory}`;

      const completion = await this.openai.chat.completions.create({
        model: openaiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: openaiMaxTokens,
        temperature: openaiTemperature,
      });

      return completion.choices[0]?.message?.content || 'Xin lỗi, tôi không thể tạo phản hồi.';
    } catch (error) {
      this.logger.error('Error calling OpenAI with history:', error);
      return 'Xin lỗi, có lỗi xảy ra khi xử lý tin nhắn của bạn. Vui lòng thử lại sau.';
    }
  }

  private async callOpenAI(message: string, context?: any): Promise<string> {
    try {
      if (!this.openai) {
        return 'Xin lỗi, tôi không thể kết nối với AI service. Vui lòng thử lại sau.';
      }

      const openaiModel = this.configService.get<string>('OPENAI_MODEL', 'gpt-4o');
      const openaiMaxTokens = parseInt(this.configService.get<string>('OPENAI_MAX_TOKENS') || '1000', 10);
      const openaiTemperature = parseFloat(this.configService.get<string>('OPENAI_TEMPERATURE') || '0.7');

      const systemPrompt = `Bạn là AI Assistant của NutriWise - ứng dụng quản lý dinh dưỡng và sức khỏe. 
Hãy trả lời người dùng một cách thân thiện và hữu ích. Nếu họ hỏi về dinh dưỡng, sức khỏe, hoặc các tính năng của NutriWise, hãy cung cấp thông tin chính xác và hữu ích.`;

      const completion = await this.openai.chat.completions.create({
        model: openaiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: openaiMaxTokens,
        temperature: openaiTemperature,
      });

      return completion.choices[0]?.message?.content || 'Xin lỗi, tôi không thể tạo phản hồi.';
    } catch (error) {
      this.logger.error('Error calling OpenAI:', error);
      return 'Xin lỗi, có lỗi xảy ra khi xử lý tin nhắn của bạn. Vui lòng thử lại sau.';
    }
  }
}


