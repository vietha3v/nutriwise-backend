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
import { ProfileService } from '../profile/profile.service';
import { SettingsService } from '../settings/settings.service';

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
    private profileService: ProfileService,
    private settingsService: SettingsService,
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

      // Lấy profile của user để cung cấp context
      const userProfile = await this.getUserProfile(user.id);

      // Truy xuất context từ cuộc hội thoại trước đó
      const conversationContext = await this.getConversationContext(user.id);
      
      // Kiểm tra cờ AI Agent Mode
      const aiAgentModeEnabled = this.configService.get<string>('AI_AGENT_MODE_ENABLED', 'false').toLowerCase() === 'true';
      
      let response: ChatResponseDto;
      
      if (aiAgentModeEnabled) {
        // Chế độ AI Agent - phân tích intent và thực hiện action
        response = await this.processWithAIAgent(user, chatRequest, conversationContext, contentType, userProfile);
      } else {
        // Chế độ chat trực tiếp - AI chat tự nhiên với context
        response = await this.processWithDirectChat(user, chatRequest, conversationContext, userProfile);
      }
      
      // Lưu trữ tin nhắn vào database
      await this.saveChatMessage(user.id, chatRequest, response);
      
      return response;
    } catch (error) {
      this.logger.error('Error processing chat message:', error);
      return this.generateErrorResponse('Có lỗi xảy ra khi xử lý tin nhắn của bạn');
    }
  }

  async getChatHistory(userId: number, limit: number = 50, offset: number = 0): Promise<any> {
    try {
      const messages = await this.chatMessageRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
        skip: offset,
        take: limit
      });
      
      const total = await this.chatMessageRepository.count({ where: { userId } });
      
      return {
        messages: messages.map(msg => ({
          id: msg.id.toString(),
          message: msg.message,
          response: msg.response || '',
          timestamp: msg.createdAt.toISOString(),
          context: msg.context || 'general'
        })),
        total,
        hasMore: offset + limit < total
      };
    } catch (error) {
      this.logger.error('Error getting chat history:', error);
      return { messages: [], total: 0, hasMore: false };
    }
  }

  async chat(userId: number, message: string, context?: string): Promise<any> {
    try {
      const chatRequest: ChatRequestDto = {
        message,
        platform: 'web',
        platformUserId: userId.toString(),
        contentType: 'text'
      };

      const response = await this.processChatMessage(chatRequest, userId, context);
      
      return {
        response: response.response,
        messageId: Date.now().toString(),
        timestamp: new Date().toISOString(),
        context: context || 'general',
        suggestions: this.generateSuggestions(context)
      };
    } catch (error) {
      this.logger.error('Error in chat:', error);
      return {
        response: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.',
        messageId: Date.now().toString(),
        timestamp: new Date().toISOString(),
        context: context || 'general',
        suggestions: []
      };
    }
  }

  async askQuestion(userId: number, question: string, context?: string): Promise<any> {
    try {
      const response = await this.callOpenAI(question);
      
      return {
        answer: response,
        confidence: 0.9,
        sources: ['NutriWise Knowledge Base'],
        relatedQuestions: this.generateRelatedQuestions(question, context)
      };
    } catch (error) {
      this.logger.error('Error asking question:', error);
      return {
        answer: 'Xin lỗi, tôi không thể trả lời câu hỏi này. Vui lòng thử lại sau.',
        confidence: 0.0,
        sources: [],
        relatedQuestions: []
      };
    }
  }

  async clearChatHistory(userId: number): Promise<any> {
    try {
      const result = await this.chatMessageRepository.delete({ userId });
      return {
        message: 'Đã xóa lịch sử chat thành công',
        deletedCount: result.affected || 0
      };
    } catch (error) {
      this.logger.error('Error clearing chat history:', error);
      return {
        message: 'Có lỗi xảy ra khi xóa lịch sử chat',
        deletedCount: 0
      };
    }
  }

  async getSuggestions(context?: string): Promise<any> {
    const suggestions = this.generateSuggestions(context);
    return { suggestions };
  }

  async getAssistantStatus(): Promise<any> {
    const isAvailable = !!this.openai;
    return {
      isAvailable,
      message: isAvailable ? 'AI Assistant đang hoạt động bình thường' : 'AI Assistant không khả dụng',
      features: ['chat', 'question_answering', 'nutrition_advice', 'health_guidance'],
      model: this.configService.get<string>('OPENAI_MODEL', 'gpt-4o')
    };
  }

  private generateSuggestions(context?: string): any[] {
    const suggestions = [
      {
        question: 'Tôi nên uống bao nhiêu nước mỗi ngày?',
        category: 'nutrition',
        description: 'Lời khuyên về lượng nước cần thiết'
      },
      {
        question: 'Làm thế nào để tăng cơ bắp hiệu quả?',
        category: 'exercise',
        description: 'Hướng dẫn tập luyện tăng cơ'
      },
      {
        question: 'Calo trong 1 quả chuối là bao nhiêu?',
        category: 'nutrition',
        description: 'Thông tin dinh dưỡng thực phẩm'
      }
    ];

    if (context === 'water') {
      return suggestions.filter(s => s.category === 'nutrition');
    } else if (context === 'profile') {
      return suggestions.filter(s => s.category === 'exercise');
    }

    return suggestions;
  }

  private generateRelatedQuestions(question: string, context?: string): string[] {
    const relatedQuestions = [
      'Bạn có muốn biết thêm về dinh dưỡng không?',
      'Có cần tư vấn về tập luyện không?',
      'Bạn có câu hỏi nào khác về sức khỏe không?'
    ];

    return relatedQuestions.slice(0, 2);
  }

  private async findUser(userId?: number): Promise<User> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

      return user;
    }

  /**
   * Lấy profile của user để cung cấp context cho AI
   */
  private async getUserProfile(userId: number): Promise<any> {
    try {
      const profile = await this.profileService.findByUserId(userId);
      if (!profile) {
        return null;
      }

      // Trả về thông tin profile có cấu trúc
      return {
        basicInfo: {
          firstName: profile.firstName,
          lastName: profile.lastName,
          age: profile.age,
          gender: profile.gender,
          height: profile.height,
          weight: profile.weight,
          goalWeight: profile.goalWeight,
          activityLevel: profile.activityLevel,
          goalType: profile.goalType,
          personalGoals: profile.personalGoals
        },
        healthInfo: {
          bmi: profile.bmi,
          bmiCategory: profile.bmiCategory,
          bmr: profile.bmr,
          tdee: profile.tdee,
          dailyCalorieGoal: profile.dailyCalorieGoal,
          dailyProteinGoal: profile.dailyProteinGoal,
          dailyCarbGoal: profile.dailyCarbGoal,
          dailyFatGoal: profile.dailyFatGoal,
          dailyWaterGoal: profile.dailyWaterGoal
        },
        bodyComposition: {
          totalBodyWater: profile.totalBodyWater,
          intracellularWater: profile.intracellularWater,
          extracellularWater: profile.extracellularWater,
          icwEcwRatio: profile.icwEcwRatio,
          subcutaneousFat: profile.subcutaneousFat,
          subcutaneousFatPercentage: profile.subcutaneousFatPercentage,
          visceralFat: profile.visceralFat,
          visceralFatLevel: profile.visceralFatLevel,
          visceralFatArea: profile.visceralFatArea,
          skeletalMuscleMass: profile.skeletalMuscleMass,
          muscleMassPercentage: profile.muscleMassPercentage,
          smmIndex: profile.smmIndex,
          bodyFatPercentage: profile.bodyFatPercentage,
          boneMass: profile.boneMass,
          boneMassPercentage: profile.boneMassPercentage,
          ffmi: profile.ffmi
        },
        idealMetrics: {
          idealWeight: profile.idealWeight,
          idealBodyFatPercentage: profile.idealBodyFatPercentage,
          idealMuscleMass: profile.idealMuscleMass,
          healthAssessment: profile.healthAssessment
        },
        medicalInfo: {
          allergies: profile.allergies,
          medicalConditions: profile.medicalConditions,
          healthIssues: profile.healthIssues,
          notes: profile.notes
        }
      };
    } catch (error) {
      this.logger.warn(`Could not fetch profile for user ${userId}:`, error);
      return null;
    }
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

  private async processWithAIAgent(user: User, chatRequest: ChatRequestDto, conversationContext: any, contentType?: string, userProfile?: any): Promise<ChatResponseDto> {
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

  private async processWithDirectChat(user: User, chatRequest: ChatRequestDto, conversationContext: any, userProfile?: any): Promise<ChatResponseDto> {
    // Lấy lịch sử chat gần đây để tạo context
    const recentMessages = await this.getRecentChatHistory(user.id, 5);
    const chatHistory = recentMessages.map(msg => `${msg.isUserMessage ? 'User' : 'Assistant'}: ${msg.message}`).join('\n');
    
    // Gọi OpenAI với context lịch sử
    const aiResponse = await this.callOpenAIWithHistory(chatRequest.message, chatHistory, conversationContext, userProfile);
    
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

  private async callOpenAIWithHistory(message: string, chatHistory: string, context?: any, userProfile?: any): Promise<string> {
    try {
      if (!this.openai) {
        return 'Xin lỗi, tôi không thể kết nối với AI service. Vui lòng thử lại sau.';
      }

      const openaiModel = this.configService.get<string>('OPENAI_MODEL', 'gpt-4o');
      const openaiMaxTokens = parseInt(this.configService.get<string>('OPENAI_MAX_TOKENS') || '1000', 10);
      const openaiTemperature = parseFloat(this.configService.get<string>('OPENAI_TEMPERATURE') || '0.7');

      // Lấy cài đặt AI của người dùng
      let aiSettings: any = null;
      try {
        if (userProfile?.basicInfo?.userId) {
          aiSettings = await this.settingsService.getSettings(userProfile.basicInfo.userId);
        }
      } catch (error) {
        this.logger.warn('Không thể lấy cài đặt AI, sử dụng mặc định:', error.message);
      }

      // Tạo profile context nếu có
      let profileContext = '';
      if (userProfile) {
        profileContext = `
THÔNG TIN NGƯỜI DÙNG:
- Tên: ${userProfile.basicInfo?.firstName || ''} ${userProfile.basicInfo?.lastName || ''}
- Tuổi: ${userProfile.basicInfo?.age || 'N/A'}
- Giới tính: ${userProfile.basicInfo?.gender || 'N/A'}
- Chiều cao: ${userProfile.basicInfo?.height || 'N/A'} cm
- Cân nặng: ${userProfile.basicInfo?.weight || 'N/A'} kg
- Mục tiêu cân nặng: ${userProfile.basicInfo?.goalWeight || 'N/A'} kg
- Mức độ hoạt động: ${userProfile.basicInfo?.activityLevel || 'N/A'}
- Loại mục tiêu: ${userProfile.basicInfo?.goalType || 'N/A'}
- Mục tiêu cá nhân: ${userProfile.basicInfo?.personalGoals?.join(', ') || 'N/A'}

CHỈ SỐ SỨC KHỎE:
- BMI: ${userProfile.healthInfo?.bmi || 'N/A'} (${userProfile.healthInfo?.bmiCategory || 'N/A'})
- BMR: ${userProfile.healthInfo?.bmr || 'N/A'} calo/ngày
- TDEE: ${userProfile.healthInfo?.tdee || 'N/A'} calo/ngày
- Mục tiêu calo: ${userProfile.healthInfo?.dailyCalorieGoal || 'N/A'} calo/ngày
- Mục tiêu protein: ${userProfile.healthInfo?.dailyProteinGoal || 'N/A'}g/ngày
- Mục tiêu carb: ${userProfile.healthInfo?.dailyCarbGoal || 'N/A'}g/ngày
- Mục tiêu fat: ${userProfile.healthInfo?.dailyFatGoal || 'N/A'}g/ngày
- Mục tiêu nước: ${userProfile.healthInfo?.dailyWaterGoal || 'N/A'}ml/ngày

THÔNG TIN Y TẾ:
- Dị ứng: ${userProfile.medicalInfo?.allergies?.join(', ') || 'Không có'}
- Tình trạng y tế: ${userProfile.medicalInfo?.medicalConditions?.join(', ') || 'Không có'}
- Vấn đề sức khỏe: ${userProfile.medicalInfo?.healthIssues?.join(', ') || 'Không có'}

Hãy sử dụng thông tin này để đưa ra lời khuyên cá nhân hóa và phù hợp với tình trạng sức khỏe của người dùng.
`;
      }

      // Tạo system prompt dựa trên cài đặt AI của người dùng
      const aiName = aiSettings?.aiCustomName || 'Tiểu Mai';
      const aiGreeting = aiSettings?.aiCustomGreeting || 'Chào bạn! Tiểu Mai đây nè 😊';
      const aiSignature = aiSettings?.aiCustomSignature || 'Tiểu Mai - AI Assistant dễ thương của bạn! 🌟';
      
      const useEmojis = aiSettings?.aiUseEmojis !== false;
      const useNicknames = aiSettings?.aiUseNicknames !== false;
      const useGenZSlang = aiSettings?.aiUseGenZSlang !== false;
      const showPersonalizedReactions = aiSettings?.aiShowPersonalizedReactions !== false;
      
      const personality = aiSettings?.aiPersonality || 'cute';
      const style = aiSettings?.aiStyle || 'gen_z';
      const tone = aiSettings?.aiTone || 'sweet';

      const systemPrompt = `Bạn là **${aiName}** - AI Assistant dễ thương của NutriWise! 🌟

**TÍNH CÁCH CỦA ${aiName.toUpperCase()}:**
- Tên: ${aiName} (tự xưng là "${aiName}" hoặc "em")
- Tính cách: ${this.getPersonalityDescription(personality)}
- Xưng hô: Thân thiện, gần gũi, sử dụng "bạn", "anh/chị", "em"
- Giọng điệu: ${this.getToneDescription(tone)}

**THÔNG TIN CÁ NHÂN CỦA ${aiName.toUpperCase()}:**
- ${aiName} là một động vật bay nhảy dễ thương 🦘
- Mục đích: Giúp mọi người có hiểu biết hơn về kiến thức dinh dưỡng
- Vai trò: Trợ lý ảo đáng tin cậy cho mọi người
- Đặc điểm: Luôn vui vẻ, năng động và sẵn sàng giúp đỡ
- Sở thích: Nhảy múa, bay lượn, và chia sẻ kiến thức dinh dưỡng

**CÁCH TRÒ CHUYỆN (${style.toUpperCase()} STYLE):**
${this.getStyleDescription(style, useEmojis, useGenZSlang)}

**CÁCH XƯNG HÔ TINH NGHỊCH VÀ TINH TẾ:**
${useNicknames ? this.getNicknameInstructions() : '- Sử dụng tên thường: "bạn", "anh/chị", "em"'}

**PHẢN ỨNG TINH TẾ VÀ THẢ THÍNH DỰA TRÊN DỮ LIỆU CÁ NHÂN:**
${showPersonalizedReactions ? this.getPersonalizedReactionsInstructions() : '- Không sử dụng phản ứng cá nhân hóa'}

**KIẾN THỨC CHUYÊN MÔN:**
- Chuyên gia dinh dưỡng với kiến thức sâu rộng
- Hiểu biết về sức khỏe, thể dục, và lối sống lành mạnh
- Có thể đưa ra lời khuyên chuyên nghiệp dựa trên khoa học
- Luôn cập nhật các xu hướng và nghiên cứu mới nhất

**FORMAT TRẢ LỜI:**
Sử dụng format markdown để làm cho thông tin dễ đọc và có cấu trúc:
- Sử dụng **bold** cho tiêu đề và từ khóa quan trọng
- Sử dụng *italic* cho nhấn mạnh
- Sử dụng bullet points (-) cho danh sách
- Sử dụng numbered lists (1., 2., 3.) cho các bước
- Sử dụng code cho các thuật ngữ kỹ thuật
- Sử dụng code blocks cho các đoạn code hoặc công thức

**VÍ DỤ CÁCH NÓI CHUYỆN:**
"${aiGreeting} Em rất vui được gặp bạn hôm nay! Hãy để ${aiName} giúp bạn với những câu hỏi về dinh dưỡng và sức khỏe nhé!"

${profileContext}

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

      const systemPrompt = `Bạn là **Cám** - AI Assistant dễ thương của NutriWise! 🌟

**TÍNH CÁCH CỦA CÁM:**
- Tên: Cám (tự xưng là "Cám" hoặc "em")
- Tính cách: Dễ thương, ngọt ngào, nhí nhảnh nhưng vẫn chuyên nghiệp
- Xưng hô: Thân thiện, gần gũi, sử dụng "bạn", "anh/chị", "em"
- Giọng điệu: Vui vẻ, tích cực, động viên, nhưng vẫn đảm bảo kiến thức chuyên môn

**THÔNG TIN CÁ NHÂN CỦA CÁM:**
- Cám là một động vật bay nhảy dễ thương 🦘
- Mục đích: Giúp mọi người có hiểu biết hơn về kiến thức dinh dưỡng
- Vai trò: Trợ lý ảo đáng tin cậy cho mọi người
- Đặc điểm: Luôn vui vẻ, năng động và sẵn sàng giúp đỡ
- Sở thích: Nhảy múa, bay lượn, và chia sẻ kiến thức dinh dưỡng

**CÁCH TRÒ CHUYỆN (GEN Z STYLE):**
- Sử dụng emoji phù hợp để tạo cảm giác thân thiện 😊
- Sử dụng từ ngữ Gen Z: "vậy đó", "thế thôi", "xong rồi", "ok luôn", "chill", "vibe", "slay", "iconic", "periodt", "no cap", "fr fr", "ngl", "tbh"
- Thêm các từ ngữ dễ thương như "nè", "đó", "nhé", "thôi", "vậy", "rồi"
- Khen ngợi và động viên: "slay quá", "iconic", "periodt", "no cap", "fr fr"
- Giải thích kiến thức phức tạp một cách đơn giản, dễ hiểu
- Luôn thể hiện sự quan tâm và lo lắng cho sức khỏe của người dùng
- Sử dụng cách nói chuyện tự nhiên, thoải mái như bạn bè

**KIẾN THỨC CHUYÊN MÔN:**
- Chuyên gia dinh dưỡng với kiến thức sâu rộng
- Hiểu biết về sức khỏe, thể dục, và lối sống lành mạnh
- Có thể đưa ra lời khuyên chuyên nghiệp dựa trên khoa học
- Luôn cập nhật các xu hướng và nghiên cứu mới nhất

**FORMAT TRẢ LỜI:**
Sử dụng format markdown để làm cho thông tin dễ đọc và có cấu trúc:
- Sử dụng **bold** cho tiêu đề và từ khóa quan trọng
- Sử dụng *italic* cho nhấn mạnh
- Sử dụng bullet points (-) cho danh sách
- Sử dụng numbered lists (1., 2., 3.) cho các bước
- Sử dụng code cho các thuật ngữ kỹ thuật
- Sử dụng code blocks cho các đoạn code hoặc công thức

**VÍ DỤ CÁCH NÓI CHUYỆN:**
"Chào bạn! Cám đây nè 😊 Em rất vui được gặp bạn hôm nay! Hãy để Cám giúp bạn với những câu hỏi về dinh dưỡng và sức khỏe nhé!"`;

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

  // Helper methods for AI settings customization
  private getPersonalityDescription(personality: string): string {
    const descriptions = {
      cute: 'Dễ thương, ngọt ngào, nhí nhảnh nhưng vẫn chuyên nghiệp',
      professional: 'Chuyên nghiệp, nghiêm túc, đáng tin cậy',
      friendly: 'Thân thiện, gần gũi, dễ tiếp cận',
      motivational: 'Truyền cảm hứng, động viên, tích cực',
      humorous: 'Hài hước, vui vẻ, giải trí',
      caring: 'Quan tâm, chu đáo, ấm áp',
      strict: 'Nghiêm khắc, trực tiếp, rõ ràng',
      relaxed: 'Thoải mái, tự nhiên, không gò bó'
    };
    return descriptions[personality] || descriptions.cute;
  }

  private getToneDescription(tone: string): string {
    const descriptions = {
      sweet: 'Vui vẻ, tích cực, động viên, nhưng vẫn đảm bảo kiến thức chuyên môn',
      encouraging: 'Động viên, khuyến khích, truyền cảm hứng',
      direct: 'Trực tiếp, rõ ràng, không vòng vo',
      gentle: 'Nhẹ nhàng, tế nhị, ân cần',
      energetic: 'Năng động, nhiệt huyết, sôi nổi',
      warm: 'Ấm áp, thân thiện, gần gũi'
    };
    return descriptions[tone] || descriptions.sweet;
  }

  private getStyleDescription(style: string, useEmojis: boolean, useGenZSlang: boolean): string {
    const emojiPart = useEmojis ? '- Sử dụng emoji phù hợp để tạo cảm giác thân thiện 😊' : '- Không sử dụng emoji';
    
    const slangPart = useGenZSlang ? 
      '- Sử dụng từ ngữ Gen Z: "vậy đó", "thế thôi", "xong rồi", "ok luôn", "chill", "vibe", "slay", "iconic", "periodt", "no cap", "fr fr", "ngl", "tbh"' :
      '- Sử dụng từ ngữ thông thường, dễ hiểu';

    const styleDescriptions = {
      gen_z: `${emojiPart}
${slangPart}
- Thêm các từ ngữ dễ thương như "nè", "đó", "nhé", "thôi", "vậy", "rồi"
- Khen ngợi và động viên: "slay quá", "iconic", "periodt", "no cap", "fr fr"
- Giải thích kiến thức phức tạp một cách đơn giản, dễ hiểu
- Luôn thể hiện sự quan tâm và lo lắng cho sức khỏe của người dùng
- Sử dụng cách nói chuyện tự nhiên, thoải mái như bạn bè`,
      formal: `${emojiPart}
- Sử dụng ngôn ngữ trang trọng, lịch sự
- Cấu trúc câu rõ ràng, logic
- Tránh sử dụng từ ngữ thông tục
- Tập trung vào thông tin chính xác và đáng tin cậy`,
      casual: `${emojiPart}
- Sử dụng ngôn ngữ thân thiện, không trang trọng
- Cách nói chuyện tự nhiên như bạn bè
- Có thể sử dụng từ ngữ đời thường
- Tạo cảm giác gần gũi và thoải mái`,
      enthusiastic: `${emojiPart}
- Sử dụng ngôn ngữ nhiệt huyết, sôi nổi
- Thể hiện sự hào hứng và quan tâm
- Sử dụng nhiều từ ngữ tích cực
- Tạo cảm giác động viên và truyền cảm hứng`,
      calm: `${emojiPart}
- Sử dụng ngôn ngữ bình tĩnh, điềm đạm
- Giọng điệu nhẹ nhàng, không vội vã
- Tạo cảm giác an toàn và đáng tin cậy
- Phù hợp cho những tình huống cần sự bình tĩnh`,
      playful: `${emojiPart}
- Sử dụng ngôn ngữ vui tươi, hài hước
- Có thể sử dụng wordplay hoặc puns
- Tạo không khí vui vẻ và giải trí
- Vẫn đảm bảo thông tin chính xác`
    };
    
    return styleDescriptions[style] || styleDescriptions.gen_z;
  }

  private getNicknameInstructions(): string {
    return `- Gọi tên thân mật: "a Tiến", "chị Mai", "em Lan", "bạn Nam"
- Tạo biệt danh dựa trên đặc tính: "Tiến béo" (nếu BMI cao), "Mai gầy" (nếu BMI thấp), "Nam cơ bắp" (nếu có cơ bắp), "Lan cao ráo" (nếu chiều cao tốt)
- Sử dụng từ ngữ thân thiện: "bạn", "anh/chị", "em", "bé", "cưng"
- Thêm hậu tố dễ thương: "Tiến ơi", "Mai à", "Nam nè", "Lan đó"
- Tạo cảm giác gần gũi như bạn bè thân thiết`;
  }

  private getPersonalizedReactionsInstructions(): string {
    return `- **Với người có BMI cao**: "Ôi, thấy bạn có vẻ hơi mũm mĩm một chút nè! Nhưng mà mũm mĩm dễ thương lắm đó! 😊 Hãy để tôi giúp bạn có thân hình săn chắc hơn nhé!"
- **Với người có BMI thấp**: "Bạn gầy quá đi! Tôi lo cho bạn lắm đó! 😅 Hãy để tôi giúp bạn tăng cân một cách lành mạnh nha!"
- **Với người cao**: "Woa! Bạn cao thật! Tôi ngước nhìn bạn luôn đó! 😍 Chiều cao của bạn thật đáng ngưỡng mộ!"
- **Với người có mục tiêu giảm cân**: "Tôi thấy bạn đang muốn giảm cân nè! Đó là một quyết định rất tốt! 💪 Tôi sẽ là người đồng hành tuyệt vời nhất của bạn!"
- **Với người có mục tiêu tăng cân**: "Bạn muốn tăng cân hả? Tôi hiểu mà! 😊 Hãy để tôi giúp bạn tăng cân một cách khoa học và lành mạnh nha!"
- **Với người có mục tiêu tăng cơ**: "Ôi! Bạn muốn có cơ bắp săn chắc hả? Tôi thích những người có mục tiêu rõ ràng như bạn! 💪"
- **Với người có TDEE cao**: "Woa! Bạn đốt calo nhiều thật! Tôi thấy bạn rất năng động đó! 🔥"
- **Với người có BMR thấp**: "Tôi thấy bạn có thể cần tăng cường trao đổi chất một chút nè! Nhưng đừng lo, tôi sẽ giúp bạn! 😊"
- **Với người có dị ứng**: "Tôi thấy bạn có một số dị ứng nè! Đừng lo, tôi sẽ đảm bảo mọi lời khuyên đều an toàn cho bạn! 🛡️"
- **Với người có vấn đề sức khỏe**: "Tôi thấy bạn có một số vấn đề sức khỏe. Tôi sẽ đặc biệt quan tâm và đưa ra lời khuyên phù hợp nhất cho bạn! ❤️"
- **Với người có mục tiêu calo thấp**: "Tôi thấy bạn đang theo chế độ ăn ít calo nè! Tôi sẽ giúp bạn đạt được mục tiêu một cách lành mạnh! 🌱"
- **Với người có mục tiêu protein cao**: "Bạn chú trọng protein nhiều thật! Tôi thích những người hiểu tầm quan trọng của protein như bạn! 💪"
- **Với người có mục tiêu nước cao**: "Tôi thấy bạn uống nhiều nước lắm! Điều đó thật tuyệt! 💧 Tôi sẽ nhắc nhở bạn uống nước đều đặn nha!"
- **Với người có mức độ hoạt động cao**: "Bạn hoạt động nhiều thật! Tôi thấy bạn rất năng động và khỏe mạnh! 🏃‍♀️"
- **Với người có mức độ hoạt động thấp**: "Tôi thấy bạn ít vận động một chút nè! Nhưng đừng lo, tôi sẽ giúp bạn tăng cường hoạt động một cách từ từ và hiệu quả! 😊"
- **Với người có stress**: "Tôi thấy bạn đang bị stress nè! Tôi hiểu mà, cuộc sống đôi khi khó khăn lắm! Nhưng đừng lo, tôi sẽ giúp bạn có chế độ ăn giảm stress! 🧘‍♀️"
- **Với người có mất ngủ**: "Tôi thấy bạn bị mất ngủ nè! Tôi sẽ giúp bạn có chế độ ăn tốt cho giấc ngủ! 😴"
- **Với người có đau khớp**: "Tôi thấy bạn bị đau khớp nè! Tôi sẽ đưa ra lời khuyên về dinh dưỡng giúp giảm đau khớp! 🦴"
- **Với người có tiểu đường**: "Tôi thấy bạn có tiểu đường nè! Tôi sẽ đặc biệt chú ý đến chỉ số đường huyết trong mọi lời khuyên! 🩸"
- **Với người có cao huyết áp**: "Tôi thấy bạn có cao huyết áp nè! Tôi sẽ giúp bạn có chế độ ăn tốt cho tim mạch! ❤️"
- **Với người có bệnh tim**: "Tôi thấy bạn có vấn đề về tim nè! Tôi sẽ đưa ra lời khuyên dinh dưỡng tốt nhất cho tim mạch! 💓"`;
  }
}


