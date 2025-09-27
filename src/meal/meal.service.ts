import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Meal } from './entities/meal.entity';
import { MealFood } from './entities/meal-food.entity';
import { Food } from '../food/entities/food.entity';

@Injectable()
export class MealService {
  constructor(
    @InjectRepository(Meal)
    private mealRepository: Repository<Meal>,
    @InjectRepository(MealFood)
    private mealFoodRepository: Repository<MealFood>,
    @InjectRepository(Food)
    private foodRepository: Repository<Food>,
  ) {}

  async create(userId: number, createMealDto: any): Promise<Meal> {
    const meal = new Meal();
    Object.assign(meal, {
      type: createMealDto.type,
      date: new Date(createMealDto.date),
      time: createMealDto.time,
      notes: createMealDto.notes,
      userId,
    });

    // Lưu bữa ăn trước
    const savedMeal = await this.mealRepository.save(meal);

    // Tạo các meal foods và tính toán dinh dưỡng
    if (createMealDto.mealFoods && createMealDto.mealFoods.length > 0) {
      const mealFoods: MealFood[] = [];
      
      for (const mealFoodDto of createMealDto.mealFoods) {
        // Lấy thông tin thực phẩm
        const food = await this.foodRepository.findOne({
          where: { id: mealFoodDto.foodId, isDeleted: false }
        });
        
        if (!food) {
          throw new NotFoundException(`Food with ID ${mealFoodDto.foodId} not found`);
        }

        // Tính toán dinh dưỡng dựa trên serving size và đơn vị đo
        let ratio: number;
        
        // Kiểm tra xem đơn vị đo có trong servingSizes không
        const matchingServing = food.servingSizes?.find(s => s.unit === mealFoodDto.unit);
        
        if (matchingServing) {
          // Nếu tìm thấy đơn vị đo trong servingSizes, tính ratio dựa trên đó
          ratio = mealFoodDto.quantity / matchingServing.size;
        } else {
          // Nếu không tìm thấy, sử dụng serving size đầu tiên hoặc mặc định
          const defaultServing = food.servingSizes?.[0] || { size: 100, unit: 'g' };
          ratio = this.calculateRatio(mealFoodDto.quantity, mealFoodDto.unit, defaultServing.size, defaultServing.unit);
        }
        
        const mealFood = new MealFood();
        Object.assign(mealFood, {
          mealId: savedMeal.id,
          foodId: mealFoodDto.foodId,
          quantity: mealFoodDto.quantity,
          unit: mealFoodDto.unit,
          // Tính toán dinh dưỡng
          calories: Number(food.calories) * ratio,
          protein: Number(food.protein) * ratio,
          carbs: Number(food.carbs) * ratio,
          fat: Number(food.fat) * ratio,
          fiber: Number(food.fiber) * ratio,
          sugar: Number(food.sugar) * ratio,
          sodium: Number(food.sodium) * ratio,
        });
        
        mealFoods.push(mealFood);
      }

      await this.mealFoodRepository.save(mealFoods);
    }

    // Cập nhật tổng dinh dưỡng
    await this.updateMealNutrition(savedMeal.id);

    // Trả về bữa ăn với thông tin đầy đủ
    return await this.findOne(savedMeal.id, userId);
  }

  async findAll(userId: number): Promise<Meal[]> {
    return await this.mealRepository.find({
      where: { userId, isDeleted: false },
      order: { createdAt: 'DESC' },
      relations: ['mealFoods'],
    });
  }

  async findOne(id: number, userId: number): Promise<Meal> {
    const meal = await this.mealRepository.findOne({
      where: { id, userId, isDeleted: false },
      relations: ['mealFoods'],
    });
    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }
    return meal;
  }

  async update(id: number, userId: number, updateMealDto: any): Promise<Meal> {
    const meal = await this.findOne(id, userId);
    Object.assign(meal, {
      ...updateMealDto,
      date: updateMealDto.date ? new Date(updateMealDto.date) : meal.date, // Convert string to Date
    });
    return await this.mealRepository.save(meal);
  }

  async remove(id: number, userId: number): Promise<void> {
    const meal = await this.findOne(id, userId);
    meal.isDeleted = true;
    await this.mealRepository.save(meal);
  }



  /**
   * Lấy bữa ăn theo ngày
   */
  async findByDate(userId: number, date: string): Promise<Meal[]> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    return await this.mealRepository.find({
      where: {
        userId,
        date: Between(startDate, endDate),
        isDeleted: false,
      },
      order: { date: 'ASC' },
      relations: ['mealFoods'],
    });
  }

  /**
   * Lấy bữa ăn theo khoảng thời gian
   */
  async findByDateRange(userId: number, startDate: string, endDate: string): Promise<Meal[]> {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return await this.mealRepository.find({
      where: {
        userId,
        date: Between(start, end),
        isDeleted: false,
      },
      order: { date: 'ASC' },
      relations: ['mealFoods'],
    });
  }

  /**
   * Thống kê dinh dưỡng theo ngày
   */
  async getDailyStats(userId: number, date: string) {
    const meals = await this.findByDate(userId, date);
    
    const stats = {
      date,
      totalMeals: meals.length,
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalFiber: 0,
      totalSugar: 0,
      totalSodium: 0,
      meals: meals.map(meal => ({
        id: meal.id,
        type: meal.type,
        time: meal.time,
        totalCalories: meal.totalCalories,
        totalProtein: meal.totalProtein,
        totalCarbs: meal.totalCarbs,
        totalFat: meal.totalFat,
      })),
    };

    meals.forEach(meal => {
      stats.totalCalories += Number(meal.totalCalories) || 0;
      stats.totalProtein += Number(meal.totalProtein) || 0;
      stats.totalCarbs += Number(meal.totalCarbs) || 0;
      stats.totalFat += Number(meal.totalFat) || 0;
      stats.totalFiber += Number(meal.totalFiber) || 0;
      stats.totalSugar += Number(meal.totalSugar) || 0;
      stats.totalSodium += Number(meal.totalSodium) || 0;
    });

    return stats;
  }

  /**
   * Thống kê dinh dưỡng theo tuần
   */
  async getWeeklyStats(userId: number, startDate: string) {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 6); // 7 ngày

    const meals = await this.findByDateRange(userId, startDate, end.toISOString().split('T')[0]);
    
    const stats = {
      startDate,
      endDate: end.toISOString().split('T')[0],
      totalMeals: meals.length,
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalFiber: 0,
      totalSugar: 0,
      totalSodium: 0,
      averageCaloriesPerDay: 0,
      dailyStats: [] as Array<{date: string; meals: number; calories: number}>,
    };

    // Tính tổng dinh dưỡng
    meals.forEach(meal => {
      stats.totalCalories += Number(meal.totalCalories) || 0;
      stats.totalProtein += Number(meal.totalProtein) || 0;
      stats.totalCarbs += Number(meal.totalCarbs) || 0;
      stats.totalFat += Number(meal.totalFat) || 0;
      stats.totalFiber += Number(meal.totalFiber) || 0;
      stats.totalSugar += Number(meal.totalSugar) || 0;
      stats.totalSodium += Number(meal.totalSodium) || 0;
    });

    // Tính trung bình calo mỗi ngày
    stats.averageCaloriesPerDay = stats.totalCalories / 7;

    // Thống kê theo từng ngày
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(currentDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      const dailyMeals = meals.filter(meal => 
        meal.date.toISOString().split('T')[0] === dateStr
      );
      
      const dailyCalories = dailyMeals.reduce((sum, meal) => 
        sum + (Number(meal.totalCalories) || 0), 0
      );

      stats.dailyStats.push({
        date: dateStr,
        meals: dailyMeals.length,
        calories: dailyCalories,
      });
    }

    return stats;
  }

  /**
   * Thống kê dinh dưỡng theo tháng
   */
  async getMonthlyStats(userId: number, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Ngày cuối cùng của tháng

    const meals = await this.findByDateRange(
      userId, 
      startDate.toISOString().split('T')[0], 
      endDate.toISOString().split('T')[0]
    );
    
    const stats = {
      year,
      month,
      totalMeals: meals.length,
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalFiber: 0,
      totalSugar: 0,
      totalSodium: 0,
      averageCaloriesPerDay: 0,
      averageMealsPerDay: 0,
      daysWithMeals: 0,
    };

    // Tính tổng dinh dưỡng
    meals.forEach(meal => {
      stats.totalCalories += Number(meal.totalCalories) || 0;
      stats.totalProtein += Number(meal.totalProtein) || 0;
      stats.totalCarbs += Number(meal.totalCarbs) || 0;
      stats.totalFat += Number(meal.totalFat) || 0;
      stats.totalFiber += Number(meal.totalFiber) || 0;
      stats.totalSugar += Number(meal.totalSugar) || 0;
      stats.totalSodium += Number(meal.totalSodium) || 0;
    });

    // Tính các chỉ số trung bình
    const daysInMonth = endDate.getDate();
    stats.averageCaloriesPerDay = stats.totalCalories / daysInMonth;
    stats.averageMealsPerDay = stats.totalMeals / daysInMonth;

    // Đếm số ngày có bữa ăn
    const uniqueDays = new Set(
      meals.map(meal => meal.date.toISOString().split('T')[0])
    );
    stats.daysWithMeals = uniqueDays.size;

    return stats;
  }

  /**
   * Tính toán tỷ lệ dinh dưỡng dựa trên đơn vị đo
   */
  private calculateRatio(quantity: number, unit: string, servingSize: number, servingUnit: string): number {
    // Chuyển đổi về đơn vị chuẩn để tính ratio
    const quantityInStandardUnit = this.convertToStandardUnit(quantity, unit);
    const servingSizeInStandardUnit = this.convertToStandardUnit(servingSize, servingUnit);
    
    return quantityInStandardUnit / servingSizeInStandardUnit;
  }

  /**
   * Chuyển đổi về đơn vị chuẩn (gram cho khối lượng, ml cho thể tích)
   */
  private convertToStandardUnit(quantity: number, unit: string): number {
    const unitLower = unit.toLowerCase();
    
    // Chuyển đổi khối lượng
    if (unitLower === 'kg') return quantity * 1000;
    if (unitLower === 'g' || unitLower === 'gram') return quantity;
    if (unitLower === 'mg') return quantity / 1000;
    
    // Chuyển đổi thể tích
    if (unitLower === 'l' || unitLower === 'liter') return quantity * 1000;
    if (unitLower === 'ml' || unitLower === 'milliliter') return quantity;
    
    // Đơn vị đếm (piece, slice, etc.) - giả sử 1 piece = 100g
    if (unitLower === 'piece' || unitLower === 'pieces' || 
        unitLower === 'slice' || unitLower === 'slices' ||
        unitLower === 'quả' || unitLower === 'cái' || unitLower === 'miếng') {
      return quantity * 100; // Giả định 1 piece = 100g
    }
    
    // Mặc định trả về quantity nếu không nhận diện được đơn vị
    return quantity;
  }

  /**
   * Cập nhật tổng dinh dưỡng của bữa ăn
   */
  private async updateMealNutrition(mealId: number): Promise<void> {
    const mealFoods = await this.mealFoodRepository.find({
      where: { mealId, isDeleted: false },
    });

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;
    let totalSugar = 0;
    let totalSodium = 0;

    mealFoods.forEach(mealFood => {
      totalCalories += Number(mealFood.calories) || 0;
      totalProtein += Number(mealFood.protein) || 0;
      totalCarbs += Number(mealFood.carbs) || 0;
      totalFat += Number(mealFood.fat) || 0;
      totalFiber += Number(mealFood.fiber) || 0;
      totalSugar += Number(mealFood.sugar) || 0;
      totalSodium += Number(mealFood.sodium) || 0;
    });

    await this.mealRepository.update(mealId, {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      totalFiber,
      totalSugar,
      totalSodium,
    });
  }
} 