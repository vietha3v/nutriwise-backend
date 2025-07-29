import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Food } from './entities/food.entity';
import { UserFoodPreference } from './entities/user-food-preference.entity';
import { DailyFoodAvailability } from './entities/daily-food-availability.entity';
import { MealSuggestion } from './entities/meal-suggestion.entity';
import { Profile } from '../profile/entities/profile.entity';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Food)
    private foodRepository: Repository<Food>,
    @InjectRepository(UserFoodPreference)
    private userFoodPreferenceRepository: Repository<UserFoodPreference>,
    @InjectRepository(DailyFoodAvailability)
    private dailyFoodAvailabilityRepository: Repository<DailyFoodAvailability>,
    @InjectRepository(MealSuggestion)
    private mealSuggestionRepository: Repository<MealSuggestion>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async findAll(): Promise<Food[]> {
    return await this.foodRepository.find();
  }

  async findOne(id: number): Promise<Food> {
    const food = await this.foodRepository.findOne({ where: { id } });
    if (!food) {
      throw new Error('Không tìm thấy thực phẩm');
    }
    return food;
  }

  async searchFoods(query: string): Promise<Food[]> {
    return await this.foodRepository
      .createQueryBuilder('food')
      .where('food.name ILIKE :query', { query: `%${query}%` })
      .orWhere('food.description ILIKE :query', { query: `%${query}%` })
      .getMany();
  }

  async getUserPreferences(userId: number): Promise<UserFoodPreference[]> {
    return await this.userFoodPreferenceRepository.find({
      where: { userId },
      relations: ['food'],
    });
  }

  async updateUserPreference(
    userId: number,
    foodId: number,
    preferenceLevel: number,
    dislikeReason?: string,
    isAllergic?: boolean,
  ): Promise<UserFoodPreference> {
    let preference = await this.userFoodPreferenceRepository.findOne({
      where: { userId, foodId },
    });

    if (!preference) {
      preference = this.userFoodPreferenceRepository.create({
        userId,
        foodId,
        preferenceLevel,
        dislikeReason: dislikeReason || '',
        isAllergic: isAllergic || false,
      });
    } else {
      preference.preferenceLevel = preferenceLevel;
      preference.dislikeReason = dislikeReason || '';
      preference.isAllergic = isAllergic || false;
    }

    return await this.userFoodPreferenceRepository.save(preference);
  }

  async getDailyAvailability(userId: number, date: Date): Promise<DailyFoodAvailability[]> {
    return await this.dailyFoodAvailabilityRepository.find({
      where: { userId, date },
    });
  }

  async updateDailyAvailability(
    userId: number,
    date: Date,
    availableFoods: {
      foodId: number;
      foodName: string;
      quantity: number;
      unit: string;
      notes?: string;
    }[],
    notes?: string,
  ): Promise<DailyFoodAvailability> {
    let availability = await this.dailyFoodAvailabilityRepository.findOne({
      where: { userId, date },
    });

    if (!availability) {
      availability = this.dailyFoodAvailabilityRepository.create({
        userId,
        date,
        availableFoods,
        notes: notes || '',
      });
    } else {
      availability.availableFoods = availableFoods;
      availability.notes = notes || '';
    }

    return await this.dailyFoodAvailabilityRepository.save(availability);
  }

  async getMealSuggestions(userId: number, date: Date): Promise<MealSuggestion[]> {
    return await this.mealSuggestionRepository.find({
      where: { userId, date },
    });
  }

  async saveMealSuggestion(
    userId: number,
    date: Date,
    mealType: string,
    suggestion: any,
    source: 'gpt' | 'fallback',
  ): Promise<MealSuggestion> {
    const existingSuggestion = await this.mealSuggestionRepository.findOne({
      where: { userId, date, mealType },
    });

    if (existingSuggestion) {
      existingSuggestion.suggestion = suggestion;
      existingSuggestion.source = source;
      existingSuggestion.updatedAt = new Date();
      return await this.mealSuggestionRepository.save(existingSuggestion);
    }

    const newSuggestion = this.mealSuggestionRepository.create({
      userId,
      date,
      mealType,
      suggestion,
      source,
    });

    return await this.mealSuggestionRepository.save(newSuggestion);
  }

  async updateMealSuggestionFeedback(
    userId: number,
    date: Date,
    mealType: string,
    feedback?: string,
  ): Promise<MealSuggestion> {
    const suggestion = await this.mealSuggestionRepository.findOne({
      where: { userId, date, mealType },
    });

    if (!suggestion) {
      throw new Error('Không tìm thấy gợi ý bữa ăn');
    }

    suggestion.userFeedback = feedback || '';
    return await this.mealSuggestionRepository.save(suggestion);
  }

  async getDataForAI(userId: number, date: Date): Promise<{
    availableFoods: any[];
    userPreferences: any[];
    profile: any;
  }> {
    const [preferences, availability, profile] = await Promise.all([
      this.userFoodPreferenceRepository.find({
        where: { userId },
        relations: ['food'],
      }),
      this.dailyFoodAvailabilityRepository.find({
        where: { userId, date },
      }),
      this.profileRepository.findOne({ where: { userId } }),
    ]);

    // Extract available foods from availability data
    const availableFoods = availability.flatMap(avail => 
      avail.availableFoods.map(food => ({
        foodId: food.foodId,
        foodName: food.foodName,
        quantity: food.quantity,
        unit: food.unit,
      }))
    );

    return {
      availableFoods,
      userPreferences: preferences.map(pref => ({
        food: pref.food,
        preferenceLevel: pref.preferenceLevel,
        isAllergic: pref.isAllergic,
      })),
      profile,
    };
  }
} 