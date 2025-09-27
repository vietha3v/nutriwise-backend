import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike, In, Between } from 'typeorm';
import { Food, FoodCategory } from './entities/food.entity';
import { UserFoodPreference } from './entities/user-food-preference.entity';
// import { PantryItem } from './entities/pantry-item.entity';

import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { FoodSearchDto } from './dto/food-search.dto';
import { CreateFoodPreferenceDto } from './dto/create-food-preference.dto';
import { UpdateFoodPreferenceDto } from './dto/update-food-preference.dto';
import { CreatePantryFoodDto } from './dto/create-pantry-food.dto';
import { UpdatePantryFoodDto } from './dto/update-pantry-food.dto';
import { FoodResponseDto, FoodSearchResponseDto } from './dto/food-response.dto';

import { FoodAiService } from './services/food-ai.service';

@Injectable()
export class FoodService {
  private readonly logger = new Logger(FoodService.name);
  
  constructor(
    @InjectRepository(Food)
    private foodRepository: Repository<Food>,
    @InjectRepository(UserFoodPreference)
    private userFoodPreferenceRepository: Repository<UserFoodPreference>,
    // @InjectRepository(PantryItem)
    // private pantryRepository: Repository<PantryItem>,

    private foodAiService: FoodAiService,
  ) {}

  async create(createFoodDto: CreateFoodDto): Promise<Food> {
    const food = new Food();
    Object.assign(food, createFoodDto);
    return await this.foodRepository.save(food);
  }

  async findAll(): Promise<Food[]> {
    return await this.foodRepository.find({
      where: { isDeleted: false },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number, userId?: number): Promise<FoodResponseDto> {
    // Validate id
    if (!id || isNaN(id)) {
      throw new BadRequestException('ID thực phẩm không hợp lệ');
    }
    
    const food = await this.foodRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['userPreferences'],
    });
    if (!food) {
      throw new NotFoundException(`Food with ID ${id} not found`);
    }

    // Enrich with user data
    const enrichedFoods = await this.enrichFoodsWithUserData([food], userId);
    return enrichedFoods[0];
  }

  async update(id: number, updateFoodDto: UpdateFoodDto): Promise<Food> {
    // Get original food for update
    const food = await this.foodRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!food) {
      throw new NotFoundException(`Food with ID ${id} not found`);
    }
    
    Object.assign(food, updateFoodDto);
    return await this.foodRepository.save(food);
  }

  async remove(id: number): Promise<void> {
    const food = await this.foodRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!food) {
      throw new NotFoundException(`Food with ID ${id} not found`);
    }
    food.isDeleted = true;
    await this.foodRepository.save(food);
  }

  async search(searchDto: FoodSearchDto, userId?: number) {
    const {
      query,
      categories,
      categoryName,
      brand,
      hasAllergens,
      minCalories,
      maxCalories,
      minProtein,
      maxProtein,
      page = 1,
      limit = 10,
      forceAI = false,
    } = searchDto;

    // Ensure page and limit are valid numbers from the start
    const validPage = Math.max(1, Math.floor(Number(page)) || 1);
    const validLimit = Math.max(1, Math.min(100, Math.floor(Number(limit)) || 10));

    // Debug logging
    this.logger.log(`Search parameters:`, {
      query,
      page: page,
      limit: limit,
      validPage,
      validLimit,
      minCalories,
      maxCalories,
      minProtein,
      maxProtein,
      forceAI
    });

    const queryBuilder = this.foodRepository
      .createQueryBuilder('food')
      .where('food.isDeleted = :isDeleted', { isDeleted: false });

    // Search by query with regex support
    if (query) {
      const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
      
      if (searchTerms.length > 0) {
        const parameters: any = {};
        
        // Build search conditions
        let searchCondition = '(LOWER(food.name) LIKE LOWER(:nameQuery) OR LOWER(food.nameEn) LIKE LOWER(:nameQuery) OR LOWER(food.brand) LIKE LOWER(:nameQuery))';
        parameters.nameQuery = `%${query}%`;
        
        // Add category search
        searchCondition += ' OR EXISTS (SELECT 1 FROM unnest(food.categories) AS cat WHERE LOWER(cat::text) LIKE LOWER(:categoryQuery))';
        parameters.categoryQuery = `%${query}%`;
        
        // Add keywords search
        searchTerms.forEach((term, index) => {
          searchCondition += ` OR EXISTS (
            SELECT 1 FROM unnest(food.keywords) AS keyword 
            WHERE LOWER(keyword) LIKE LOWER(:keyword${index})
          )`;
          parameters[`keyword${index}`] = `%${term}%`;
        });
        
        queryBuilder.andWhere(`(${searchCondition})`, parameters);
      }
    }

    // Filter by categories
    if (categories) {
      const categoryArray = categories.split(',').map(cat => cat.trim()).filter(cat => cat);
      if (categoryArray.length > 0) {
        queryBuilder.andWhere('food.categories && :categories', { categories: categoryArray });
      }
    }

    // Filter by category name (search in category enum)
    if (categoryName) {
      queryBuilder.andWhere('EXISTS (SELECT 1 FROM unnest(food.categories) AS cat WHERE LOWER(cat::text) LIKE LOWER(:categoryName))', { 
        categoryName: `%${categoryName}%` 
      });
    }

    // Filter by brand
    if (brand) {
      queryBuilder.andWhere('LOWER(food.brand) LIKE LOWER(:brand)', { brand: `%${brand}%` });
    }

    // Filter by allergens
    if (hasAllergens && hasAllergens.length > 0) {
      queryBuilder.andWhere('food.allergens && :allergens', { allergens: hasAllergens });
    }

    // Filter by calories range
    if (minCalories !== undefined && !isNaN(minCalories) && minCalories >= 0) {
      queryBuilder.andWhere('food.calories >= :minCalories', { minCalories });
    }
    if (maxCalories !== undefined && !isNaN(maxCalories) && maxCalories >= 0) {
      queryBuilder.andWhere('food.calories <= :maxCalories', { maxCalories });
    }

    // Filter by protein range
    if (minProtein !== undefined && !isNaN(minProtein) && minProtein >= 0) {
      queryBuilder.andWhere('food.protein >= :minProtein', { minProtein });
    }
    if (maxProtein !== undefined && !isNaN(maxProtein) && maxProtein >= 0) {
      queryBuilder.andWhere('food.protein <= :maxProtein', { maxProtein });
    }

    // Count total
    const total = await queryBuilder.getCount();

    // Get paginated results
    const foods = await queryBuilder
      .orderBy('food.name', 'ASC')
      .skip((validPage - 1) * validLimit)
      .take(validLimit)
      .getMany();

    // Enrich foods with user-specific data if userId is provided
    const enrichedFoods = await this.enrichFoodsWithUserData(foods, userId);

    // If forceAI is true or no results found and there's a query, try AI generation
    if ((forceAI || foods.length === 0) && query) {
      if (forceAI) {
        this.logger.log(`Force AI generation for query: "${query}"`);
      } else {
        this.logger.log(`No foods found for query: "${query}", trying AI generation...`);
      }
      
      const aiGeneratedFood = await this.foodAiService.generateFoodFromQuery(query, this.foodRepository);
      if (aiGeneratedFood) {
        this.logger.log(`AI generated food: ${aiGeneratedFood.name}`);
        
        // Always check if food with similar name already exists (for both forceAI and normal search)
        const existingFood = await this.foodRepository
          .createQueryBuilder('food')
          .where('food.isDeleted = :isDeleted', { isDeleted: false })
          .andWhere(
            '(LOWER(food.name) = LOWER(:name) OR LOWER(food.nameEn) = LOWER(:nameEn) OR LOWER(food.name) LIKE LOWER(:nameLike) OR LOWER(food.nameEn) LIKE LOWER(:nameLike))',
            {
              name: aiGeneratedFood.name,
              nameEn: aiGeneratedFood.nameEn,
              nameLike: `%${aiGeneratedFood.name}%`
            }
          )
          .getOne();

        if (existingFood) {
          this.logger.log(`Food with similar name already exists: ${existingFood.name}`);
          return {
            foods: [existingFood],
            total: 1,
            page: validPage,
            limit: validLimit,
            totalPages: 1,
          };
        }

        // Save to database only if no similar food exists
        const savedFood = await this.foodRepository.save(aiGeneratedFood);
        const enrichedFoods = await this.enrichFoodsWithUserData([savedFood], userId);
        return {
          foods: enrichedFoods,
          total: 1,
          page: validPage,
          limit: validLimit,
          totalPages: 1,
        };
      } else {
        this.logger.log(`AI failed to generate food for query: "${query}"`);
      }
    }

    return {
      foods: enrichedFoods,
      total,
      page: validPage,
      limit: validLimit,
      totalPages: Math.ceil(total / validLimit),
    };
  }

  async findByCategory(category: FoodCategory): Promise<Food[]> {
    return await this.foodRepository
      .createQueryBuilder('food')
      .where('food.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('food.categories && :category', { category: [category] })
      .orderBy('food.name', 'ASC')
      .getMany();
  }

  // User Food Preferences
  async createUserPreference(userId: number, createDto: CreateFoodPreferenceDto): Promise<UserFoodPreference> {
    // Check if preference already exists
    const existingPreference = await this.userFoodPreferenceRepository.findOne({
      where: { userId, foodId: createDto.foodId },
    });

    if (existingPreference) {
      throw new BadRequestException('User preference for this food already exists');
    }

    // Check if food exists
    const food = await this.foodRepository.findOne({
      where: { id: createDto.foodId, isDeleted: false },
    });
    if (!food) {
      throw new NotFoundException(`Food with ID ${createDto.foodId} not found`);
    }

    const preference = new UserFoodPreference();
    Object.assign(preference, {
      ...createDto,
      userId,
    });

    return await this.userFoodPreferenceRepository.save(preference);
  }

  async updateUserPreference(
    userId: number,
    foodId: number,
    updateDto: UpdateFoodPreferenceDto,
  ): Promise<UserFoodPreference> {
    const preference = await this.userFoodPreferenceRepository.findOne({
      where: { userId, foodId },
    });

    if (!preference) {
      throw new NotFoundException('User preference not found');
    }

    Object.assign(preference, updateDto);
    return await this.userFoodPreferenceRepository.save(preference);
  }

  async removeUserPreference(userId: number, foodId: number): Promise<void> {
    const preference = await this.userFoodPreferenceRepository.findOne({
      where: { userId, foodId },
    });

    if (!preference) {
      throw new NotFoundException('User preference not found');
    }

    await this.userFoodPreferenceRepository.remove(preference);
  }

  async getUserPreferences(userId: number): Promise<UserFoodPreference[]> {
    return await this.userFoodPreferenceRepository.find({
      where: { userId },
      relations: ['food'],
      order: { updatedAt: 'DESC' },
    });
  }

  async getUserPreference(userId: number, foodId: number): Promise<UserFoodPreference | null> {
    return await this.userFoodPreferenceRepository.findOne({
      where: { userId, foodId },
      relations: ['food'],
    });
  }

  async getUserAllergicFoods(userId: number): Promise<Food[]> {
    const preferences = await this.userFoodPreferenceRepository.find({
      where: { userId, isAllergic: true },
      relations: ['food'],
    });
    return preferences.map(pref => pref.food);
  }

  // Pantry Management - Temporarily disabled due to entity metadata issue
  async addPantryItem(userId: number, createDto: CreatePantryFoodDto): Promise<any> {
    throw new BadRequestException('Pantry functionality temporarily disabled');
  }

  async updatePantryItem(
    userId: number,
    pantryItemId: number,
    updateDto: UpdatePantryFoodDto,
  ): Promise<any> {
    throw new BadRequestException('Pantry functionality temporarily disabled');
  }

  async removePantryItem(userId: number, pantryItemId: number): Promise<void> {
    throw new BadRequestException('Pantry functionality temporarily disabled');
  }

  async getPantryItems(userId: number): Promise<any[]> {
    console.log('🔥 [DEBUG] getPantryItems called with userId:', userId);
    // Temporarily return empty array
    return [];
  }

  // Enhanced User Preferences with Favorite/Dislike
  async getUserFavoriteFoods(userId: number): Promise<Food[]> {
    const preferences = await this.userFoodPreferenceRepository.find({
      where: { userId, preferenceLevel: 5 },
      relations: ['food'],
    });
    return preferences.map(pref => pref.food);
  }

  async getUserDislikedFoods(userId: number): Promise<Food[]> {
    const preferences = await this.userFoodPreferenceRepository.find({
      where: { userId, preferenceLevel: 1 },
      relations: ['food'],
    });
    return preferences.map(pref => pref.food);
  }

  async getUserNeutralFoods(userId: number): Promise<Food[]> {
    const preferences = await this.userFoodPreferenceRepository.find({
      where: { userId, preferenceLevel: 3 },
      relations: ['food'],
    });
    return preferences.map(pref => pref.food);
  }

  /**
   * Enrich foods with user-specific data (preferences only, pantry temporarily disabled)
   */
  private async enrichFoodsWithUserData(foods: Food[], userId?: number): Promise<FoodResponseDto[]> {
    if (!userId || foods.length === 0) {
      // Return foods without user data if no userId provided
      return foods.map(food => ({
        ...food,
        isInPantry: false,
        pantryAmount: undefined,
        rating: undefined,
        dislikeReason: undefined,
        isAllergic: false,
        allergicReaction: undefined,
        notes: undefined,
      }));
    }

    // Get food IDs
    const foodIds = foods.map(food => food.id);

    // Get user preferences for these foods
    const userPreferences = await this.userFoodPreferenceRepository.find({
      where: { userId, foodId: In(foodIds) },
    });

    // Create map for quick lookup
    const preferenceMap = new Map(
      userPreferences.map(pref => [pref.foodId, pref])
    );

    // Enrich each food with user data
    return foods.map(food => {
      const preference = preferenceMap.get(food.id);

      return {
        ...food,
        isInPantry: false, // Temporarily disabled
        pantryAmount: undefined, // Temporarily disabled
        rating: preference?.preferenceLevel,
        dislikeReason: preference?.dislikeReason,
        isAllergic: preference?.isAllergic || false,
        allergicReaction: preference?.allergicReaction,
        notes: preference?.notes,
      };
    });
  }

} 