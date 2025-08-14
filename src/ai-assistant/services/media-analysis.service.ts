import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MediaType } from '../dto/ai-action.dto';

@Injectable()
export class MediaAnalysisService {
  private readonly logger = new Logger(MediaAnalysisService.name);
  private readonly openaiApiKey: string;
  private readonly openaiVisionModel: string;
  private readonly openaiWhisperModel: string;

  constructor(private configService: ConfigService) {
    this.openaiApiKey = this.configService.get<string>('OPENAI_API_KEY') || '';
    this.openaiVisionModel = this.configService.get<string>('OPENAI_VISION_MODEL', 'gpt-4-vision-preview');
    this.openaiWhisperModel = this.configService.get<string>('OPENAI_WHISPER_MODEL', 'whisper-1');
  }

  async analyzeVoice(audioUrl: string): Promise<{
    transcription: string;
    confidence: number;
    detectedIntent?: string;
  }> {
    try {
      this.logger.log(`Analyzing voice from: ${audioUrl}`);

      // Sử dụng OpenAI Whisper để chuyển đổi speech-to-text
      const transcription = await this.transcribeAudio(audioUrl);
      
      // Phân tích ý định từ transcription
      const intentAnalysis = await this.analyzeVoiceIntent(transcription);

      return {
        transcription,
        confidence: intentAnalysis.confidence,
        detectedIntent: intentAnalysis.intent
      };
    } catch (error) {
      this.logger.error('Error analyzing voice:', error);
      throw error;
    }
  }

  async analyzeImage(imageUrl: string): Promise<{
    detectedFoods: string[];
    estimatedCalories: number;
    confidence: number;
    imageDescription: string;
    suggestions: string[];
  }> {
    try {
      this.logger.log(`Analyzing image from: ${imageUrl}`);

      // Sử dụng OpenAI Vision để phân tích ảnh
      const imageAnalysis = await this.analyzeImageWithVision(imageUrl);
      
      // Phân tích thực phẩm và tính calo
      const foodAnalysis = await this.analyzeFoodFromImage(imageAnalysis.description);
      
      // Đề xuất actions dựa trên phân tích
      const suggestions = this.suggestActionsFromFoodAnalysis(foodAnalysis);

      return {
        detectedFoods: foodAnalysis.foods,
        estimatedCalories: foodAnalysis.calories,
        confidence: foodAnalysis.confidence,
        imageDescription: imageAnalysis.description,
        suggestions
      };
    } catch (error) {
      this.logger.error('Error analyzing image:', error);
      throw error;
    }
  }

  private async transcribeAudio(audioUrl: string): Promise<string> {
    try {
      // Gọi OpenAI Whisper API
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
        },
        body: JSON.stringify({
          file: audioUrl,
          model: this.openaiWhisperModel,
          language: 'vi', // Vietnamese
          response_format: 'json'
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI Whisper API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.text || '';
    } catch (error) {
      this.logger.error('Error transcribing audio:', error);
      throw error;
    }
  }

  private async analyzeVoiceIntent(transcription: string): Promise<{
    intent: string;
    confidence: number;
  }> {
    try {
      // Sử dụng GPT để phân tích ý định từ transcription
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Bạn là AI chuyên phân tích ý định từ giọng nói tiếng Việt. Trả về JSON với intent và confidence.'
            },
            {
              role: 'user',
              content: `Phân tích ý định từ: "${transcription}"`
            }
          ],
          max_tokens: 100,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      // Parse JSON response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        intent: 'unknown',
        confidence: 0.5
      };
    } catch (error) {
      this.logger.error('Error analyzing voice intent:', error);
      return {
        intent: 'unknown',
        confidence: 0.3
      };
    }
  }

  private async analyzeImageWithVision(imageUrl: string): Promise<{
    description: string;
    confidence: number;
  }> {
    try {
      // Gọi OpenAI Vision API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.openaiVisionModel,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Mô tả chi tiết những gì bạn thấy trong ảnh này. Nếu có thực phẩm, hãy liệt kê tên và ước tính lượng calo.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageUrl
                  }
                }
              ]
            }
          ],
          max_tokens: 300,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI Vision API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const description = data.choices[0]?.message?.content || '';

      return {
        description,
        confidence: 0.8
      };
    } catch (error) {
      this.logger.error('Error analyzing image with vision:', error);
      throw error;
    }
  }

  private async analyzeFoodFromImage(description: string): Promise<{
    foods: string[];
    calories: number;
    confidence: number;
  }> {
    try {
      // Sử dụng GPT để phân tích thực phẩm từ mô tả ảnh
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Bạn là chuyên gia dinh dưỡng. Phân tích thực phẩm và ước tính calo. Trả về JSON với foods (array), calories (number), confidence (0-1).'
            },
            {
              role: 'user',
              content: `Phân tích thực phẩm từ mô tả: "${description}"`
            }
          ],
          max_tokens: 200,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      // Parse JSON response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        foods: [],
        calories: 0,
        confidence: 0.3
      };
    } catch (error) {
      this.logger.error('Error analyzing food from image:', error);
      return {
        foods: [],
        calories: 0,
        confidence: 0.3
      };
    }
  }

  private suggestActionsFromFoodAnalysis(foodAnalysis: {
    foods: string[];
    calories: number;
    confidence: number;
  }): string[] {
    const suggestions: string[] = [];

    if (foodAnalysis.foods.length > 0) {
      suggestions.push('ADD_MEAL');
      suggestions.push('SEARCH_FOOD');
      
      if (foodAnalysis.calories > 0) {
        suggestions.push('GET_NUTRITION_ADVICE');
      }
    }

    return suggestions;
  }
}
