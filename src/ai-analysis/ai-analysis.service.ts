import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AiCache } from './entities/ai-cache.entity';
import { WaterService } from '../water/water.service';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class AiAnalysisService {
  private readonly logger = new Logger(AiAnalysisService.name);
  private openai: any = null;

  private aiConfig: {
    model: string;
    maxTokens: number;
    temperature: number;
  };

  constructor(
    @InjectRepository(AiCache)
    private aiCacheRepository: Repository<AiCache>,
    private configService: ConfigService,
    private waterService: WaterService,
    @Inject(forwardRef(() => ProfileService))
    private profileService: ProfileService,
  ) {
    // Load AI configuration from environment variables
    this.aiConfig = {
      model: this.configService.get<string>('OPENAI_MODEL') || 'gpt-4o',
      maxTokens: parseInt(this.configService.get<string>('OPENAI_MAX_TOKENS') || '2000', 10),
      temperature: parseFloat(this.configService.get<string>('OPENAI_TEMPERATURE') || '0.7'),
    };

    // Initialize OpenAI if API key is provided
    const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (openaiApiKey) {
      try {
        const { OpenAI } = require('openai');
        this.openai = new OpenAI({
          apiKey: openaiApiKey,
        });
        this.logger.log(`OpenAI initialized successfully with model: ${this.aiConfig.model}`);
      } catch (error) {
        this.logger.warn('OpenAI package not installed or invalid API key');
        this.openai = null;
      }
    } else {
      this.logger.warn('OpenAI API key not provided');
      this.openai = null;
    }
  }

  // === PROFILE ANALYSIS ===
  async analyzeProfile(userId: number, forceRefresh?: boolean): Promise<any> {
    if (!this.openai) {
      throw new Error('OpenAI không được khởi tạo. Vui lòng kiểm tra API key.');
    }

    try {
      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cachedResult = await this.getCachedResult(userId, 'profile_analysis', { forceRefresh });
        
        if (cachedResult) {
          this.logger.log(`Using cached profile analysis for user ${userId}`);
          return cachedResult;
        }
      }

      const profile = await this.profileService.findByUserId(userId);
      if (!profile) {
        throw new Error('Không tìm thấy profile người dùng');
      }

      // Prepare data for OpenAI
      const analysisData = {
        profile: {
          age: profile.age,
          gender: profile.gender,
          weight: profile.weight,
          height: profile.height,
          activityLevel: profile.activityLevel,
          goalType: profile.goalType,
          bodyFatPercentage: profile.bodyFatPercentage,
          skeletalMuscleMass: profile.skeletalMuscleMass,
          bmi: profile.bmi,
          visceralFatLevel: profile.visceralFatLevel,
          dailyWaterGoal: profile.dailyWaterGoal
        }
      };

      // Clean data before sending to AI
      const cleanedData = this.cleanDataForAI('profile_analysis', analysisData);

      // Send to OpenAI for analysis
      const analysis = await this.sendToOpenAI('profile_analysis', cleanedData);

      const result = {
        analysis,
        dataSummary: {
          profile: analysisData.profile
        },
        generatedAt: new Date().toISOString(),
        aiModel: this.aiConfig.model
      };

      // Cache the result
      await this.cacheResult(userId, 'profile_analysis', { forceRefresh }, result, analysis.tokensUsed, analysis.costUsd);

      return result;
    } catch (error) {
      this.logger.error(`Error analyzing profile: ${error.message}`);
      throw error;
    }
  }

  // === IDEAL STANDARDS CALCULATION ===
  async calculateIdealStandards(userId: number, forceRefresh?: boolean): Promise<any> {
    if (!this.openai) {
      throw new Error('OpenAI không được khởi tạo. Vui lòng kiểm tra API key.');
    }

    try {
      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cachedResult = await this.getCachedResult(userId, 'ideal_standards', { forceRefresh });
        
        if (cachedResult) {
          this.logger.log(`Using cached ideal standards for user ${userId}`);
          return cachedResult;
        }
      }

      const profile = await this.profileService.findByUserId(userId);
      if (!profile) {
        throw new Error('Không tìm thấy profile người dùng');
      }

      // Prepare data for OpenAI
      const standardsData = {
        profile: {
          age: profile.age,
          gender: profile.gender,
          height: profile.height,
          weight: profile.weight,
          activityLevel: profile.activityLevel,
          goalType: profile.goalType,
          bodyFatPercentage: profile.bodyFatPercentage,
          skeletalMuscleMass: profile.skeletalMuscleMass,
          bmi: profile.bmi,
          visceralFatLevel: profile.visceralFatLevel,
          totalBodyWater: profile.totalBodyWater,
          intracellularWater: profile.intracellularWater,
          extracellularWater: profile.extracellularWater,
          icwEcwRatio: profile.icwEcwRatio,
          ffmi: profile.ffmi,
          bmr: profile.bmr,
          tdee: profile.tdee
        }
      };

      // Clean data before sending to AI
      const cleanedData = this.cleanDataForAI('ideal_standards', standardsData);

      // Send to OpenAI for calculation
      const aiResponse = await this.sendToOpenAI('ideal_standards', cleanedData);

      // Parse AI response to get ideal standards profile
      let idealStandardsProfile;
      try {
        // Try to parse JSON from AI response
        const jsonMatch = aiResponse.analysis.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          idealStandardsProfile = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Không thể parse JSON từ AI response');
        }
      } catch (parseError) {
        this.logger.error(`Error parsing AI response: ${parseError.message}`);
        // Fallback to basic calculations if AI fails
        idealStandardsProfile = this.calculateBasicIdealStandards(profile);
      }

      // Ensure all required fields are present
      const completeIdealProfile = {
        id: null,
        firstName: "Chỉ số lý tưởng",
        lastName: "",
        age: profile.age,
        gender: profile.gender,
        height: profile.height,
        weight: idealStandardsProfile.weight || 0,
        bodyFatPercentage: idealStandardsProfile.bodyFatPercentage || 0,
        skeletalMuscleMass: idealStandardsProfile.skeletalMuscleMass || 0,
        visceralFat: idealStandardsProfile.visceralFat || 0,
        visceralFatLevel: idealStandardsProfile.visceralFatLevel || 0,
        totalBodyWater: idealStandardsProfile.totalBodyWater || 0,
        intracellularWater: idealStandardsProfile.intracellularWater || 0,
        extracellularWater: idealStandardsProfile.extracellularWater || 0,
        icwEcwRatio: idealStandardsProfile.icwEcwRatio || 0,
        ffmi: idealStandardsProfile.ffmi || 0,
        bmr: idealStandardsProfile.bmr || 0,
        tdee: idealStandardsProfile.tdee || 0,
        bmi: idealStandardsProfile.bmi || 0,
        activityLevel: profile.activityLevel,
        goalType: profile.goalType,
        dailyWaterGoal: idealStandardsProfile.dailyWaterGoal || 0,
        allergies: [],
        medicalConditions: [],
        healthIssues: [],
        notes: "Đây là các chỉ số lý tưởng được tính toán dựa trên đặc điểm cá nhân",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false,
        userId: userId
      };

      const result = {
        standards: completeIdealProfile,
        dataSummary: {
          profile: standardsData.profile
        },
        generatedAt: new Date().toISOString(),
        aiModel: this.aiConfig.model
      };

      // Cache the result
      await this.cacheResult(userId, 'ideal_standards', { forceRefresh }, result, aiResponse.tokensUsed, aiResponse.costUsd);

      return result;
    } catch (error) {
      this.logger.error(`Error calculating ideal standards: ${error.message}`);
      throw error;
    }
  }

  // Fallback method for basic ideal standards calculation
  private calculateBasicIdealStandards(profile: any): any {
    const heightInMeters = profile.height / 100;
    
    // Basic BMI calculation (18.5-24.9)
    const idealBMIMin = 18.5;
    const idealBMIMax = profile.gender === 'Male' ? 25.0 : 24.0;
    const idealWeightMin = idealBMIMin * heightInMeters * heightInMeters;
    const idealWeightMax = idealBMIMax * heightInMeters * heightInMeters;
    const idealWeight = (idealWeightMin + idealWeightMax) / 2;

    // Basic body fat calculation
    const idealBodyFatPercentage = profile.gender === 'Male' ? 15 : 25;
    
    // Basic muscle mass calculation
    const musclePercentage = profile.gender === 'Male' ? 0.45 : 0.35;
    const idealMuscleMass = idealWeight * musclePercentage;

    // Basic water calculation
    const idealWaterPercentage = 0.55;
    const idealTotalWater = idealWeight * idealWaterPercentage;

    // Basic BMR calculation
    const idealBMR = 10 * idealWeight + 6.25 * profile.height - 5 * profile.age;
    const adjustedBMR = profile.gender === 'Male' ? idealBMR + 5 : idealBMR - 161;

    // Basic TDEE calculation
    const activityMultipliers = {
      'Sedentary': 1.2,
      'LightlyActive': 1.375,
      'ModeratelyActive': 1.55,
      'VeryActive': 1.725,
      'ExtremelyActive': 1.9,
    };
    const multiplier = activityMultipliers[profile.activityLevel] || 1.2;
    const idealTDEE = Math.round(adjustedBMR * multiplier);

    return {
      weight: Math.round(idealWeight * 10) / 10,
      bodyFatPercentage: idealBodyFatPercentage,
      skeletalMuscleMass: Math.round(idealMuscleMass * 10) / 10,
      visceralFatLevel: 5,
      totalBodyWater: Math.round(idealTotalWater * 10) / 10,
      intracellularWater: Math.round(idealTotalWater * 0.67 * 10) / 10,
      extracellularWater: Math.round(idealTotalWater * 0.33 * 10) / 10,
      icwEcwRatio: 1.0,
      ffmi: Math.round((idealWeight * (1 - idealBodyFatPercentage / 100)) / (heightInMeters * heightInMeters) * 10) / 10,
      bmr: Math.round(adjustedBMR),
      tdee: idealTDEE,
      bmi: Math.round((idealWeight / (heightInMeters * heightInMeters)) * 10) / 10,
      dailyWaterGoal: Math.round(idealTotalWater * 1000) // Convert to ml
    };
  }

  // === HYDRATION EXPERT ANALYSIS ===
  async generateHydrationExpertAnalysis(
    userId: number, 
    period: 'week' | 'month' = 'month',
    analysisType: 'comprehensive' | 'focused' = 'comprehensive'
  ): Promise<any> {
    if (!this.openai) {
      throw new Error('OpenAI không được khởi tạo. Vui lòng kiểm tra API key.');
    }

    try {
      // Check cache first
      const cachedResult = await this.getCachedResult(userId, 'hydration_expert_analysis', { period, analysisType });
      
      if (cachedResult) {
        this.logger.log(`Using cached hydration expert analysis for user ${userId}`);
        return cachedResult;
      }

      // Get water and profile data
      let waterData;
      if (period === 'week') {
        waterData = await this.waterService.getStats(userId, 'week');
      } else {
        waterData = await this.waterService.getStats(userId, 'month');
      }
      
      const profile = await this.profileService.findByUserId(userId);

      if (!profile) {
        throw new Error('Không tìm thấy profile người dùng');
      }

      // Prepare data for OpenAI analysis
      const analysisData = {
        period,
        analysisType,
        waterStats: waterData,
        profile: {
          age: profile.age,
          gender: profile.gender,
          weight: profile.weight,
          height: profile.height,
          activityLevel: profile.activityLevel,
          goalType: profile.goalType,
          bodyFatPercentage: profile.bodyFatPercentage,
          skeletalMuscleMass: profile.skeletalMuscleMass,
          bmi: profile.bmi,
          dailyWaterGoal: profile.dailyWaterGoal
        }
      };

      // Clean data before sending to AI
      const cleanedData = this.cleanDataForAI('hydration_expert_analysis', analysisData);

      // Send to OpenAI for expert analysis
      const expertAnalysis = await this.sendToOpenAI('hydration_expert_analysis', cleanedData);

      const result = {
        period,
        analysisType,
        expertAnalysis,
        dataSummary: {
          waterStats: waterData,
          profile: analysisData.profile
        },
        generatedAt: new Date().toISOString(),
        aiModel: this.aiConfig.model
      };

      // Cache the result
      await this.cacheResult(userId, 'hydration_expert_analysis', { period, analysisType }, result, expertAnalysis.tokensUsed, expertAnalysis.costUsd);

      return result;
    } catch (error) {
      this.logger.error(`Error generating hydration expert analysis: ${error.message}`);
      throw error;
    }
  }

  // === CORE OPENAI INTEGRATION ===
  private async sendToOpenAI(requestType: string, data: any): Promise<any> {
    const prompt = this.buildPrompt(requestType, data);
    
    try {
      const completion = await this.openai.chat.completions.create({
        model: this.aiConfig.model,
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(requestType)
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.aiConfig.maxTokens * 2,
        temperature: 0.7
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('Không nhận được phản hồi từ AI');
      }

      const tokensUsed = completion.usage?.total_tokens || 0;
      const costUsd = this.calculateCost(tokensUsed, this.aiConfig.model);

      // Log input và output
      this.logger.log(`OpenAI Input: ${JSON.stringify(data, null, 2)}`);
      this.logger.log(`OpenAI Output: ${response}`);

      return {
        analysis: response,
        tokensUsed,
        costUsd
      };
    } catch (error) {
      this.logger.error(`OpenAI API error: ${error.message}`);
      throw error;
    }
  }

  // === DATA CLEANING FOR AI ===
  private cleanProfileDataForAI(profile: any): any {
    if (!profile) return null;

    // Làm sạch dữ liệu profile
    const cleaned = {
      age: profile.age,
      gender: profile.gender,
      weight: profile.weight,
      height: profile.height,
      bmi: profile.bmi,
      activityLevel: profile.activityLevel,
      goalType: profile.goalType,
      bodyFatPercentage: profile.bodyFatPercentage,
      skeletalMuscleMass: profile.skeletalMuscleMass,
      visceralFatLevel: profile.visceralFatLevel,
      dailyWaterGoal: profile.dailyWaterGoal
    };

    // Loại bỏ các giá trị null/undefined
    Object.keys(cleaned).forEach(key => {
      if (cleaned[key] === null || cleaned[key] === undefined) {
        delete cleaned[key];
      }
    });

    return cleaned;
  }

  private cleanDataForAI(requestType: string, data: any): any {
    const cleaned: any = {};

    switch (requestType) {
      case 'profile_analysis':
        cleaned.profile = this.cleanProfileDataForAI(data.profile);
        break;

      case 'ideal_standards':
        cleaned.profile = this.cleanProfileDataForAI(data.profile);
        break;

      case 'hydration_expert_analysis':
        cleaned.period = data.period;
        cleaned.analysisType = data.analysisType;
        cleaned.waterStats = data.waterStats; // Giữ nguyên waterStats vì không cần clean
        cleaned.profile = this.cleanProfileDataForAI(data.profile);
        break;

      default:
        cleaned.data = data;
    }

    return cleaned;
  }

  private getSystemPrompt(requestType: string): string {
    switch (requestType) {
      case 'profile_analysis':
        return `Bạn là chuyên gia sức khỏe và dinh dưỡng hàng đầu với chuyên môn sâu về phân tích cơ thể, dinh dưỡng học và y học thể thao. Bạn có kinh nghiệm tư vấn cho hàng nghìn khách hàng với các mục tiêu khác nhau.

Hãy phân tích profile sức khỏe của người dùng và đưa ra đánh giá chuyên môn như một chuyên gia đang khám và tư vấn trực tiếp. Trả về kết quả dưới dạng văn bản tự nhiên, không phải JSON.

Bao gồm:
- Đánh giá tổng quan tình trạng sức khỏe
- Phân tích các chỉ số cơ thể
- So sánh với tiêu chuẩn y tế
- Xác định vấn đề cần cải thiện
- Khuyến nghị dinh dưỡng và lối sống`;

      case 'ideal_standards':
        return `Bạn là chuyên gia dinh dưỡng và thể dục hàng đầu, có bằng cấp về dinh dưỡng học và y học thể thao. Bạn chuyên sâu về tính toán các chỉ số lý tưởng dựa trên đặc điểm cá nhân.

Dựa trên profile sức khỏe của người dùng, hãy tính toán các chỉ số lý tưởng. Trả về kết quả dưới dạng JSON với cấu trúc giống hệt một profile thật, nhưng đây là các chỉ số mẫu lý tưởng.

Cấu trúc JSON trả về phải có đầy đủ các trường như một profile:
{
  "id": null,
  "firstName": "Chỉ số lý tưởng",
  "lastName": "",
  "age": [tuổi người dùng],
  "gender": "[giới tính người dùng]",
  "height": [chiều cao người dùng],
  "weight": [cân nặng lý tưởng],
  "bodyFatPercentage": [tỷ lệ mỡ lý tưởng],
  "skeletalMuscleMass": [khối lượng cơ xương lý tưởng],
  "visceralFat": [mỡ nội tạng lý tưởng],
  "visceralFatLevel": [chỉ số mỡ nội tạng lý tưởng],
  "totalBodyWater": [tổng lượng nước lý tưởng],
  "intracellularWater": [nước nội bào lý tưởng],
  "extracellularWater": [nước ngoại bào lý tưởng],
  "icwEcwRatio": [tỷ lệ ICW/ECW lý tưởng],
  "ffmi": [FFMI lý tưởng],
  "bmr": [BMR lý tưởng],
  "tdee": [TDEE lý tưởng],
  "bmi": [BMI lý tưởng],
  "activityLevel": "[mức độ hoạt động người dùng]",
  "goalType": "[mục tiêu người dùng]",
  "dailyWaterGoal": [mục tiêu nước lý tưởng],
  "allergies": [],
  "medicalConditions": [],
  "healthIssues": [],
  "notes": "Đây là các chỉ số lý tưởng được tính toán dựa trên đặc điểm cá nhân",
  "createdAt": "[timestamp hiện tại]",
  "updatedAt": "[timestamp hiện tại]",
  "isDeleted": false,
  "userId": [userId người dùng]
}

Sử dụng các công thức y học chuẩn và điều chỉnh theo tuổi, giới tính, chiều cao, mức độ hoạt động và mục tiêu của người dùng. Đảm bảo tất cả các giá trị số đều là số thực, không phải string.`;

      case 'hydration_expert_analysis':
        return `Bạn là chuyên gia dinh dưỡng và thể dục hàng đầu, có bằng cấp về dinh dưỡng học và y học thể thao. Bạn chuyên sâu về tác động của hydration lên hiệu suất thể thao, chuyển hóa và sức khỏe tổng thể.

Hãy tạo một bài phân tích chuyên sâu về tác động của thói quen uống nước lên sức khỏe như một bài viết chuyên môn của chuyên gia. Trả về kết quả dưới dạng văn bản tự nhiên, không phải JSON.

Bao gồm:
- Tiêu đề và tóm tắt
- Phân tích chi tiết tác động lên các hệ thống cơ thể
- Bằng chứng khoa học
- Khuyến nghị thực tế
- Kế hoạch hành động cụ thể`;

      default:
        return 'Bạn là chuyên gia dinh dưỡng và sức khỏe. Hãy phân tích dữ liệu và đưa ra lời khuyên chuyên môn dưới dạng văn bản tự nhiên bằng tiếng Việt.';
    }
  }

  private buildPrompt(requestType: string, data: any): string {
    switch (requestType) {
      case 'profile_analysis':
        return `Dựa trên thông tin profile sức khỏe của người dùng, hãy đánh giá và tư vấn như một chuyên gia sức khỏe:

**Thông tin profile:**
${JSON.stringify(data.profile, null, 2)}

Hãy đưa ra đánh giá chuyên môn, phân tích tình trạng sức khỏe và khuyến nghị cụ thể. Viết như đang khám và tư vấn trực tiếp.`;

      case 'ideal_standards':
        return `Dựa trên thông tin profile sức khỏe của người dùng, hãy tính toán các chỉ số lý tưởng:

**Thông tin profile:**
${JSON.stringify(data.profile, null, 2)}

Hãy tính toán các chỉ số lý tưởng dựa trên tuổi, giới tính, chiều cao, mức độ hoạt động và mục tiêu của người dùng. Trả về kết quả dưới dạng JSON với cấu trúc chính xác như đã mô tả.`;

      case 'hydration_expert_analysis':
        return `Dựa trên dữ liệu hydration và profile sức khỏe, hãy tạo bài phân tích chuyên sâu như một chuyên gia dinh dưỡng:

**Dữ liệu phân tích:**
- Thời gian: ${data.period}
- Loại phân tích: ${data.analysisType}
- Dữ liệu nước: ${JSON.stringify(data.waterStats, null, 2)}
- Thông tin cá nhân: ${JSON.stringify(data.profile, null, 2)}

Hãy tạo một bài phân tích chuyên sâu về tác động của hydration lên sức khỏe, bao gồm bằng chứng khoa học và khuyến nghị thực tế.`;

      default:
        return `Phân tích dữ liệu sức khỏe: ${JSON.stringify(data, null, 2)}

Hãy đưa ra lời khuyên chuyên môn dưới dạng văn bản tự nhiên.`;
    }
  }

  // === CACHE MANAGEMENT ===
  async refreshCache(userId: number, requestType?: string): Promise<void> {
    try {
      const whereCondition: any = { userId };
      if (requestType) {
        whereCondition.requestType = requestType;
      }

      await this.aiCacheRepository.delete(whereCondition);
      this.logger.log(`Cache refreshed for user ${userId}${requestType ? `, type: ${requestType}` : ''}`);
    } catch (error) {
      this.logger.error(`Error refreshing cache: ${error.message}`);
      throw error;
    }
  }

  async getCacheStats(userId: number): Promise<any> {
    try {
      const cacheEntries = await this.aiCacheRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' }
      });

      const totalEntries = cacheEntries.length;
      const totalSize = cacheEntries.reduce((sum, entry) => sum + (JSON.stringify(entry.responseData)?.length || 0), 0);

      return {
        totalEntries,
        totalSize,
        averageSize: totalEntries > 0 ? Math.round(totalSize / totalEntries) : 0,
        entries: cacheEntries.map(entry => ({
          id: entry.id,
          requestType: entry.requestType,
          createdAt: entry.createdAt,
          size: JSON.stringify(entry.responseData)?.length || 0
        }))
      };
    } catch (error) {
      this.logger.error(`Error getting cache stats: ${error.message}`);
      throw error;
    }
  }

  private calculateCost(tokens: number, model: string): number {
    const costPerToken = model.includes('gpt-4') ? 0.00003 : 0.000002;
    return tokens * costPerToken;
  }

  private async getCachedResult(userId: number, requestType: string, params: any): Promise<any> {
    try {
      const cachedEntry = await this.aiCacheRepository.findOne({
        where: { 
          userId, 
          requestType,
          inputData: params
        }
      });

      if (cachedEntry && !cachedEntry.isExpired && new Date() < cachedEntry.expiresAt) {
        this.logger.log(`Found valid cached result for user ${userId}, type: ${requestType}`);
        return cachedEntry.responseData;
      }
      return null;
    } catch (error) {
      this.logger.error(`Error getting cached result: ${error.message}`);
      return null; // Return null instead of throwing to avoid breaking the flow
    }
  }

  private async cacheResult(userId: number, requestType: string, params: any, response: any, tokensUsed: number, costUsd: number) {
    try {
      // Set cache expiry to 24 hours
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const newCacheEntry = new AiCache();
      newCacheEntry.userId = userId;
      newCacheEntry.requestType = requestType;
      newCacheEntry.inputData = params;
      newCacheEntry.responseData = response;
      newCacheEntry.source = 'gpt';
      newCacheEntry.isFromGpt = true;
      newCacheEntry.gptModel = this.aiConfig.model;
      newCacheEntry.tokensUsed = tokensUsed;
      newCacheEntry.costUsd = costUsd;
      newCacheEntry.expiresAt = expiresAt;
      newCacheEntry.isExpired = false;

      await this.aiCacheRepository.save(newCacheEntry);
      this.logger.log(`Cached result for user ${userId}, type: ${requestType}`);
    } catch (error) {
      this.logger.error(`Error caching result: ${error.message}`);
      // Don't throw error to avoid breaking the main flow
    }
  }

  private generateCacheKey(requestType: string, params: any): string {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${requestType}_${paramString}`;
  }
}
