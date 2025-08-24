import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AiCache } from './entities/ai-cache.entity';
import { Profile } from '../profile/entities/profile.entity';

import { WaterService } from '../water/water.service';
import { ProfileService } from '../profile/profile.service';

// Profile Analysis interfaces
export interface ProfileAnalysis {
  healthAssessment: {
    overallHealth: 'GOOD' | 'AVERAGE' | 'NEEDS_IMPROVEMENT';
    bodyType: 'ECTOMORPH' | 'MESOMORPH' | 'ENDOMORPH';
    healthScore: number;
    weightAnalysis: {
      status: 'UNDERWEIGHT' | 'NORMAL' | 'OVERWEIGHT' | 'OBESE';
      recommendation: string;
      riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    };
    bodyFatAnalysis: {
      status: 'LOW' | 'NORMAL' | 'HIGH' | 'VERY_HIGH';
      recommendation: string;
      healthRisks: string[];
    };
    muscleAnalysis: {
      status: 'LOW' | 'NORMAL' | 'HIGH';
      recommendation: string;
      potential: string;
    };
    visceralFatAnalysis: {
      status: 'LOW' | 'NORMAL' | 'HIGH';
      recommendation: string;
      healthRisks: string[];
    };
  };
  comparisonWithStandards: {
    ageGroup: string;
    genderGroup: string;
    percentile: string;
    ranking: 'BOTTOM_25%' | '25-50%' | '50-75%' | 'TOP_25%';
  };
  healthIssues: {
    immediate: string[];
    longTerm: string[];
    recommendations: string[];
  };
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: any = null;

  private aiConfig: {
    model: string;
    maxTokens: number;
    temperature: number;
    systemPrompt: string;
    cacheExpiryHours: number;
    cacheEnabled: boolean;
  };

  constructor(
    @InjectRepository(AiCache)
    private aiCacheRepository: Repository<AiCache>,

    private configService: ConfigService,
    private waterService: WaterService,
    private profileService: ProfileService,
  ) {
    // Load AI configuration from environment variables
    this.aiConfig = {
      model: this.configService.get<string>('OPENAI_MODEL') || 'gpt-4o',
      maxTokens: parseInt(this.configService.get<string>('OPENAI_MAX_TOKENS') || '2000', 10),
      temperature: parseFloat(this.configService.get<string>('OPENAI_TEMPERATURE') || '0.7'),
      systemPrompt: this.configService.get<string>('OPENAI_SYSTEM_PROMPT') || 'Bạn là chuyên gia dinh dưỡng và thể dục. Hãy đưa ra lời khuyên cá nhân hóa, chính xác và có thể thực hiện được dựa trên dữ liệu người dùng. Trả về phản hồi bằng tiếng Việt và định dạng JSON hợp lệ.',
      cacheExpiryHours: parseInt(this.configService.get<string>('AI_CACHE_EXPIRY_HOURS') || '24', 10),
      cacheEnabled: this.configService.get<string>('AI_CACHE_ENABLED') === 'true',
    };

    // Initialize OpenAI if API key is provided
    const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (openaiApiKey) {
      try {
        // Dynamic import to avoid issues if openai package is not installed
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
      this.logger.warn('OpenAI API key not provided, using fallback calculations');
      this.openai = null;
    }
  }

  private async getCachedResponse(userId: number, requestType: string, inputData: any): Promise<any> {
    if (!this.aiConfig.cacheEnabled) {
      return null;
    }

    const cache = await this.aiCacheRepository.findOne({
      where: {
        userId,
        requestType,
        isExpired: false,
      },
      order: { createdAt: 'DESC' }
    });

    if (cache && new Date() < cache.expiresAt) {
      this.logger.log(`Using cached response for user ${userId}, type: ${requestType}`);
      return {
        data: cache.responseData,
        source: cache.source,
        isFromGpt: cache.isFromGpt,
        cacheId: cache.id,
      };
    }

    return null;
  }

  private async saveCache(
    userId: number,
    requestType: string,
    inputData: any,
    responseData: any,
    source: 'gpt' | 'fallback',
    isFromGpt: boolean = false,
    gptModel?: string,
    tokensUsed?: number,
    costUsd?: number,
  ): Promise<AiCache | null> {
    if (!this.aiConfig.cacheEnabled) {
      return null;
    }

    try {
      // Create expiry date
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + this.aiConfig.cacheExpiryHours);

      const cache = this.aiCacheRepository.create({
        userId,
        requestType,
        inputData,
        responseData,
        source,
        isFromGpt,
        gptModel,
        tokensUsed,
        costUsd,
        expiresAt,
        isExpired: false,
      });

      return await this.aiCacheRepository.save(cache);
    } catch (error) {
      this.logger.error('Error saving cache:', error);
      return null;
    }
  }

  private async callGpt(prompt: string): Promise<{ response: any; model: string; tokensUsed: number; costUsd: number }> {
    if (!this.openai) {
      throw new Error('OpenAI not initialized');
    }

    const response = await this.openai.chat.completions.create({
      model: this.aiConfig.model,
      messages: [
        { role: 'system', content: this.aiConfig.systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: this.aiConfig.maxTokens,
      temperature: this.aiConfig.temperature,
      response_format: { type: 'json_object' }
    });

    const tokensUsed = response.usage?.total_tokens || 0;
    const costUsd = this.calculateCost(tokensUsed, this.aiConfig.model);

    return {
      response: JSON.parse(response.choices[0].message.content),
      model: this.aiConfig.model,
      tokensUsed,
      costUsd,
    };
  }

  private calculateCost(tokens: number, model: string): number {
    // Cost calculation based on OpenAI pricing (approximate)
    const costPerToken = model.includes('gpt-4') ? 0.00003 : 0.000002;
    return tokens * costPerToken;
  }

  // === PROFILE ANALYSIS ===
  async analyzeProfile(userId: number, forceRefresh: boolean = false): Promise<ProfileAnalysis> {
    const profile = await this.profileService.findByUserId(userId);
    
    if (!profile) {
      throw new Error('Không tìm thấy hồ sơ người dùng');
    }

    const inputData = {
      age: profile.age,
      gender: profile.gender,
      weight: profile.weight,
      height: profile.height,
      activityLevel: profile.activityLevel,
      goalType: profile.goalType,
      bodyFatPercentage: profile.bodyFatPercentage,
      skeletalMuscleMass: profile.skeletalMuscleMass,
      visceralFatLevel: profile.visceralFatLevel,
      totalBodyWater: profile.totalBodyWater,
      medicalConditions: profile.medicalConditions,
      healthIssues: profile.healthIssues,
    };

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = await this.getCachedResponse(userId, 'profile_analysis', inputData);
      if (cached) {
        return cached.data;
      }
    }

    try {
      if (this.openai) {
        const prompt = `Bạn là một chuyên gia dinh dưỡng và huấn luyện viên cá nhân có kinh nghiệm. Hãy phân tích hồ sơ sức khỏe của người dùng và đưa ra đánh giá bằng ngôn ngữ tự nhiên, như thể bạn đang tư vấn trực tiếp cho họ.

        Thông tin người dùng:
        - Tuổi: ${profile.age}
        - Giới tính: ${profile.gender}
        - Cân nặng: ${profile.weight}kg
        - Chiều cao: ${profile.height}cm
        - Mức độ hoạt động: ${profile.activityLevel}
        - Tỷ lệ mỡ: ${profile.bodyFatPercentage}%
        - Khối lượng cơ: ${profile.skeletalMuscleMass}kg
        - Mỡ nội tạng: ${profile.visceralFatLevel}
        - Tổng nước cơ thể: ${profile.totalBodyWater}kg
        - Bệnh nền: ${profile.medicalConditions?.join(', ') || 'Không có'}
        - Vấn đề sức khỏe: ${profile.healthIssues?.join(', ') || 'Không có'}

        Hãy trả về một đối tượng JSON với cấu trúc sau, nhưng nội dung phải là ngôn ngữ tự nhiên, dễ hiểu:

        {
          "healthAssessment": {
            "overallHealth": "GOOD|AVERAGE|NEEDS_IMPROVEMENT",
            "bodyType": "ECTOMORPH|MESOMORPH|ENDOMORPH", 
            "healthScore": số từ 0-100,
            "weightAnalysis": {
              "status": "UNDERWEIGHT|NORMAL|OVERWEIGHT|OBESE",
              "recommendation": "Mô tả bằng ngôn ngữ tự nhiên về tình trạng cân nặng và lời khuyên",
              "riskLevel": "LOW|MEDIUM|HIGH"
            },
            "bodyFatAnalysis": {
              "status": "LOW|NORMAL|HIGH|VERY_HIGH",
              "recommendation": "Phân tích tỷ lệ mỡ bằng ngôn ngữ tự nhiên",
              "healthRisks": ["Các rủi ro sức khỏe cụ thể"]
            },
            "muscleAnalysis": {
              "status": "LOW|NORMAL|HIGH",
              "recommendation": "Đánh giá khối lượng cơ bắp bằng ngôn ngữ tự nhiên",
              "potential": "Tiềm năng cải thiện"
            },
            "visceralFatAnalysis": {
              "status": "LOW|NORMAL|HIGH",
              "recommendation": "Phân tích mỡ nội tạng bằng ngôn ngữ tự nhiên",
              "healthRisks": ["Các rủi ro sức khỏe"]
            }
          },
          "comparisonWithStandards": {
            "ageGroup": "Nhóm tuổi",
            "genderGroup": "Giới tính",
            "percentile": "Phần trăm so với chuẩn",
            "ranking": "Xếp hạng so với nhóm tuổi/giới tính"
          },
          "healthIssues": {
            "immediate": ["Các vấn đề cần quan tâm ngay"],
            "longTerm": ["Các vấn đề dài hạn"],
            "recommendations": ["Lời khuyên cụ thể bằng ngôn ngữ tự nhiên"]
          }
        }

        Lưu ý: Tất cả các trường "recommendation" phải được viết bằng ngôn ngữ tự nhiên, như lời tư vấn của chuyên gia, không phải chỉ là dữ liệu khô khan.`;

        const gptResult = await this.callGpt(prompt);
        
        await this.saveCache(
          userId,
          'profile_analysis',
          inputData,
          gptResult.response,
          'gpt',
          true,
          gptResult.model,
          gptResult.tokensUsed,
          gptResult.costUsd,
        );

        return gptResult.response;
      }
    } catch (error) {
      this.logger.warn('GPT call failed, using fallback calculation');
    }

    // Fallback calculation
    const fallbackAnalysis = this.calculateFallbackProfileAnalysis(profile);
    
    await this.saveCache(
      userId,
      'profile_analysis',
      inputData,
      fallbackAnalysis,
      'fallback',
      false,
    );

    return fallbackAnalysis;
  }

  private calculateFallbackProfileAnalysis(profile: Profile): ProfileAnalysis {
    // Calculate BMI
    const heightM = profile.height / 100;
    const bmi = profile.weight / (heightM * heightM);

    // Determine weight status
    let weightStatus: 'UNDERWEIGHT' | 'NORMAL' | 'OVERWEIGHT' | 'OBESE';
    let weightRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    
    if (bmi < 18.5) {
      weightStatus = 'UNDERWEIGHT';
      weightRisk = 'MEDIUM';
    } else if (bmi < 25) {
      weightStatus = 'NORMAL';
      weightRisk = 'LOW';
    } else if (bmi < 30) {
      weightStatus = 'OVERWEIGHT';
      weightRisk = 'MEDIUM';
    } else {
      weightStatus = 'OBESE';
      weightRisk = 'HIGH';
    }

    // Determine body fat status
    let bodyFatStatus: 'LOW' | 'NORMAL' | 'HIGH' | 'VERY_HIGH';
    const bodyFat = profile.bodyFatPercentage || 0;
    
    if (profile.gender === 'Male') {
      if (bodyFat < 10) bodyFatStatus = 'LOW';
      else if (bodyFat < 20) bodyFatStatus = 'NORMAL';
      else if (bodyFat < 25) bodyFatStatus = 'HIGH';
      else bodyFatStatus = 'VERY_HIGH';
    } else {
      if (bodyFat < 16) bodyFatStatus = 'LOW';
      else if (bodyFat < 24) bodyFatStatus = 'NORMAL';
      else if (bodyFat < 31) bodyFatStatus = 'HIGH';
      else bodyFatStatus = 'VERY_HIGH';
    }

    // Determine muscle status
    let muscleStatus: 'LOW' | 'NORMAL' | 'HIGH';
    const muscleMass = profile.skeletalMuscleMass || 0;
    
    if (profile.gender === 'Male') {
      if (muscleMass < 35) muscleStatus = 'LOW';
      else if (muscleMass < 45) muscleStatus = 'NORMAL';
      else muscleStatus = 'HIGH';
    } else {
      if (muscleMass < 25) muscleStatus = 'LOW';
      else if (muscleMass < 35) muscleStatus = 'NORMAL';
      else muscleStatus = 'HIGH';
    }

    // Determine visceral fat status
    let visceralFatStatus: 'LOW' | 'NORMAL' | 'HIGH';
    const visceralFat = profile.visceralFatLevel || 0;
    
    if (visceralFat < 10) visceralFatStatus = 'LOW';
    else if (visceralFat < 15) visceralFatStatus = 'NORMAL';
    else visceralFatStatus = 'HIGH';

    // Calculate overall health score
    let healthScore = 100;
    if (weightStatus === 'OVERWEIGHT') healthScore -= 15;
    if (weightStatus === 'OBESE') healthScore -= 30;
    if (bodyFatStatus === 'HIGH') healthScore -= 10;
    if (bodyFatStatus === 'VERY_HIGH') healthScore -= 20;
    if (muscleStatus === 'LOW') healthScore -= 10;
    if (visceralFatStatus === 'HIGH') healthScore -= 15;

    return {
      healthAssessment: {
        overallHealth: healthScore >= 80 ? 'GOOD' : healthScore >= 60 ? 'AVERAGE' : 'NEEDS_IMPROVEMENT',
        bodyType: 'MESOMORPH', // Default, would need more complex logic
        healthScore,
        weightAnalysis: {
          status: weightStatus,
          recommendation: `BMI của bạn là ${bmi.toFixed(1)}, thuộc nhóm ${weightStatus}. ${this.getWeightRecommendation(weightStatus)}`,
          riskLevel: weightRisk,
        },
        bodyFatAnalysis: {
          status: bodyFatStatus,
          recommendation: `Tỷ lệ mỡ cơ thể ${bodyFat}% thuộc mức ${bodyFatStatus}. ${this.getBodyFatRecommendation(bodyFatStatus, profile.gender)}`,
          healthRisks: this.getBodyFatRisks(bodyFatStatus),
        },
        muscleAnalysis: {
          status: muscleStatus,
          recommendation: `Khối lượng cơ ${muscleMass}kg thuộc mức ${muscleStatus}. ${this.getMuscleRecommendation(muscleStatus)}`,
          potential: muscleStatus === 'LOW' ? 'Có thể cải thiện đáng kể' : 'Duy trì và phát triển thêm',
        },
        visceralFatAnalysis: {
          status: visceralFatStatus,
          recommendation: `Mỡ nội tạng mức ${visceralFat} thuộc nhóm ${visceralFatStatus}. ${this.getVisceralFatRecommendation(visceralFatStatus)}`,
          healthRisks: this.getVisceralFatRisks(visceralFatStatus),
        },
      },
      comparisonWithStandards: {
        ageGroup: `${Math.floor(profile.age / 10) * 10}-${Math.floor(profile.age / 10) * 10 + 9} tuổi`,
        genderGroup: profile.gender === 'Male' ? 'Nam' : 'Nữ',
        percentile: this.calculatePercentile(healthScore),
        ranking: this.getRanking(healthScore),
      },
      healthIssues: {
        immediate: this.getImmediateIssues(profile, weightStatus, bodyFatStatus, visceralFatStatus),
        longTerm: this.getLongTermIssues(profile, weightStatus, bodyFatStatus, visceralFatStatus),
        recommendations: this.getGeneralRecommendations(profile, weightStatus, bodyFatStatus, muscleStatus),
      },
    };
  }

  // === WATER INTAKE ANALYSIS ===
  async analyzeWaterIntake(userId: number, period: 'day' | 'week' = 'day'): Promise<any> {
    const requestType = `water_analysis_${period}`;

    // Check cache first
    const cached = await this.getCachedResponse(userId, requestType, { period });
    if (cached) {
      return cached.data;
    }

    // Get water intake data
    const waterRecords = await this.waterService.findAllByUserId(userId);
    
    // Filter records based on period
    let filteredRecords = waterRecords;
    const now = new Date();
    
    if (period === 'day') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filteredRecords = waterRecords.filter(record => record.datetime >= startOfDay);
    } else if (period === 'week') {
      const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredRecords = waterRecords.filter(record => record.datetime >= startOfWeek);
    }

    // Get user profile for context
    const profile = await this.profileService.findByUserId(userId);
    const dailyGoal = profile?.dailyWaterGoal || 2000;

    // Prepare data for AI analysis
    const waterData = {
      period,
      totalRecords: filteredRecords.length,
      records: filteredRecords.map(record => ({
        amount: Number(record.amount),
        datetime: record.datetime.toISOString(),
        hour: record.datetime.getHours()
      })),
      userProfile: {
        age: profile?.age,
        gender: profile?.gender,
        weight: profile?.weight,
        activityLevel: profile?.activityLevel,
        dailyWaterGoal: dailyGoal
      }
    };

    // Try OpenAI analysis first
    if (this.openai) {
      try {
        const prompt = `Bạn là chuyên gia dinh dưỡng và hydrat hóa. Hãy phân tích thói quen uống nước của người dùng và đưa ra lời khuyên cá nhân hóa.

Dữ liệu uống nước:
- Thời gian phân tích: ${period === 'day' ? 'Ngày hôm nay' : 'Tuần qua'}
- Tổng số bản ghi: ${filteredRecords.length}
- Chi tiết các lần uống: ${JSON.stringify(waterData.records)}
- Mục tiêu hàng ngày: ${dailyGoal}ml

Thông tin người dùng:
- Tuổi: ${profile?.age}
- Giới tính: ${profile?.gender}
- Cân nặng: ${profile?.weight}kg
- Mức độ hoạt động: ${profile?.activityLevel}

Hãy phân tích và trả về JSON với cấu trúc:
{
  "analysis": {
    "totalIntake": số (tổng ml đã uống),
    "averagePerDay": số (trung bình ml/ngày),
    "goalAchievement": số (phần trăm đạt mục tiêu, 0-100),
    "consistency": "EXCELLENT|GOOD|AVERAGE|POOR",
    "hydrationScore": số (điểm hydrat hóa 0-100)
  },
  "patterns": {
    "bestTime": "string (thời gian uống nhiều nhất, format HH:00)",
    "worstTime": "string (thời gian uống ít nhất, format HH:00)",
    "frequency": "string (mô tả tần suất uống)",
    "interval": số (khoảng cách trung bình giữa các lần uống, phút)
  },
  "recommendations": [
    {
      "type": "IMMEDIATE|SHORT_TERM|LONG_TERM",
      "priority": số (1-5),
      "title": "string",
      "description": "string",
      "actionable": boolean
    }
  ],
  "insights": ["string"] (danh sách insights thông minh)
}

Lưu ý: Tất cả nội dung phải bằng tiếng Việt, lời khuyên phải cụ thể và có thể thực hiện được.`;

        const gptResult = await this.callGpt(prompt);
        
        await this.saveCache(
          userId,
          requestType,
          { period },
          gptResult.response,
          'gpt',
          true,
          gptResult.model,
          gptResult.tokensUsed,
          gptResult.costUsd,
        );

        return gptResult.response;
      } catch (error) {
        this.logger.warn('GPT call failed for water analysis, using fallback calculation');
      }
    }

    // Fallback calculation
    const fallbackAnalysis = this.calculateFallbackWaterAnalysis(filteredRecords, period, dailyGoal);
    
    await this.saveCache(
      userId,
      requestType,
      { period },
      fallbackAnalysis,
      'fallback',
      false,
    );

    return fallbackAnalysis;
  }

  private calculateFallbackWaterAnalysis(records: any[], period: string, dailyGoal: number): any {
    const totalIntake = records.reduce((sum, record) => sum + Number(record.amount), 0);
    
    // Calculate actual days with data
    const uniqueDays = new Set();
    records.forEach(record => {
      const dayKey = record.datetime.toISOString().split('T')[0];
      uniqueDays.add(dayKey);
    });
    const actualDaysCount = Math.max(uniqueDays.size, 1);
    
    const averagePerDay = totalIntake / actualDaysCount;
    const goalAchievement = Math.min((averagePerDay / dailyGoal) * 100, 100);
    
    // Calculate patterns
    const hourlyIntake = new Array(24).fill(0);
    records.forEach(record => {
      const hour = new Date(record.datetime).getHours();
      hourlyIntake[hour] += Number(record.amount);
    });
    
    const maxHour = hourlyIntake.indexOf(Math.max(...hourlyIntake));
    const minHour = hourlyIntake.indexOf(Math.min(...hourlyIntake.filter(h => h > 0)));
    
    // Calculate average interval between drinks
    const sortedTimes = records.map(r => new Date(r.datetime).getTime()).sort((a, b) => a - b);
    let totalInterval = 0;
    for (let i = 1; i < sortedTimes.length; i++) {
      totalInterval += sortedTimes[i] - sortedTimes[i-1];
    }
    const averageInterval = sortedTimes.length > 1 ? Math.round(totalInterval / (sortedTimes.length - 1) / (1000 * 60)) : 0;
    
    // Determine consistency
    let consistency: string;
    if (goalAchievement >= 90) consistency = 'EXCELLENT';
    else if (goalAchievement >= 70) consistency = 'GOOD';
    else if (goalAchievement >= 50) consistency = 'AVERAGE';
    else consistency = 'POOR';
    
    const hydrationScore = Math.round(goalAchievement * 0.6 + (records.length > 0 ? 40 : 0));
    
    return {
      period,
      analysis: {
        totalIntake,
        averagePerDay: Math.round(averagePerDay),
        goalAchievement: Math.round(goalAchievement),
        consistency,
        hydrationScore
      },
      patterns: {
        bestTime: `${maxHour.toString().padStart(2, '0')}:00`,
        worstTime: minHour >= 0 ? `${minHour.toString().padStart(2, '0')}:00` : 'N/A',
        frequency: records.length > 0 ? `${Math.round(records.length / actualDaysCount)} lần/ngày` : 'Không có dữ liệu',
        interval: period === 'day' ? averageInterval : Math.round(averageInterval * actualDaysCount / 7)
      },
      recommendations: this.getWaterRecommendations(goalAchievement, consistency, records.length),
      insights: this.getWaterInsights(totalIntake, averagePerDay, dailyGoal, records.length, period)
    };
  }

  // === CACHE MANAGEMENT ===
  async refreshCache(userId: number, requestType?: string): Promise<void> {
    const whereClause: any = { userId };
    if (requestType) {
      whereClause.requestType = requestType;
    }

    const caches = await this.aiCacheRepository.find({ where: whereClause });
    
    for (const cache of caches) {
      cache.isExpired = true;
      await this.aiCacheRepository.save(cache);
    }
  }

  async getCacheStats(userId: number): Promise<any> {
    const stats = await this.aiCacheRepository
      .createQueryBuilder('cache')
      .select([
        'cache.requestType as requestType',
        'COUNT(*) as total',
        'SUM(CASE WHEN cache.isFromGpt = true THEN 1 ELSE 0 END) as gptCalls',
        'SUM(CASE WHEN cache.isFromGpt = false THEN 1 ELSE 0 END) as fallbackCalls',
        'AVG(cache.tokensUsed) as avgTokens',
        'SUM(cache.costUsd) as totalCost',
      ])
      .where('cache.userId = :userId', { userId })
      .groupBy('cache.requestType')
      .getRawMany();

    return {
      userId,
      cacheStats: stats,
      totalEntries: stats.reduce((sum, stat) => sum + parseInt(stat.total), 0),
      totalCost: stats.reduce((sum, stat) => sum + parseFloat(stat.totalCost || 0), 0),
    };
  }

  // === HELPER METHODS ===
  private getWeightRecommendation(status: string): string {
    switch (status) {
      case 'UNDERWEIGHT': return 'Nên tăng cân để đạt mức cân nặng lý tưởng.';
      case 'NORMAL': return 'Cân nặng ở mức tốt, hãy duy trì.';
      case 'OVERWEIGHT': return 'Nên giảm cân nhẹ để cải thiện sức khỏe.';
      case 'OBESE': return 'Cần giảm cân để giảm nguy cơ các bệnh lý.';
      default: return 'Cần đánh giá thêm.';
    }
  }

  private getBodyFatRecommendation(status: string, gender: string): string {
    switch (status) {
      case 'LOW': return gender === 'Male' ? 'Tỷ lệ mỡ thấp, cần chú ý dinh dưỡng.' : 'Tỷ lệ mỡ thấp, cần theo dõi sức khỏe.';
      case 'NORMAL': return 'Tỷ lệ mỡ cơ thể ở mức tốt.';
      case 'HIGH': return 'Nên giảm tỷ lệ mỡ cơ thể.';
      case 'VERY_HIGH': return 'Cần giảm mỡ cơ thể nghiêm túc.';
      default: return 'Cần đánh giá thêm.';
    }
  }

  private getMuscleRecommendation(status: string): string {
    switch (status) {
      case 'LOW': return 'Nên tăng cường tập luyện sức mạnh.';
      case 'NORMAL': return 'Khối lượng cơ ở mức tốt, tiếp tục duy trì.';
      case 'HIGH': return 'Khối lượng cơ tốt, có thể phát triển thêm.';
      default: return 'Cần đánh giá thêm.';
    }
  }

  private getVisceralFatRecommendation(status: string): string {
    switch (status) {
      case 'LOW': return 'Mỡ nội tạng ở mức tốt.';
      case 'NORMAL': return 'Mỡ nội tạng bình thường, cần duy trì.';
      case 'HIGH': return 'Cần giảm mỡ nội tạng để cải thiện sức khỏe.';
      default: return 'Cần đánh giá thêm.';
    }
  }

  private getBodyFatRisks(status: string): string[] {
    switch (status) {
      case 'VERY_HIGH': return ['Nguy cơ tim mạch cao', 'Nguy cơ tiểu đường', 'Viêm khớp'];
      case 'HIGH': return ['Nguy cơ tim mạch tăng', 'Rối loạn chuyển hóa'];
      case 'LOW': return ['Thiếu hormone', 'Suy giảm miễn dịch'];
      default: return [];
    }
  }

  private getVisceralFatRisks(status: string): string[] {
    switch (status) {
      case 'HIGH': return ['Nguy cơ tim mạch', 'Tiểu đường type 2', 'Gan nhiễm mỡ'];
      default: return [];
    }
  }

  private getImmediateIssues(profile: Profile, weightStatus: string, bodyFatStatus: string, visceralFatStatus: string): string[] {
    const issues: string[] = [];
    if (weightStatus === 'OBESE') issues.push('Cân nặng quá mức cần can thiệp');
    if (bodyFatStatus === 'VERY_HIGH') issues.push('Tỷ lệ mỡ cơ thể quá cao');
    if (visceralFatStatus === 'HIGH') issues.push('Mỡ nội tạng cao');
    return issues;
  }

  private getLongTermIssues(profile: Profile, weightStatus: string, bodyFatStatus: string, visceralFatStatus: string): string[] {
    const issues: string[] = [];
    if (weightStatus !== 'NORMAL') issues.push('Cần điều chỉnh cân nặng về mức lý tưởng');
    if (bodyFatStatus === 'HIGH' || bodyFatStatus === 'VERY_HIGH') issues.push('Cần giảm tỷ lệ mỡ cơ thể');
    return issues;
  }

  private getGeneralRecommendations(profile: Profile, weightStatus: string, bodyFatStatus: string, muscleStatus: string): string[] {
    const recommendations: string[] = [];
    recommendations.push('Duy trì chế độ ăn cân bằng');
    recommendations.push('Tập thể dục đều đặn');
    if (muscleStatus === 'LOW') recommendations.push('Tăng cường tập luyện sức mạnh');
    if (weightStatus !== 'NORMAL') recommendations.push('Điều chỉnh chế độ ăn phù hợp với mục tiêu cân nặng');
    return recommendations;
  }

  private calculatePercentile(healthScore: number): string {
    if (healthScore >= 90) return '90th percentile trở lên';
    if (healthScore >= 75) return '75th-90th percentile';
    if (healthScore >= 50) return '50th-75th percentile';
    if (healthScore >= 25) return '25th-50th percentile';
    return 'Dưới 25th percentile';
  }

  private getRanking(healthScore: number): 'BOTTOM_25%' | '25-50%' | '50-75%' | 'TOP_25%' {
    if (healthScore >= 75) return 'TOP_25%';
    if (healthScore >= 50) return '50-75%';
    if (healthScore >= 25) return '25-50%';
    return 'BOTTOM_25%';
  }

  private getWaterRecommendations(goalAchievement: number, consistency: string, recordsCount: number): any[] {
    const recommendations: any[] = [];

    if (goalAchievement < 50) {
      recommendations.push({
        type: 'IMMEDIATE',
        priority: 5,
        title: 'Tăng lượng nước uống',
        description: 'Bạn đang uống quá ít nước. Hãy uống thêm nước ngay bây giờ.',
        actionable: true
      });
    }

    if (consistency === 'POOR') {
      recommendations.push({
        type: 'SHORT_TERM',
        priority: 4,
        title: 'Tạo thói quen uống nước',
        description: 'Đặt báo thức mỗi 2 giờ để nhắc uống nước.',
        actionable: true
      });
    }

    if (recordsCount === 0) {
      recommendations.push({
        type: 'IMMEDIATE',
        priority: 5,
        title: 'Bắt đầu theo dõi',
        description: 'Hãy bắt đầu ghi lại việc uống nước để theo dõi tiến độ.',
        actionable: true
      });
    }

    return recommendations;
  }

  private getWaterInsights(totalIntake: number, averagePerDay: number, dailyGoal: number, recordsCount: number, period: string): string[] {
    const insights: string[] = [];

    if (totalIntake > 0) {
      insights.push(`Bạn đã uống ${totalIntake}ml nước trong ${period === 'day' ? 'ngày hôm nay' : 'tuần này'}`);
    }

    if (averagePerDay >= dailyGoal) {
      insights.push('Chúc mừng! Bạn đã đạt mục tiêu uống nước hàng ngày');
    } else {
      const shortage = dailyGoal - averagePerDay;
      insights.push(`Bạn cần uống thêm ${Math.round(shortage)}ml để đạt mục tiêu hàng ngày`);
    }

    if (recordsCount > 0) {
      insights.push(`Bạn đã ghi lại ${recordsCount} lần uống nước`);
    }

    return insights;
  }
}
