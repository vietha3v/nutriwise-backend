import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AiCache } from './entities/ai-cache.entity';
import { Profile } from '../profile/entities/profile.entity';
import { Meal } from '../meal/entities/meal.entity';
import { Exercise } from '../exercise/entities/exercise.entity';

import { FoodService } from '../food/food.service';

export interface ExerciseGoals {
  dailyCalories: number;
  weeklyWorkouts: number;
  workoutDuration: number;
  cardioMinutes: number;
  strengthTraining: boolean;
  flexibilityTraining: boolean;
  restDays: number;
}

export interface NutritionGoals {
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  waterLiters: number;
  mealFrequency: number;
}

export interface ProgressAnalysis {
  weightTrend: string;
  calorieDeficit: number;
  exerciseProgress: string;
  nutritionAdherence: number;
  recommendations: string[];
}

export interface WeeklyMealPlan {
  monday: any[];
  tuesday: any[];
  wednesday: any[];
  thursday: any[];
  friday: any[];
  saturday: any[];
  sunday: any[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface SmartMealSuggestion {
  mealName: string;
  ingredients: {
    foodId: number;
    foodName: string;
    quantity: number;
    unit: string;
  }[];
  nutritionInfo: {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  };
  cookingInstructions: string[];
  estimatedCookingTime: number;
  difficulty: string;
  tips: string[];
  whyThisMeal: string;
}

export interface SuggestedGoals {
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
    percentile: number;
    ranking: 'BOTTOM_25%' | '25-50%' | '50-75%' | 'TOP_25%';
  };
  healthIssues: {
    immediate: string[];
    longTerm: string[];
    recommendations: string[];
  };
  suggestedGoals: Array<{
    id: string;
    name: string;
    goalType: 'LOSE_WEIGHT' | 'MAINTAIN_WEIGHT' | 'GAIN_WEIGHT' | 'BUILD_MUSCLE' | 'IMPROVE_HEALTH';
    description: string;
    priority: number;
    estimatedDuration: number;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    successRate: number;
    targets: {
      weight?: number;
      bodyFat?: number;
      muscleMass?: number;
      visceralFat?: number;
    };
    nutritionPlan: {
      targetCalories: number;
      targetProtein: number;
      targetCarbs: number;
      targetFats: number;
      targetWater: number;
      mealTiming: string[];
      foodRecommendations: string[];
      restrictions: string[];
    };
    exercisePlan: {
      frequency: string;
      duration: string;
      intensity: string;
      exercises: string[];
      equipment: string[];
      progression: string;
    };
    reasoning: {
      healthFactors: string[];
      benefits: string[];
      risks: string[];
    };
    warnings: string[];
    notes: string[];
  }>;
  customGoalOption: {
    description: string;
    allowCustom: boolean;
    guidance: string;
  };
  summary: {
    totalSuggestions: number;
    primaryGoal: string;
    estimatedTimeline: string;
    overallSuccessRate: number;
  };
}

// === PROFILE MODULE INTERFACES ===
export interface IdealValues {
  idealWeight?: number;
  idealBodyFatPercentage?: number;
  idealMuscleMass?: number;
  targetCalories?: number;
  recommendedMacros?: {
    protein: number;
    carbs: number;
    fats: number;
  };
  personalizedRecommendations?: string[];
}

export interface HealthAssessment {
  healthAssessment?: string;
  healthScore?: number;
  riskFactors?: string[];
  recommendations?: string[];
}

export interface TrendAnalysis {
  trendAnalysis?: {
    weight?: string;
    bodyFat?: string;
    muscleMass?: string;
    water?: string;
  };
  prediction?: {
    nextMonth?: object;
    nextQuarter?: object;
  };
  recommendations?: string[];
  progressReport?: {
    summary: string;
    achievements: string[];
    challenges: string[];
  };
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openai: any;
  private readonly aiConfig: {
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
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(Meal)
    private mealRepository: Repository<Meal>,
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,

    private configService: ConfigService,
    private foodService: FoodService,
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

    // Cache expires based on configuration
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
  }

  private async callGpt(prompt: string): Promise<any> {
    if (!this.openai) {
      throw new Error('OpenAI not initialized');
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: this.aiConfig.model,
        messages: [
          {
            role: 'system',
            content: this.aiConfig.systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: this.aiConfig.temperature,
        max_tokens: this.aiConfig.maxTokens,
      });

      const response = completion.choices[0]?.message?.content;
      const usage = completion.usage;

      // Calculate cost (approximate for GPT-4o)
      const costPer1kTokens = 0.005; // USD per 1k tokens for GPT-4o
      const costUsd = (usage.total_tokens / 1000) * costPer1kTokens;

      return {
        response: JSON.parse(response),
        tokensUsed: usage.total_tokens,
        costUsd,
        model: this.aiConfig.model,
      };
    } catch (error) {
      this.logger.error('GPT API call failed:', error);
      throw error;
    }
  }

  async calculateExerciseGoals(userId: number, forceRefresh: boolean = false): Promise<ExerciseGoals> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
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
    };

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = await this.getCachedResponse(userId, 'exercise_goals', inputData);
      if (cached) {
        return cached.data;
      }
    }

    try {
      if (this.openai) {
        const prompt = `Tính toán mục tiêu tập luyện cá nhân hóa cho một người ${profile.age} tuổi, giới tính ${profile.gender} với:
        - Cân nặng: ${profile.weight}kg
        - Chiều cao: ${profile.height}cm
        - Mức độ hoạt động: ${profile.activityLevel}
        - Mục tiêu: ${profile.goalType}
        
        Trả về một đối tượng JSON với:
        {
          "dailyCalories": số (calo mỗi ngày),
          "weeklyWorkouts": số (số buổi tập mỗi tuần),
          "workoutDuration": số (thời gian tập mỗi buổi, tính bằng phút),
          "cardioMinutes": số (thời gian cardio mỗi buổi, tính bằng phút),
          "strengthTraining": boolean (có tập luyện sức mạnh không),
          "flexibilityTraining": boolean (có tập luyện linh hoạt không),
          "restDays": số (số ngày nghỉ mỗi tuần)
        }`;

        const gptResult = await this.callGpt(prompt);
        
        await this.saveCache(
          userId,
          'exercise_goals',
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
    const fallbackGoals = this.calculateFallbackExerciseGoals(profile);
    
    await this.saveCache(
      userId,
      'exercise_goals',
      inputData,
      fallbackGoals,
      'fallback',
      false,
    );

    return fallbackGoals;
  }

  async calculateNutritionGoals(userId: number, forceRefresh: boolean = false): Promise<NutritionGoals> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
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
    };

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = await this.getCachedResponse(userId, 'nutrition_goals', inputData);
      if (cached) {
        return cached.data;
      }
    }

    try {
      if (this.openai) {
        const prompt = `Tính toán mục tiêu dinh dưỡng cá nhân hóa cho một người ${profile.age} tuổi, giới tính ${profile.gender} với:
        - Cân nặng: ${profile.weight}kg
        - Chiều cao: ${profile.height}cm
        - Mức độ hoạt động: ${profile.activityLevel}
        - Mục tiêu: ${profile.goalType}
        
        Trả về một đối tượng JSON với:
        {
          "dailyCalories": số (calo mỗi ngày),
          "proteinGrams": số (gram protein mỗi ngày),
          "carbsGrams": số (gram carbohydrate mỗi ngày),
          "fatGrams": số (gram chất béo mỗi ngày),
          "fiberGrams": số (gram chất xơ mỗi ngày),
          "waterLiters": số (lít nước mỗi ngày),
          "mealFrequency": số (số bữa ăn mỗi ngày)
        }`;

        const gptResult = await this.callGpt(prompt);
        
        await this.saveCache(
          userId,
          'nutrition_goals',
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
    const fallbackGoals = this.calculateFallbackNutritionGoals(profile);
    
    await this.saveCache(
      userId,
      'nutrition_goals',
      inputData,
      fallbackGoals,
      'fallback',
      false,
    );

    return fallbackGoals;
  }

  async analyzeProgress(userId: number, forceRefresh: boolean = false): Promise<ProgressAnalysis> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) {
      throw new Error('Không tìm thấy hồ sơ người dùng');
    }

    // Get recent data
    const recentMeals = await this.mealRepository.find({
      where: { userId },
      order: { date: 'DESC' },
      take: 30,
    });

    const recentExercises = await this.exerciseRepository.find({
      where: { userId },
      order: { date: 'DESC' },
      take: 30,
    });

    const inputData = {
      profile,
      recentMeals: recentMeals.length,
      recentExercises: recentExercises.length,
      currentWeight: profile.weight,
      goalWeight: profile.goalWeight,
    };

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = await this.getCachedResponse(userId, 'progress_analysis', inputData);
      if (cached) {
        return cached.data;
      }
    }

    try {
      if (this.openai) {
        const prompt = `Phân tích tiến độ cho người dùng với:
        - Cân nặng hiện tại: ${profile.weight}kg
        - Cân nặng mục tiêu: ${profile.goalWeight}kg
        - Bữa ăn gần đây: ${recentMeals.length} bản ghi
        - Tập luyện gần đây: ${recentExercises.length} bản ghi
        - Mục tiêu: ${profile.goalType}
        
        Trả về một đối tượng JSON với:
        {
          "weightTrend": string (xu hướng cân nặng: "tăng", "giảm", "duy trì"),
          "calorieDeficit": số (calo thiếu hụt),
          "exerciseProgress": string (tiến độ tập luyện: "tuyệt vời", "tốt", "cần cải thiện"),
          "nutritionAdherence": số (0-100, mức độ tuân thủ dinh dưỡng),
          "recommendations": [string] (danh sách khuyến nghị bằng tiếng Việt)
        }`;

        const gptResult = await this.callGpt(prompt);
        
        await this.saveCache(
          userId,
          'progress_analysis',
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
    const fallbackAnalysis = this.calculateFallbackProgressAnalysis(profile, recentMeals, recentExercises);
    
    await this.saveCache(
      userId,
      'progress_analysis',
      inputData,
      fallbackAnalysis,
      'fallback',
      false,
    );

    return fallbackAnalysis;
  }

  async generateWeeklyMealPlan(userId: number, forceRefresh: boolean = false): Promise<WeeklyMealPlan> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
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
      dietaryRestrictions: profile.allergies,
    };

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = await this.getCachedResponse(userId, 'meal_plan', inputData);
      if (cached) {
        return cached.data;
      }
    }

    try {
      if (this.openai) {
        const prompt = `Tạo kế hoạch ăn uống hàng tuần cho một người ${profile.age} tuổi, giới tính ${profile.gender} với:
        - Cân nặng: ${profile.weight}kg
        - Chiều cao: ${profile.height}cm
        - Mức độ hoạt động: ${profile.activityLevel}
        - Mục tiêu: ${profile.goalType}
        - Hạn chế ăn uống: ${profile.allergies || 'Không có'}
        
        Trả về một đối tượng JSON với:
        {
          "monday": [{"name": string (tên món ăn), "calories": number, "protein": number, "carbs": number, "fat": number}],
          "tuesday": [...],
          "wednesday": [...],
          "thursday": [...],
          "friday": [...],
          "saturday": [...],
          "sunday": [...],
          "totalCalories": number,
          "totalProtein": number,
          "totalCarbs": number,
          "totalFat": number
        }`;

        const gptResult = await this.callGpt(prompt);
        
        await this.saveCache(
          userId,
          'meal_plan',
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
    const fallbackMealPlan = this.generateFallbackMealPlan(profile);
    
    await this.saveCache(
      userId,
      'meal_plan',
      inputData,
      fallbackMealPlan,
      'fallback',
      false,
    );

    return fallbackMealPlan;
  }

  async analyzeProfile(userId: number, forceRefresh: boolean = false): Promise<any> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
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

    // Fallback calculation - chỉ phân tích, không gợi ý mục tiêu
    const fallbackAnalysis = this.generateFallbackProfileAnalysis(profile);
    
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

  async getSuggestedGoals(userId: number, forceRefresh: boolean = false): Promise<SuggestedGoals> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
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
      const cached = await this.getCachedResponse(userId, 'suggested_goals', inputData);
      if (cached) {
        return cached.data;
      }
    }

    try {
      if (this.openai) {
        const prompt = `Phân tích hồ sơ sức khỏe và đưa ra gợi ý mục tiêu cho người dùng:
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
        
        Trả về một đối tượng JSON với cấu trúc SuggestedGoals như đã định nghĩa, bao gồm:
        - healthAssessment: Đánh giá tổng quan sức khỏe
        - comparisonWithStandards: So sánh với tiêu chuẩn
        - healthIssues: Các vấn đề sức khỏe cần lưu ý
        - suggestedGoals: Danh sách gợi ý mục tiêu (3-5 mục tiêu)
        - customGoalOption: Tùy chọn tạo mục tiêu tùy chỉnh
        - summary: Tóm tắt tổng quan`;

        const gptResult = await this.callGpt(prompt);
        
        await this.saveCache(
          userId,
          'suggested_goals',
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
    const fallbackGoals = this.generateFallbackSuggestedGoals(profile);
    
    await this.saveCache(
      userId,
      'suggested_goals',
      inputData,
      fallbackGoals,
      'fallback',
      false,
    );

    return fallbackGoals;
  }

  async generateSmartMealSuggestion(
    userId: number,
    mealType: string,
    date: Date,
    forceRefresh: boolean = false,
  ): Promise<SmartMealSuggestion> {
    const cacheKey = `smart_meal_${userId}_${mealType}_${date.toISOString().split('T')[0]}`;
    
    if (!forceRefresh) {
      const cached = await this.getCachedResponse(userId, cacheKey, { mealType, date });
      if (cached) return cached;
    }

    try {
      const profile = await this.profileRepository.findOne({ where: { userId } });
      if (!profile) {
        throw new Error('Profile not found');
      }

      const foodData = await this.foodService.getDataForAI(userId, date);
      const availableFoods = foodData.availableFoods;
      const userPreferences = foodData.userPreferences;
      
      const prompt = `
          Generate a smart meal suggestion for ${mealType} based on:
          - User profile: ${JSON.stringify(profile)}
          - Available foods: ${JSON.stringify(availableFoods)}
          - User preferences: ${JSON.stringify(userPreferences)}
          
          Return a JSON object with:
          - mealName: string (in Vietnamese)
          - ingredients: array of {foodId, foodName, quantity, unit}
          - nutritionInfo: {totalCalories, totalProtein, totalCarbs, totalFat}
          - cookingInstructions: array of strings (in Vietnamese)
          - estimatedCookingTime: number (minutes)
          - difficulty: string (Easy/Medium/Hard)
          - tips: array of strings (in Vietnamese)
          - whyThisMeal: string (explanation in Vietnamese)
        `;

      const response = await this.callGpt(prompt);
      const result = JSON.parse(response.choices[0].message.content);

      await this.saveCache(userId, cacheKey, { mealType, date }, result, 'gpt', true, response.model, response.usage?.total_tokens, response.usage?.cost);
      
      return result;
    } catch (error) {
      this.logger.error('Error generating smart meal suggestion:', error);
      
      const profile = await this.profileRepository.findOne({ where: { userId } });
      const foodData = await this.foodService.getDataForAI(userId, date);
      const availableFoods = foodData.availableFoods;
      const userPreferences = foodData.userPreferences;
      
      const fallback = this.generateFallbackMealSuggestion(profile, availableFoods, userPreferences, mealType);
      await this.saveCache(userId, cacheKey, { mealType, date }, fallback, 'fallback');
      
      return fallback;
    }
  }

  // === PROFILE MODULE METHODS ===

  async calculateIdealValues(
    userId: number,
    params: {
      age?: number;
      gender?: 'Male' | 'Female';
      height?: number;
      currentWeight?: number;
      currentBodyFatPercentage?: number;
      currentMuscleMass?: number;
      goalType?: any;
      personalGoals?: string[];
      activityLevel?: any;
      medicalConditions?: string[];
      healthIssues?: string[];
    },
    forceRefresh: boolean = false
  ): Promise<IdealValues> {
    const cacheKey = `ideal_values_${userId}`;
    
    if (!forceRefresh) {
      const cached = await this.getCachedResponse(userId, cacheKey, params);
      if (cached) return cached;
    }

    const profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) {
      throw new Error('Profile not found');
    }

    // Ưu tiên sử dụng OpenAI nếu có
    if (this.openai) {
      try {
        const prompt = `
          Calculate ideal body values based on:
          - Age: ${params.age || profile.age}
          - Gender: ${params.gender || profile.gender}
          - Height: ${params.height || profile.height} cm
          - Current Weight: ${params.currentWeight || profile.weight} kg
          - Current Body Fat: ${params.currentBodyFatPercentage || profile.bodyFatPercentage}%
          - Current Muscle Mass: ${params.currentMuscleMass || profile.skeletalMuscleMass} kg
          - Goal Type: ${params.goalType || profile.goalType}
          - Personal Goals: ${params.personalGoals?.join(', ') || profile.personalGoals?.join(', ')}
          - Activity Level: ${params.activityLevel || profile.activityLevel}
          - Medical Conditions: ${params.medicalConditions?.join(', ') || profile.medicalConditions?.join(', ')}
          - Health Issues: ${params.healthIssues?.join(', ') || profile.healthIssues?.join(', ')}

          Return a JSON object with:
          - idealWeight: number (kg)
          - idealBodyFatPercentage: number (%)
          - idealMuscleMass: number (kg)
          - targetCalories: number (kcal/day)
          - recommendedMacros: {protein: number, carbs: number, fats: number} (grams)
          - personalizedRecommendations: array of strings (in Vietnamese)
        `;

        const response = await this.callGpt(prompt);
        const result = JSON.parse(response.choices[0].message.content);

        await this.saveCache(userId, cacheKey, params, result, 'gpt', true, response.model, response.usage?.total_tokens, response.usage?.cost);
        
        return result;
      } catch (error) {
        this.logger.error('OpenAI call failed for ideal values, using fallback:', error);
      }
    }

    // Fallback calculation khi không có OpenAI hoặc lỗi
    const fallback = this.calculateFallbackIdealValues(profile, params);
    await this.saveCache(userId, cacheKey, params, fallback, 'fallback');
    
    return fallback;
  }

  async assessHealthStatus(
    userId: number,
    params: {
      profile?: Profile;
      profileHistory?: Profile[];
      age?: number;
      gender?: 'Male' | 'Female';
      goalType?: any;
      personalGoals?: string[];
      medicalConditions?: string[];
      healthIssues?: string[];
    },
    forceRefresh: boolean = false
  ): Promise<HealthAssessment> {
    const cacheKey = `health_assessment_${userId}`;
    
    if (!forceRefresh) {
      const cached = await this.getCachedResponse(userId, cacheKey, params);
      if (cached) return cached;
    }

    const profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) {
      throw new Error('Profile not found');
    }

    const profileHistory = await this.profileRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 10
    });

    // Ưu tiên sử dụng OpenAI nếu có
    if (this.openai) {
      try {
        const prompt = `
          Assess health status based on:
          - Current Profile: ${JSON.stringify(profile)}
          - Profile History: ${JSON.stringify(profileHistory)}
          - Age: ${params.age || profile.age}
          - Gender: ${params.gender || profile.gender}
          - Goal Type: ${params.goalType || profile.goalType}
          - Personal Goals: ${params.personalGoals?.join(', ') || profile.personalGoals?.join(', ')}
          - Medical Conditions: ${params.medicalConditions?.join(', ') || profile.medicalConditions?.join(', ')}
          - Health Issues: ${params.healthIssues?.join(', ') || profile.healthIssues?.join(', ')}

          Return a JSON object with:
          - healthAssessment: string (Perfect/Good/Average/Needs Improvement)
          - healthScore: number (0-100)
          - riskFactors: array of strings (in Vietnamese)
          - recommendations: array of strings (in Vietnamese)
        `;

        const response = await this.callGpt(prompt);
        const result = JSON.parse(response.choices[0].message.content);

        await this.saveCache(userId, cacheKey, params, result, 'gpt', true, response.model, response.usage?.total_tokens, response.usage?.cost);
        
        return result;
      } catch (error) {
        this.logger.error('OpenAI call failed for health assessment, using fallback:', error);
      }
    }

    // Fallback calculation khi không có OpenAI hoặc lỗi
    const fallback = this.calculateFallbackHealthAssessment(profile, params);
    await this.saveCache(userId, cacheKey, params, fallback, 'fallback');
    
    return fallback;
  }

  async analyzeTrends(
    userId: number,
    params: {
      profiles?: Profile[];
      period?: string;
      targetMetrics?: string[];
    },
    forceRefresh: boolean = false
  ): Promise<TrendAnalysis> {
    const cacheKey = `trend_analysis_${userId}_${params.period || 'all'}`;
    
    if (!forceRefresh) {
      const cached = await this.getCachedResponse(userId, cacheKey, params);
      if (cached) return cached;
    }

    const profiles = await this.profileRepository.find({
      where: { userId },
      order: { createdAt: 'ASC' }
    });

    if (profiles.length < 2) {
      throw new Error('Insufficient profile history for trend analysis');
    }

    // Ưu tiên sử dụng OpenAI nếu có
    if (this.openai) {
      try {
        const prompt = `
          Analyze trends based on profile history:
          - Profiles: ${JSON.stringify(profiles)}
          - Period: ${params.period || 'all'}
          - Target Metrics: ${params.targetMetrics?.join(', ') || 'weight,bodyFat,muscleMass,water'}

          Return a JSON object with:
          - trendAnalysis: {weight: string, bodyFat: string, muscleMass: string, water: string} (in Vietnamese)
          - prediction: {nextMonth: object, nextQuarter: object}
          - recommendations: array of strings (in Vietnamese)
          - progressReport: {summary: string, achievements: array, challenges: array} (all in Vietnamese)
        `;

        const response = await this.callGpt(prompt);
        const result = JSON.parse(response.choices[0].message.content);

        await this.saveCache(userId, cacheKey, params, result, 'gpt', true, response.model, response.usage?.total_tokens, response.usage?.cost);
        
        return result;
      } catch (error) {
        this.logger.error('OpenAI call failed for trend analysis, using fallback:', error);
      }
    }

    // Fallback calculation khi không có OpenAI hoặc lỗi
    const fallback = this.calculateFallbackTrendAnalysis(profiles, params);
    await this.saveCache(userId, cacheKey, params, fallback, 'fallback');
    
    return fallback;
  }

  async refreshCache(userId: number, requestType?: string): Promise<void> {
    const whereClause: any = { userId, isExpired: false };
    if (requestType) {
      whereClause.requestType = requestType;
    }

    const caches = await this.aiCacheRepository.find({ where: whereClause });
    
    for (const cache of caches) {
      cache.isExpired = true;
      await this.aiCacheRepository.save(cache);
    }

    this.logger.log(`Refreshed ${caches.length} cache entries for user ${userId}`);
  }

  async getCacheStats(userId: number): Promise<any> {
    const stats = await this.aiCacheRepository
      .createQueryBuilder('cache')
      .select([
        'cache.requestType',
        'COUNT(*) as total',
        'SUM(CASE WHEN cache.isFromGpt = true THEN 1 ELSE 0 END) as gpt_count',
        'SUM(CASE WHEN cache.source = :fallback THEN 1 ELSE 0 END) as fallback_count',
        'SUM(cache.costUsd) as total_cost',
        'SUM(cache.tokensUsed) as total_tokens'
      ])
      .where('cache.userId = :userId', { userId })
      .andWhere('cache.isExpired = false')
      .setParameter('fallback', 'fallback')
      .groupBy('cache.requestType')
      .getRawMany();

    return stats;
  }

  // Fallback calculation methods
  private calculateFallbackExerciseGoals(profile: any): ExerciseGoals {
    const bmr = this.calculateBMR(profile);
    const tdee = this.calculateTDEE(bmr, profile.activityLevel);
    
    let dailyCalories = tdee;
    if (profile.goalType === 'weight_loss') {
      dailyCalories = tdee - 500;
    } else if (profile.goalType === 'muscle_gain') {
      dailyCalories = tdee + 300;
    }

    return {
      dailyCalories: Math.round(dailyCalories),
      weeklyWorkouts: 4,
      workoutDuration: 45,
      cardioMinutes: 20,
      strengthTraining: true,
      flexibilityTraining: true,
      restDays: 3,
    };
  }

  private calculateFallbackNutritionGoals(profile: any): NutritionGoals {
    const bmr = this.calculateBMR(profile);
    const tdee = this.calculateTDEE(bmr, profile.activityLevel);
    
    let dailyCalories = tdee;
    if (profile.goalType === 'weight_loss') {
      dailyCalories = tdee - 500;
    } else if (profile.goalType === 'muscle_gain') {
      dailyCalories = tdee + 300;
    }

    const proteinGrams = profile.weight * 2.2; // 1g per lb
    const fatGrams = (dailyCalories * 0.25) / 9; // 25% of calories
    const carbsGrams = (dailyCalories - (proteinGrams * 4) - (fatGrams * 9)) / 4;

    return {
      dailyCalories: Math.round(dailyCalories),
      proteinGrams: Math.round(proteinGrams),
      carbsGrams: Math.round(carbsGrams),
      fatGrams: Math.round(fatGrams),
      fiberGrams: 25,
      waterLiters: profile.weight * 0.033, // 33ml per kg
      mealFrequency: 5,
    };
  }

  private calculateFallbackProgressAnalysis(profile: any, meals: any[], exercises: any[]): ProgressAnalysis {
    const weightDiff = profile.goalWeight - profile.weight;
    const weightTrend = weightDiff > 0 ? 'tăng' : weightDiff < 0 ? 'giảm' : 'duy trì';
    
    const avgMealsPerWeek = meals.length / 4; // Assuming 4 weeks of data
    const avgExercisesPerWeek = exercises.length / 4;
    
    const nutritionAdherence = Math.min(100, (avgMealsPerWeek / 21) * 100); // 3 meals per day
    const exerciseProgress = avgExercisesPerWeek >= 4 ? 'tuyệt vời' : avgExercisesPerWeek >= 2 ? 'tốt' : 'cần cải thiện';

    return {
      weightTrend,
      calorieDeficit: weightDiff < 0 ? Math.abs(weightDiff) * 7700 : 0, // 7700 calories per kg
      exerciseProgress,
      nutritionAdherence: Math.round(nutritionAdherence),
      recommendations: [
        'Theo dõi bữa ăn một cách nhất quán',
        'Đặt mục tiêu 4-5 buổi tập mỗi tuần',
        'Uống đủ nước trong ngày',
        'Ngủ đủ giấc để phục hồi'
      ],
    };
  }

  private generateFallbackMealPlan(profile: any): WeeklyMealPlan {
    const sampleMeals = [
      { name: 'Cháo yến mạch với quả mọng', calories: 300, protein: 12, carbs: 45, fat: 8 },
      { name: 'Salad gà nướng', calories: 350, protein: 35, carbs: 15, fat: 12 },
      { name: 'Cá hồi nướng với rau xanh', calories: 450, protein: 28, carbs: 35, fat: 22 },
      { name: 'Sữa chua Hy Lạp với hạt', calories: 200, protein: 15, carbs: 12, fat: 10 },
      { name: 'Bánh mì gà tây', calories: 400, protein: 25, carbs: 40, fat: 15 },
    ];

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const mealPlan: any = {};

    days.forEach(day => {
      mealPlan[day] = sampleMeals.slice(0, 3); // 3 meals per day
    });

    const totalCalories = 1050; // 3 meals * 350 avg calories
    const totalProtein = 75; // 3 meals * 25 avg protein
    const totalCarbs = 90; // 3 meals * 30 avg carbs
    const totalFat = 45; // 3 meals * 15 avg fat

    return {
      ...mealPlan,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
    };
  }

  private generateFallbackMealSuggestion(
    profile: any,
    availableFoods: any[],
    userPreferences: any[],
    mealType: string,
  ): SmartMealSuggestion {
    // Logic đơn giản để tạo gợi ý dự phòng
    const mealNames = {
      breakfast: 'Cháo yến mạch với trái cây',
      lunch: 'Cơm gà rau củ',
      dinner: 'Cá hồi nướng với rau xanh',
      snack: 'Sữa chua với hạt',
    };

    const selectedFoods = availableFoods.slice(0, 3); // Chọn 3 thực phẩm đầu tiên

    return {
      mealName: mealNames[mealType] || 'Bữa ăn dinh dưỡng',
      ingredients: selectedFoods.map(food => ({
        foodId: food.foodId,
        foodName: food.foodName,
        quantity: food.quantity,
        unit: food.unit,
      })),
      nutritionInfo: {
        totalCalories: 400,
        totalProtein: 25,
        totalCarbs: 45,
        totalFat: 15,
      },
      cookingInstructions: [
        'Chuẩn bị nguyên liệu',
        'Nấu theo hướng dẫn',
        'Trình bày đẹp mắt',
      ],
      estimatedCookingTime: 30,
      difficulty: 'dễ',
      tips: [
        'Có thể điều chỉnh gia vị theo khẩu vị',
        'Nên ăn khi còn nóng',
      ],
      whyThisMeal: 'Món ăn này phù hợp với mục tiêu dinh dưỡng và sở thích của bạn',
    };
  }

  private calculateBMR(profile: any): number {
    // Mifflin-St Jeor Equation
    const { age, gender, weight, height } = profile;
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    bmr = gender === 'male' ? bmr + 5 : bmr - 161;
    return bmr;
  }

  private calculateTDEE(bmr: number, activityLevel: string): number {
    const multipliers = {
      SEDENTARY: 1.2,
      LIGHTLY_ACTIVE: 1.375,
      MODERATELY_ACTIVE: 1.55,
      VERY_ACTIVE: 1.725,
      EXTREMELY_ACTIVE: 1.9,
    };
    
    return Math.round(bmr * (multipliers[activityLevel] || 1.2));
  }

  // === PROFILE MODULE FALLBACK METHODS ===

  private calculateFallbackIdealValues(profile: any, params: any): IdealValues {
    const bmr = this.calculateBMR(profile);
    const tdee = this.calculateTDEE(bmr, profile.activityLevel);
    
    // Calculate ideal weight based on height and gender
    const heightInMeters = profile.height / 100;
    let idealWeight = 0;
    
    if (profile.gender === 'Male') {
      idealWeight = (heightInMeters * 100 - 100) * 0.9;
    } else {
      idealWeight = (heightInMeters * 100 - 100) * 0.9 * 0.9;
    }
    
    // Calculate ideal body fat percentage
    const idealBodyFatPercentage = profile.gender === 'Male' ? 15 : 22;
    
    // Calculate ideal muscle mass
    const idealMuscleMass = idealWeight * (1 - idealBodyFatPercentage / 100) * 0.4;
    
    // Calculate target calories based on goal
    let targetCalories = tdee;
    if (profile.goalType === 'LOSE_WEIGHT') {
      targetCalories = tdee - 500;
    } else if (profile.goalType === 'GAIN_WEIGHT' || profile.goalType === 'BUILD_MUSCLE') {
      targetCalories = tdee + 300;
    }
    
    // Calculate recommended macros
    const proteinGrams = profile.weight * 2.2; // 1g per lb
    const fatGrams = (targetCalories * 0.25) / 9; // 25% of calories
    const carbsGrams = (targetCalories - (proteinGrams * 4) - (fatGrams * 9)) / 4;
    
    return {
      idealWeight: Math.round(idealWeight * 10) / 10,
      idealBodyFatPercentage,
      idealMuscleMass: Math.round(idealMuscleMass * 10) / 10,
      targetCalories: Math.round(targetCalories),
      recommendedMacros: {
        protein: Math.round(proteinGrams),
        carbs: Math.round(carbsGrams),
        fats: Math.round(fatGrams)
      },
      personalizedRecommendations: [
        'Tập trung vào bài tập cardio để giảm mỡ',
        'Tăng cường protein để duy trì cơ bắp',
        'Theo dõi chỉ số cơ thể định kỳ',
        'Duy trì chế độ ăn cân bằng'
      ]
    };
  }

  private calculateFallbackHealthAssessment(profile: any, params: any): HealthAssessment {
    let healthScore = 70; // Base score
    const riskFactors: string[] = [];
    const recommendations: string[] = [];
    
    // Assess BMI
    const bmi = profile.weight / Math.pow(profile.height / 100, 2);
    if (bmi < 18.5) {
      healthScore -= 10;
      riskFactors.push('Thiếu cân');
      recommendations.push('Tăng cường dinh dưỡng');
    } else if (bmi > 25) {
      healthScore -= 15;
      riskFactors.push('Thừa cân');
      recommendations.push('Giảm calo và tăng vận động');
    }
    
    // Assess body fat
    if (profile.bodyFatPercentage) {
      if (profile.gender === 'Male' && profile.bodyFatPercentage > 25) {
        healthScore -= 10;
        riskFactors.push('Tỷ lệ mỡ cao');
        recommendations.push('Tập cardio để giảm mỡ');
      } else if (profile.gender === 'Female' && profile.bodyFatPercentage > 32) {
        healthScore -= 10;
        riskFactors.push('Tỷ lệ mỡ cao');
        recommendations.push('Tập cardio để giảm mỡ');
      }
    }
    
    // Assess visceral fat
    if (profile.visceralFatLevel && profile.visceralFatLevel > 10) {
      healthScore -= 15;
      riskFactors.push('Mỡ nội tạng cao');
      recommendations.push('Tập trung giảm mỡ bụng');
    }
    
    // Medical conditions
    if (profile.medicalConditions && profile.medicalConditions.length > 0) {
      healthScore -= 10;
      riskFactors.push('Có bệnh nền');
      recommendations.push('Tham khảo ý kiến bác sĩ');
    }
    
    // Determine health assessment
    let healthAssessment = 'Average';
    if (healthScore >= 85) {
      healthAssessment = 'Perfect';
    } else if (healthScore >= 70) {
      healthAssessment = 'Good';
    } else if (healthScore >= 50) {
      healthAssessment = 'Average';
    } else {
      healthAssessment = 'Needs Improvement';
    }
    
    return {
      healthAssessment,
      healthScore: Math.max(0, Math.min(100, healthScore)),
      riskFactors,
      recommendations: recommendations.length > 0 ? recommendations : [
        'Duy trì chế độ ăn cân bằng',
        'Tập thể dục đều đặn',
        'Ngủ đủ giấc',
        'Uống đủ nước'
      ]
    };
  }

  private generateFallbackSuggestedGoals(profile: any): SuggestedGoals {
    // Tính BMI
    const bmi = profile.weight / Math.pow(profile.height / 100, 2);
    
    // Đánh giá sức khỏe cơ bản
    let overallHealth: 'GOOD' | 'AVERAGE' | 'NEEDS_IMPROVEMENT' = 'AVERAGE';
    let healthScore = 70;
    
    if (bmi >= 18.5 && bmi <= 24.9) {
      healthScore += 10;
      overallHealth = 'GOOD';
    } else if (bmi < 18.5 || bmi > 29.9) {
      healthScore -= 15;
      overallHealth = 'NEEDS_IMPROVEMENT';
    }
    
    // Đánh giá tỷ lệ mỡ
    let bodyFatStatus = 'NORMAL';
    if (profile.gender === 'Male') {
      if (profile.bodyFatPercentage > 25) {
        bodyFatStatus = 'HIGH';
        healthScore -= 10;
      } else if (profile.bodyFatPercentage < 10) {
        bodyFatStatus = 'LOW';
        healthScore -= 5;
      }
    } else {
      if (profile.bodyFatPercentage > 32) {
        bodyFatStatus = 'HIGH';
        healthScore -= 10;
      } else if (profile.bodyFatPercentage < 18) {
        bodyFatStatus = 'LOW';
        healthScore -= 5;
      }
    }
    
    // Tạo gợi ý mục tiêu cơ bản
    const suggestedGoals: SuggestedGoals['suggestedGoals'] = [];
    
    if (bmi > 25) {
      suggestedGoals.push({
        id: 'weight_loss_1',
        name: 'Giảm cân an toàn',
        goalType: 'LOSE_WEIGHT',
        description: 'Giảm cân từ từ và an toàn để cải thiện sức khỏe',
        priority: 1,
        estimatedDuration: 12,
        difficulty: 'MEDIUM',
        successRate: 85,
        targets: {
          weight: profile.weight * 0.9, // Giảm 10%
          bodyFat: Math.max(profile.bodyFatPercentage - 5, 15),
        },
        nutritionPlan: {
          targetCalories: Math.round(profile.weight * 25), // 25 calo/kg
          targetProtein: Math.round(profile.weight * 2),
          targetCarbs: Math.round(profile.weight * 3),
          targetFats: Math.round(profile.weight * 0.8),
          targetWater: Math.round(profile.weight * 0.035),
          mealTiming: ['7:00', '10:00', '12:00', '15:00', '18:00'],
          foodRecommendations: ['Rau xanh', 'Protein nạc', 'Ngũ cốc nguyên hạt'],
          restrictions: ['Đồ ăn nhanh', 'Nước ngọt', 'Đồ ngọt'],
        },
        exercisePlan: {
          frequency: '4-5 buổi/tuần',
          duration: '45-60 phút',
          intensity: 'Trung bình',
          exercises: ['Cardio', 'Tập sức mạnh', 'Yoga'],
          equipment: ['Máy chạy bộ', 'Tạ tay', 'Thảm tập'],
          progression: 'Tăng dần cường độ',
        },
        reasoning: {
          healthFactors: ['BMI cao', 'Tỷ lệ mỡ cao'],
          benefits: ['Giảm nguy cơ bệnh tim mạch', 'Cải thiện sức khỏe'],
          risks: ['Giảm cân quá nhanh có thể mất cơ'],
        },
        warnings: ['Không giảm quá 1kg/tuần'],
        notes: ['Kết hợp dinh dưỡng và tập luyện'],
      });
    }
    
    if (profile.bodyFatPercentage > (profile.gender === 'Male' ? 20 : 28)) {
      suggestedGoals.push({
        id: 'fat_loss_1',
        name: 'Giảm mỡ cơ thể',
        goalType: 'LOSE_WEIGHT',
        description: 'Tập trung giảm mỡ thừa, duy trì cơ bắp',
        priority: 2,
        estimatedDuration: 16,
        difficulty: 'HARD',
        successRate: 75,
        targets: {
          bodyFat: profile.gender === 'Male' ? 15 : 22,
          muscleMass: profile.skeletalMuscleMass,
        },
        nutritionPlan: {
          targetCalories: Math.round(profile.weight * 22),
          targetProtein: Math.round(profile.weight * 2.2),
          targetCarbs: Math.round(profile.weight * 2.5),
          targetFats: Math.round(profile.weight * 0.6),
          targetWater: Math.round(profile.weight * 0.04),
          mealTiming: ['6:00', '9:00', '12:00', '15:00', '18:00', '21:00'],
          foodRecommendations: ['Protein cao', 'Rau xanh', 'Chất béo tốt'],
          restrictions: ['Đồ ăn chế biến', 'Đường tinh luyện'],
        },
        exercisePlan: {
          frequency: '5-6 buổi/tuần',
          duration: '60-90 phút',
          intensity: 'Cao',
          exercises: ['HIIT', 'Tập sức mạnh', 'Cardio dài'],
          equipment: ['Tạ', 'Máy cardio', 'Dây kháng lực'],
          progression: 'Tăng cường độ và thời gian',
        },
        reasoning: {
          healthFactors: ['Tỷ lệ mỡ cao', 'Mỡ nội tạng'],
          benefits: ['Giảm nguy cơ bệnh tật', 'Tăng sức bền'],
          risks: ['Có thể mất cơ nếu không ăn đủ protein'],
        },
        warnings: ['Cần ăn đủ protein để bảo vệ cơ'],
        notes: ['Tập trung vào bài tập compound'],
      });
    }
    
    if (profile.skeletalMuscleMass < (profile.gender === 'Male' ? 30 : 20)) {
      suggestedGoals.push({
        id: 'muscle_gain_1',
        name: 'Tăng cơ bắp',
        goalType: 'BUILD_MUSCLE',
        description: 'Xây dựng cơ bắp để tăng sức mạnh và trao đổi chất',
        priority: 3,
        estimatedDuration: 20,
        difficulty: 'MEDIUM',
        successRate: 80,
        targets: {
          muscleMass: profile.gender === 'Male' ? 35 : 25,
          weight: profile.weight + 5,
        },
        nutritionPlan: {
          targetCalories: Math.round(profile.weight * 30),
          targetProtein: Math.round(profile.weight * 2.5),
          targetCarbs: Math.round(profile.weight * 4),
          targetFats: Math.round(profile.weight * 1),
          targetWater: Math.round(profile.weight * 0.04),
          mealTiming: ['6:00', '9:00', '12:00', '15:00', '18:00', '21:00'],
          foodRecommendations: ['Protein cao', 'Carb phức hợp', 'Chất béo tốt'],
          restrictions: ['Đồ ăn nhanh', 'Rượu bia'],
        },
        exercisePlan: {
          frequency: '4-5 buổi/tuần',
          duration: '60-75 phút',
          intensity: 'Trung bình-Cao',
          exercises: ['Tập sức mạnh', 'Compound movements', 'Cardio nhẹ'],
          equipment: ['Tạ tự do', 'Máy tập', 'Dây kháng lực'],
          progression: 'Tăng tải trọng dần dần',
        },
        reasoning: {
          healthFactors: ['Khối lượng cơ thấp', 'Trao đổi chất chậm'],
          benefits: ['Tăng sức mạnh', 'Cải thiện trao đổi chất'],
          risks: ['Có thể tăng mỡ nếu ăn quá nhiều'],
        },
        warnings: ['Không tăng calo quá nhanh'],
        notes: ['Tập trung vào form đúng'],
      });
    }
    
    // Thêm mục tiêu duy trì sức khỏe
    suggestedGoals.push({
      id: 'health_maintenance_1',
      name: 'Duy trì sức khỏe',
      goalType: 'IMPROVE_HEALTH',
      description: 'Duy trì lối sống lành mạnh và cải thiện sức khỏe tổng thể',
      priority: 4,
      estimatedDuration: 52, // 1 năm
      difficulty: 'EASY',
      successRate: 90,
      targets: {
        weight: profile.weight,
        bodyFat: profile.bodyFatPercentage,
      },
      nutritionPlan: {
        targetCalories: Math.round(profile.weight * 28),
        targetProtein: Math.round(profile.weight * 2),
        targetCarbs: Math.round(profile.weight * 3.5),
        targetFats: Math.round(profile.weight * 0.9),
        targetWater: Math.round(profile.weight * 0.035),
        mealTiming: ['7:00', '10:00', '12:00', '15:00', '18:00'],
        foodRecommendations: ['Thực phẩm toàn phần', 'Rau củ quả', 'Protein nạc'],
        restrictions: ['Đồ ăn chế biến', 'Đường tinh luyện'],
      },
      exercisePlan: {
        frequency: '3-4 buổi/tuần',
        duration: '45-60 phút',
        intensity: 'Trung bình',
        exercises: ['Cardio', 'Tập sức mạnh', 'Yoga', 'Đi bộ'],
        equipment: ['Máy tập', 'Tạ tay', 'Thảm tập'],
        progression: 'Duy trì và cải thiện dần',
      },
      reasoning: {
        healthFactors: ['Duy trì sức khỏe', 'Phòng bệnh'],
        benefits: ['Sức khỏe tốt', 'Năng lượng cao', 'Tâm trạng tốt'],
        risks: ['Ít rủi ro'],
      },
      warnings: ['Duy trì đều đặn'],
      notes: ['Lối sống bền vững'],
    });
    
    return {
      healthAssessment: {
        overallHealth,
        bodyType: 'MESOMORPH',
        healthScore: Math.max(0, Math.min(100, healthScore)),
        weightAnalysis: {
          status: bmi < 18.5 ? 'UNDERWEIGHT' : bmi > 29.9 ? 'OBESE' : bmi > 24.9 ? 'OVERWEIGHT' : 'NORMAL',
          recommendation: bmi > 24.9 ? 'Cần giảm cân' : bmi < 18.5 ? 'Cần tăng cân' : 'Duy trì cân nặng',
          riskLevel: bmi > 29.9 ? 'HIGH' : bmi > 24.9 ? 'MEDIUM' : 'LOW',
        },
        bodyFatAnalysis: {
          status: bodyFatStatus as any,
          recommendation: bodyFatStatus === 'HIGH' ? 'Cần giảm mỡ' : bodyFatStatus === 'LOW' ? 'Cần tăng mỡ' : 'Duy trì',
          healthRisks: bodyFatStatus === 'HIGH' ? ['Bệnh tim mạch', 'Tiểu đường'] : [],
        },
        muscleAnalysis: {
          status: profile.skeletalMuscleMass < (profile.gender === 'Male' ? 30 : 20) ? 'LOW' : 'NORMAL',
          recommendation: profile.skeletalMuscleMass < (profile.gender === 'Male' ? 30 : 20) ? 'Cần tăng cơ' : 'Duy trì',
          potential: 'Có thể cải thiện đáng kể',
        },
        visceralFatAnalysis: {
          status: profile.visceralFatLevel > 10 ? 'HIGH' : 'NORMAL',
          recommendation: profile.visceralFatLevel > 10 ? 'Cần giảm mỡ bụng' : 'Duy trì',
          healthRisks: profile.visceralFatLevel > 10 ? ['Bệnh tim mạch', 'Tiểu đường'] : [],
        },
      },
      comparisonWithStandards: {
        ageGroup: `${Math.floor(profile.age / 10) * 10}-${Math.floor(profile.age / 10) * 10 + 9}`,
        genderGroup: profile.gender,
        percentile: 60,
        ranking: '25-50%',
      },
      healthIssues: {
        immediate: [],
        longTerm: profile.visceralFatLevel > 10 ? ['Bệnh tim mạch'] : [],
        recommendations: ['Tập thể dục đều đặn', 'Ăn uống cân bằng'],
      },
      suggestedGoals,
      customGoalOption: {
        description: 'Bạn có thể tạo mục tiêu tùy chỉnh phù hợp với nhu cầu cá nhân',
        allowCustom: true,
        guidance: 'Liên hệ với chuyên gia dinh dưỡng để được tư vấn chi tiết',
      },
      summary: {
        totalSuggestions: suggestedGoals.length,
        primaryGoal: suggestedGoals[0]?.name || 'Duy trì sức khỏe',
        estimatedTimeline: '3-12 tháng',
        overallSuccessRate: 80,
      },
    };
  }

  private generateFallbackProfileAnalysis(profile: any): any {
    // Tính BMI
    const bmi = profile.weight / Math.pow(profile.height / 100, 2);
    
    // Đánh giá sức khỏe cơ bản
    let overallHealth: 'GOOD' | 'AVERAGE' | 'NEEDS_IMPROVEMENT' = 'AVERAGE';
    let healthScore = 70;
    
    if (bmi >= 18.5 && bmi <= 24.9) {
      healthScore += 10;
      overallHealth = 'GOOD';
    } else if (bmi < 18.5 || bmi > 29.9) {
      healthScore -= 15;
      overallHealth = 'NEEDS_IMPROVEMENT';
    }
    
    // Đánh giá tỷ lệ mỡ
    let bodyFatStatus = 'NORMAL';
    if (profile.gender === 'Male') {
      if (profile.bodyFatPercentage > 25) {
        bodyFatStatus = 'HIGH';
        healthScore -= 10;
      } else if (profile.bodyFatPercentage < 10) {
        bodyFatStatus = 'LOW';
        healthScore -= 5;
      }
    } else {
      if (profile.bodyFatPercentage > 32) {
        bodyFatStatus = 'HIGH';
        healthScore -= 10;
      } else if (profile.bodyFatPercentage < 18) {
        bodyFatStatus = 'LOW';
        healthScore -= 5;
      }
    }

    // Tạo lời khuyên tự nhiên cho cân nặng
    let weightRecommendation = '';
    if (bmi > 29.9) {
      weightRecommendation = `Với chỉ số BMI ${bmi.toFixed(1)}, bạn đang ở mức béo phì. Điều này có thể ảnh hưởng đến sức khỏe tim mạch và khớp. Tôi khuyên bạn nên bắt đầu với việc giảm 5-10% cân nặng hiện tại để cải thiện sức khỏe tổng thể.`;
    } else if (bmi > 24.9) {
      weightRecommendation = `BMI của bạn là ${bmi.toFixed(1)}, cho thấy bạn đang thừa cân. Đây là thời điểm tốt để điều chỉnh chế độ ăn uống và tăng cường vận động để đạt được cân nặng lý tưởng.`;
    } else if (bmi < 18.5) {
      weightRecommendation = `BMI ${bmi.toFixed(1)} cho thấy bạn đang thiếu cân. Điều này có thể ảnh hưởng đến năng lượng và hệ miễn dịch. Hãy tập trung vào việc tăng cân một cách lành mạnh thông qua dinh dưỡng hợp lý.`;
    } else {
      weightRecommendation = `BMI ${bmi.toFixed(1)} của bạn đang ở mức lý tưởng! Hãy duy trì cân nặng này và tập trung vào việc cải thiện thành phần cơ thể thông qua tập luyện.`;
    }

    // Tạo lời khuyên cho tỷ lệ mỡ
    let bodyFatRecommendation = '';
    if (bodyFatStatus === 'HIGH') {
      bodyFatRecommendation = `Tỷ lệ mỡ ${profile.bodyFatPercentage}% của bạn cao hơn mức khuyến nghị. Mỡ thừa có thể làm tăng nguy cơ bệnh tim mạch và tiểu đường. Tôi khuyên bạn nên kết hợp cardio và tập luyện sức mạnh để giảm mỡ hiệu quả.`;
    } else if (bodyFatStatus === 'LOW') {
      bodyFatRecommendation = `Tỷ lệ mỡ ${profile.bodyFatPercentage}% của bạn khá thấp. Mặc dù ít mỡ là tốt, nhưng mỡ cơ thể cũng có vai trò quan trọng trong sản xuất hormone. Hãy đảm bảo không giảm mỡ quá mức.`;
    } else {
      bodyFatRecommendation = `Tỷ lệ mỡ ${profile.bodyFatPercentage}% của bạn đang ở mức khỏe mạnh. Hãy duy trì và cải thiện thêm thông qua chế độ ăn uống cân bằng.`;
    }

    // Tạo lời khuyên cho cơ bắp
    const muscleThreshold = profile.gender === 'Male' ? 30 : 20;
    let muscleRecommendation = '';
    if (profile.skeletalMuscleMass < muscleThreshold) {
      muscleRecommendation = `Khối lượng cơ ${profile.skeletalMuscleMass}kg của bạn thấp hơn mức trung bình. Cơ bắp không chỉ giúp bạn khỏe mạnh mà còn tăng cường trao đổi chất. Tôi khuyên bạn nên tập trung vào các bài tập sức mạnh và tăng cường protein trong chế độ ăn.`;
    } else {
      muscleRecommendation = `Khối lượng cơ ${profile.skeletalMuscleMass}kg của bạn đang ở mức tốt. Hãy tiếp tục duy trì và phát triển thêm để có cơ thể săn chắc hơn.`;
    }

    // Tạo lời khuyên cho mỡ nội tạng
    let visceralFatRecommendation = '';
    if (profile.visceralFatLevel > 10) {
      visceralFatRecommendation = `Mức mỡ nội tạng ${profile.visceralFatLevel} của bạn cao hơn mức an toàn. Mỡ nội tạng bao quanh các cơ quan quan trọng và có thể gây ra các vấn đề sức khỏe nghiêm trọng. Tôi khuyên bạn nên ưu tiên giảm mỡ bụng thông qua chế độ ăn ít carb và tập luyện cardio.`;
    } else {
      visceralFatRecommendation = `Mức mỡ nội tạng ${profile.visceralFatLevel} của bạn đang ở mức an toàn. Hãy duy trì lối sống lành mạnh để giữ mức này.`;
    }
    
    return {
      healthAssessment: {
        overallHealth,
        bodyType: 'MESOMORPH',
        healthScore: Math.max(0, Math.min(100, healthScore)),
        weightAnalysis: {
          status: bmi < 18.5 ? 'UNDERWEIGHT' : bmi > 29.9 ? 'OBESE' : bmi > 24.9 ? 'OVERWEIGHT' : 'NORMAL',
          recommendation: weightRecommendation,
          riskLevel: bmi > 29.9 ? 'HIGH' : bmi > 24.9 ? 'MEDIUM' : 'LOW',
        },
        bodyFatAnalysis: {
          status: bodyFatStatus as any,
          recommendation: bodyFatRecommendation,
          healthRisks: bodyFatStatus === 'HIGH' ? ['Bệnh tim mạch', 'Tiểu đường', 'Tăng huyết áp'] : [],
        },
        muscleAnalysis: {
          status: profile.skeletalMuscleMass < muscleThreshold ? 'LOW' : 'NORMAL',
          recommendation: muscleRecommendation,
          potential: 'Với chế độ tập luyện phù hợp, bạn có thể cải thiện đáng kể khối lượng cơ bắp và sức mạnh tổng thể.',
        },
        visceralFatAnalysis: {
          status: profile.visceralFatLevel > 10 ? 'HIGH' : 'NORMAL',
          recommendation: visceralFatRecommendation,
          healthRisks: profile.visceralFatLevel > 10 ? ['Bệnh tim mạch', 'Tiểu đường', 'Hội chứng chuyển hóa'] : [],
        },
      },
      comparisonWithStandards: {
        ageGroup: `${Math.floor(profile.age / 10) * 10}-${Math.floor(profile.age / 10) * 10 + 9}`,
        genderGroup: profile.gender,
        percentile: 60,
        ranking: 'So với nhóm tuổi và giới tính của bạn, các chỉ số đang ở mức trung bình. Có nhiều cơ hội để cải thiện và vượt trội hơn.',
      },
      healthIssues: {
        immediate: profile.visceralFatLevel > 10 ? ['Cần giảm mỡ nội tạng ngay lập tức'] : [],
        longTerm: profile.visceralFatLevel > 10 ? ['Nguy cơ bệnh tim mạch', 'Tiểu đường type 2'] : [],
        recommendations: [
          'Tập thể dục đều đặn ít nhất 150 phút/tuần với cường độ vừa phải',
          'Ăn uống cân bằng với nhiều rau xanh, protein nạc và ngũ cốc nguyên hạt',
          'Hạn chế thực phẩm chế biến sẵn và đường tinh luyện',
          'Ngủ đủ 7-9 giờ mỗi đêm để hỗ trợ phục hồi và trao đổi chất',
          'Uống đủ nước (2-3 lít/ngày) để duy trì chức năng cơ thể'
        ],
      },
    };
  }

  private calculateFallbackTrendAnalysis(profiles: any[], params: any): TrendAnalysis {
    if (profiles.length < 2) {
      return {
        trendAnalysis: {
          weight: 'Không đủ dữ liệu',
          bodyFat: 'Không đủ dữ liệu',
          muscleMass: 'Không đủ dữ liệu',
          water: 'Không đủ dữ liệu'
        },
        prediction: {
          nextMonth: {},
          nextQuarter: {}
        },
        recommendations: ['Cần thêm dữ liệu để phân tích xu hướng'],
        progressReport: {
          summary: 'Chưa đủ dữ liệu để đánh giá',
          achievements: [],
          challenges: ['Cần đo chỉ số định kỳ']
        }
      };
    }
    
    // Calculate trends
    const latest = profiles[profiles.length - 1];
    const earliest = profiles[0];
    
    const weightDiff = latest.weight - earliest.weight;
    const weightTrend = weightDiff > 0 ? 'Tăng' : weightDiff < 0 ? 'Giảm' : 'Ổn định';
    
    const bodyFatDiff = (latest.bodyFatPercentage || 0) - (earliest.bodyFatPercentage || 0);
    const bodyFatTrend = bodyFatDiff > 0 ? 'Tăng' : bodyFatDiff < 0 ? 'Giảm' : 'Ổn định';
    
    const muscleDiff = (latest.skeletalMuscleMass || 0) - (earliest.skeletalMuscleMass || 0);
    const muscleTrend = muscleDiff > 0 ? 'Tăng' : muscleDiff < 0 ? 'Giảm' : 'Ổn định';
    
    const waterDiff = (latest.totalBodyWater || 0) - (earliest.totalBodyWater || 0);
    const waterTrend = waterDiff > 0 ? 'Tăng' : waterDiff < 0 ? 'Giảm' : 'Ổn định';
    
    // Generate recommendations
    const recommendations: string[] = [];
    if (weightDiff > 0 && latest.goalType === 'LOSE_WEIGHT') {
      recommendations.push('Cần giảm calo và tăng vận động');
    }
    if (bodyFatDiff > 0) {
      recommendations.push('Tập trung vào bài tập cardio');
    }
    if (muscleDiff < 0) {
      recommendations.push('Tăng cường protein và tập luyện sức mạnh');
    }
    
    return {
      trendAnalysis: {
        weight: weightTrend,
        bodyFat: bodyFatTrend,
        muscleMass: muscleTrend,
        water: waterTrend
      },
      prediction: {
        nextMonth: {
          weight: latest.weight + (weightDiff / profiles.length),
          bodyFat: (latest.bodyFatPercentage || 0) + (bodyFatDiff / profiles.length)
        },
        nextQuarter: {
          weight: latest.weight + (weightDiff / profiles.length) * 3,
          bodyFat: (latest.bodyFatPercentage || 0) + (bodyFatDiff / profiles.length) * 3
        }
      },
      recommendations: recommendations.length > 0 ? recommendations : [
        'Duy trì chế độ hiện tại',
        'Theo dõi chỉ số định kỳ',
        'Điều chỉnh mục tiêu nếu cần'
      ],
      progressReport: {
        summary: `Xu hướng ${weightTrend} cân nặng, ${bodyFatTrend} mỡ, ${muscleTrend} cơ bắp`,
        achievements: weightDiff < 0 ? ['Giảm cân thành công'] : [],
        challenges: weightDiff > 0 ? ['Cần kiểm soát cân nặng'] : []
      }
    };
  }
} 