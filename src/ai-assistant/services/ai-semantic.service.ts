import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AIActionRequestDto, AIActionResponseDto, MediaType } from '../dto/ai-action.dto';
import { AI_ACTIONS, getActionByName } from '../config/ai-actions.config';
import { MediaDetectionService } from './media-detection.service';
import { MediaAnalysisService } from './media-analysis.service';

@Injectable()
export class AISemanticService {
  private readonly logger = new Logger(AISemanticService.name);
  private readonly openaiApiKey: string;
  private readonly openaiModel: string;
  private readonly openaiMaxTokens: number;
  private readonly openaiTemperature: number;
  private readonly openaiVisionModel: string;
  private readonly openaiWhisperModel: string;

  constructor(
    private configService: ConfigService,
    private mediaDetectionService: MediaDetectionService,
    private mediaAnalysisService: MediaAnalysisService
  ) {
    this.openaiApiKey = this.configService.get<string>('OPENAI_API_KEY') || '';
    this.openaiModel = this.configService.get<string>('OPENAI_MODEL', 'gpt-4o');
    this.openaiMaxTokens = parseInt(this.configService.get<string>('OPENAI_MAX_TOKENS') || '1000', 10);
    this.openaiTemperature = parseFloat(this.configService.get<string>('OPENAI_TEMPERATURE') || '0.1');
    this.openaiVisionModel = this.configService.get<string>('OPENAI_VISION_MODEL', 'gpt-4-vision-preview');
    this.openaiWhisperModel = this.configService.get<string>('OPENAI_WHISPER_MODEL', 'whisper-1');
  }

  async analyzeMessage(request: AIActionRequestDto, contentType?: string): Promise<AIActionResponseDto> {
    try {
      // 1. Detect media type từ message và content-type
      const mediaInfo = this.mediaDetectionService.detectMediaType(request.message, contentType);
      
      // 2. Xử lý theo loại media
      let processedMessage = request.message;
      let mediaAnalysis: any = null;

      if (mediaInfo.mediaType === MediaType.VOICE) {
        // Phân tích voice
        const voiceAnalysis = await this.mediaAnalysisService.analyzeVoice(request.message);
        processedMessage = voiceAnalysis.transcription;
        mediaAnalysis = {
          transcription: voiceAnalysis.transcription,
          confidence: voiceAnalysis.confidence,
          suggestions: []
        };
      } else if (mediaInfo.mediaType === MediaType.IMAGE) {
        // Phân tích image
        const imageAnalysis = await this.mediaAnalysisService.analyzeImage(request.message);
        processedMessage = `Ảnh chứa: ${imageAnalysis.detectedFoods.join(', ')}. Ước tính ${imageAnalysis.estimatedCalories} calo. ${imageAnalysis.imageDescription}`;
        mediaAnalysis = {
          detectedFoods: imageAnalysis.detectedFoods,
          estimatedCalories: imageAnalysis.estimatedCalories,
          confidence: imageAnalysis.confidence,
          suggestions: imageAnalysis.suggestions,
          imageDescription: imageAnalysis.imageDescription
        };
      }

      // 3. Tạo prompt cho AI với message đã xử lý
      const prompt = this.createAnalysisPrompt(processedMessage, request.context, mediaAnalysis);
      
      // 4. Gọi OpenAI API
      const aiResponse = await this.callOpenAI(prompt);
      
      // 5. Parse response từ AI
      const parsedResponse = this.parseAIResponse(aiResponse);
      
      // 6. Validate và enhance response
      const response = this.validateAndEnhanceResponse(parsedResponse, request);
      
      // 7. Thêm thông tin media
      if (mediaAnalysis) {
        response.mediaAnalysis = mediaAnalysis;
      }
      response.mediaInfo = mediaInfo;
      
      return response;
      
    } catch (error) {
      this.logger.error('Error analyzing message with AI:', error);
      return this.generateFallbackResponse(request.message);
    }
  }

  private createAnalysisPrompt(message: string, context?: any, mediaAnalysis?: any): string {
    const actionsDescription = AI_ACTIONS.map(action => {
      const requiredParams = action.requiredParams.map(p => p.name).join(', ');
      const optionalParams = action.optionalParams.map(p => p.name).join(', ');
      
      return `${action.action}: ${action.description}
- Required: [${requiredParams || 'none'}]
- Optional: [${optionalParams || 'none'}]
- Confirmation: ${action.confirmationRequired ? 'Yes' : 'No'}`;
    }).join('\n\n');

    return `Bạn là AI Assistant cho hệ thống NutriWise - ứng dụng quản lý dinh dưỡng và sức khỏe.

Các hành động có thể thực hiện:
${actionsDescription}

HƯỚNG DẪN PHÂN TÍCH:
- "Tôi vừa ăn..." → ADD_MEAL (ghi nhận bữa ăn)
- "Tôi muốn tạo profile..." → CREATE_PROFILE (tạo profile mới)
- "Tôi muốn xem..." → VIEW_* (xem thông tin)
- "Tôi muốn thêm..." → ADD_* (thêm thông tin)
- "Tôi muốn cập nhật..." → UPDATE_* (cập nhật thông tin)

Nhiệm vụ: Phân tích tin nhắn của người dùng và xác định:
1. Ý định (intent) - có phải muốn thực hiện action nào không
2. Thông tin đã cung cấp (providedParams)
3. Thông tin còn thiếu (missingParams)
4. Câu hỏi thông minh để thu thập thông tin (smartQuestions)

Context hiện tại: ${JSON.stringify(context || {})}

${mediaAnalysis ? `Phân tích media: ${JSON.stringify(mediaAnalysis)}` : ''}

Tin nhắn người dùng: "${message}"

Trả về JSON theo format sau:
{
  "intent": "tên_action_hoặc_unknown",
  "confidence": 0.0-1.0,
  "userIntent": "Mô tả ý định của người dùng",
  "requiredInfo": {
    "action": "TÊN_ACTION",
    "requiredParams": ["param1", "param2"],
    "providedParams": {"param1": "value1"},
    "missingParams": ["param2"],
    "smartQuestions": ["Câu hỏi 1?", "Câu hỏi 2?"]
  },
  "contextualResponse": "Phản hồi tự nhiên cho người dùng",
  "nextActions": ["collect_info", "confirm_action"]
}

Nếu không phải action nào, trả về:
{
  "intent": "unknown",
  "confidence": 0.0,
  "userIntent": "Chat thông thường",
  "contextualResponse": "Phản hồi tự nhiên",
  "nextActions": ["general_chat"]
}`;
  }

  private async callOpenAI(prompt: string): Promise<string> {
    try {
      const requestBody = {
        model: this.openaiModel,
        messages: [
          {
            role: 'system',
            content: 'Bạn là AI Assistant chuyên phân tích ý định người dùng cho hệ thống NutriWise. Luôn trả về JSON hợp lệ.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.openaiMaxTokens,
        temperature: this.openaiTemperature,
      };
      
      // Sử dụng fetch để gọi OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`OpenAI API error response: ${errorText}`);
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
      
    } catch (error) {
      this.logger.error('Error calling OpenAI API:', error);
      throw error;
    }
  }

  private parseAIResponse(aiResponse: string): any {
    try {
      // Tìm JSON trong response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return this.generateFallbackResponse('');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate và set default values cho required fields
      if (!parsed.intent) {
        parsed.intent = 'unknown';
      }
      
      if (typeof parsed.confidence !== 'number') {
        parsed.confidence = 0.5;
      }
      
      if (!parsed.userIntent) {
        parsed.userIntent = 'Chat thông thường';
      }
      
      if (!parsed.contextualResponse) {
        parsed.contextualResponse = 'Tôi hiểu bạn đang nói chuyện với tôi. Bạn có muốn tôi giúp gì không?';
      }

      return parsed;
      
    } catch (error) {
      this.logger.error('Error parsing AI response:', error);
      // Return fallback response instead of throwing
      return this.generateFallbackResponse('');
    }
  }

  private validateAndEnhanceResponse(parsedResponse: any, request: AIActionRequestDto): AIActionResponseDto {
    const { intent, confidence, userIntent, requiredInfo, contextualResponse, nextActions } = parsedResponse;

    // Validate action nếu có
    if (intent !== 'unknown' && requiredInfo?.action) {
      const actionDefinition = getActionByName(requiredInfo.action);
      if (!actionDefinition) {
        this.logger.warn(`Unknown action: ${requiredInfo.action}`);
        return this.generateFallbackResponse(request.message);
      }

      // Validate required parameters
      const missingRequired = actionDefinition.requiredParams
        .filter(param => !requiredInfo.providedParams?.[param.name])
        .map(param => param.name);

      if (missingRequired.length > 0) {
        requiredInfo.missingParams = missingRequired;
      }
    }

    return {
      intent,
      confidence: Math.max(0, Math.min(1, confidence)), // Ensure 0-1 range
      userIntent,
      requiredInfo,
      contextualResponse,
      nextActions: nextActions || []
    };
  }

  private generateFallbackResponse(message: string): AIActionResponseDto {
    return {
      intent: 'unknown',
      confidence: 0.0,
      userIntent: 'Chat thông thường',
      contextualResponse: 'Tôi hiểu bạn đang nói chuyện với tôi. Bạn có muốn tôi giúp gì không? Tôi có thể hỗ trợ tạo profile, ghi nhận bữa ăn, tạo mục tiêu và nhiều thứ khác.',
      nextActions: ['general_chat']
    };
  }

  async getAvailableActions(): Promise<any[]> {
    return AI_ACTIONS.map(action => ({
      action: action.action,
      description: action.description,
      requiredParams: action.requiredParams.map(p => p.name),
      optionalParams: action.optionalParams.map(p => p.name),
      confirmationRequired: action.confirmationRequired
    }));
  }
}
