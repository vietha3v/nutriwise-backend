import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AiCache } from './entities/ai-cache.entity';
import { Profile } from '../profile/entities/profile.entity';
import { Meal } from '../meal/entities/meal.entity';
import { Exercise } from '../exercise/entities/exercise.entity';
import { NutritionGoal } from '../nutrition-goal/entities/nutrition-goal.entity';
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
    @InjectRepository(NutritionGoal)
    private nutritionGoalRepository: Repository<NutritionGoal>,
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
      dietaryRestrictions: profile.dietaryRestrictions,
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
        - Hạn chế ăn uống: ${profile.dietaryRestrictions || 'Không có'}
        
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

  async generateSmartMealSuggestion(
    userId: number,
    mealType: string,
    date: Date,
    forceRefresh: boolean = false,
  ): Promise<SmartMealSuggestion> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) {
      throw new Error('Không tìm thấy hồ sơ người dùng');
    }

    // Lấy dữ liệu cho AI
    const foodData = await this.foodService.getDataForAI(userId, date);
    const availableFoods = foodData.availableFoods;
    const userPreferences = foodData.userPreferences;

    const inputData = {
      userId,
      mealType,
      date,
      profile,
      availableFoods,
      userPreferences,
    };

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = await this.getCachedResponse(userId, `smart_meal_${mealType}`, inputData);
      if (cached) {
        return cached.data;
      }
    }

    try {
      if (this.openai) {
        const prompt = `Tạo gợi ý bữa ăn thông minh cho ${mealType} với:

**Thông tin người dùng:**
- Tuổi: ${profile.age}
- Giới tính: ${profile.gender}
- Cân nặng: ${profile.weight}kg
- Chiều cao: ${profile.height}cm
- Mục tiêu: ${profile.goalType}
- Hạn chế ăn uống: ${profile.dietaryRestrictions || 'Không có'}

**Thực phẩm có sẵn:**
${availableFoods.map(food => `- ${food.foodName}: ${food.quantity} ${food.unit}`).join('\n')}

**Sở thích người dùng:**
${userPreferences.map(pref => `- ${pref.food.name}: ${pref.preferenceLevel}/5 ${pref.isAllergic ? '(dị ứng)' : ''}`).join('\n')}

Trả về JSON với:
{
  "mealName": string (tên món ăn),
  "ingredients": [
    {
      "foodId": number,
      "foodName": string,
      "quantity": number,
      "unit": string
    }
  ],
  "nutritionInfo": {
    "totalCalories": number,
    "totalProtein": number,
    "totalCarbs": number,
    "totalFat": number
  },
  "cookingInstructions": [string] (các bước nấu),
  "estimatedCookingTime": number (phút),
  "difficulty": string ("dễ", "trung bình", "khó"),
  "tips": [string] (mẹo nấu ăn),
  "whyThisMeal": string (lý do chọn món này)
}`;

        const gptResult = await this.callGpt(prompt);
        
        await this.saveCache(
          userId,
          `smart_meal_${mealType}`,
          inputData,
          gptResult.response,
          'gpt',
          true,
          gptResult.model,
          gptResult.tokensUsed,
          gptResult.costUsd,
        );

        // Lưu gợi ý vào database
        await this.foodService.saveMealSuggestion(
          userId,
          date,
          mealType,
          gptResult.response,
          'gpt',
        );

        return gptResult.response;
      }
    } catch (error) {
      this.logger.warn('GPT call failed, using fallback calculation');
    }

    // Fallback calculation
    const fallbackSuggestion = this.generateFallbackMealSuggestion(
      profile,
      availableFoods,
      userPreferences,
      mealType,
    );
    
    await this.saveCache(
      userId,
      `smart_meal_${mealType}`,
      inputData,
      fallbackSuggestion,
      'fallback',
      false,
    );

    // Lưu gợi ý vào database
    await this.foodService.saveMealSuggestion(
      userId,
      date,
      mealType,
      fallbackSuggestion,
      'fallback',
    );

    return fallbackSuggestion;
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
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9,
    };
    return bmr * (multipliers[activityLevel] || 1.2);
  }
} 