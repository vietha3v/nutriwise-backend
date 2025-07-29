import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Meal } from '../meal/entities/meal.entity';
import { WaterIntake } from '../water/entities/water-intake.entity';
import { Exercise } from '../exercise/entities/exercise.entity';
import { NutritionGoal } from '../nutrition-goal/entities/nutrition-goal.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Meal)
    private mealRepository: Repository<Meal>,
    @InjectRepository(WaterIntake)
    private waterIntakeRepository: Repository<WaterIntake>,
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
    @InjectRepository(NutritionGoal)
    private nutritionGoalRepository: Repository<NutritionGoal>,
  ) {}

  async getDashboardData(userId: number): Promise<any> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    // Lấy dữ liệu bữa ăn hôm nay
    const todayMeals = await this.mealRepository.find({
      where: {
        userId,
        date: today,
        isDeleted: false,
      },
    });

    // Lấy dữ liệu nước uống hôm nay
    const todayWaterIntake = await this.waterIntakeRepository.find({
      where: {
        userId,
        date: today,
        isDeleted: false,
      },
    });

    // Lấy dữ liệu tập luyện hôm nay
    const todayExercises = await this.exerciseRepository.find({
      where: {
        userId,
        date: today,
        isDeleted: false,
      },
    });

    // Lấy mục tiêu dinh dưỡng hiện tại
    const currentGoal = await this.nutritionGoalRepository.findOne({
      where: {
        userId,
        isActive: true,
        isDeleted: false,
      },
      order: { createdAt: 'DESC' },
    });

    // Tính toán tổng calo tiêu thụ hôm nay
    const totalCaloriesConsumed = todayMeals.reduce((sum, meal) => sum + meal.totalCalories, 0);
    const totalProteinConsumed = todayMeals.reduce((sum, meal) => sum + meal.totalProtein, 0);
    const totalCarbsConsumed = todayMeals.reduce((sum, meal) => sum + meal.totalCarbs, 0);
    const totalFatConsumed = todayMeals.reduce((sum, meal) => sum + meal.totalFat, 0);

    // Tính toán tổng calo đốt cháy hôm nay
    const totalCaloriesBurned = todayExercises.reduce((sum, exercise) => sum + exercise.caloriesBurned, 0);

    // Tính toán tổng nước uống hôm nay
    const totalWaterIntake = todayWaterIntake.reduce((sum, water) => sum + water.amount, 0);

    // Tính toán net calo
    const netCalories = totalCaloriesConsumed - totalCaloriesBurned;

    return {
      today: {
        date: today,
        meals: todayMeals,
        waterIntake: todayWaterIntake,
        exercises: todayExercises,
        nutrition: {
          caloriesConsumed: totalCaloriesConsumed,
          caloriesBurned: totalCaloriesBurned,
          netCalories,
          protein: totalProteinConsumed,
          carbs: totalCarbsConsumed,
          fat: totalFatConsumed,
          waterIntake: totalWaterIntake,
        },
      },
      currentGoal,
      progress: this.calculateProgress(totalCaloriesConsumed, totalWaterIntake, currentGoal),
    };
  }

  private calculateProgress(caloriesConsumed: number, waterIntake: number, goal: any): any {
    if (!goal) {
      return {
        caloriesProgress: 0,
        waterProgress: 0,
        message: 'No active goal found',
      };
    }

    const caloriesProgress = Math.min((caloriesConsumed / goal.dailyCalorieGoal) * 100, 100);
    const waterProgress = Math.min((waterIntake / goal.dailyWaterGoal) * 100, 100);

    return {
      caloriesProgress,
      waterProgress,
      caloriesRemaining: Math.max(goal.dailyCalorieGoal - caloriesConsumed, 0),
      waterRemaining: Math.max(goal.dailyWaterGoal - waterIntake, 0),
    };
  }

  async getWeeklyReport(userId: number): Promise<any> {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Lấy dữ liệu 7 ngày qua
    const weeklyMeals = await this.mealRepository.find({
      where: {
        userId,
        date: Between(weekAgo, today),
        isDeleted: false,
      },
    });

    const weeklyExercises = await this.exerciseRepository.find({
      where: {
        userId,
        date: Between(weekAgo, today),
        isDeleted: false,
      },
    });

    const weeklyWaterIntake = await this.waterIntakeRepository.find({
      where: {
        userId,
        date: Between(weekAgo, today),
        isDeleted: false,
      },
    });

    // Tính toán trung bình hàng ngày
    const avgDailyCalories = weeklyMeals.reduce((sum, meal) => sum + meal.totalCalories, 0) / 7;
    const avgDailyCaloriesBurned = weeklyExercises.reduce((sum, ex) => sum + ex.caloriesBurned, 0) / 7;
    const avgDailyWaterIntake = weeklyWaterIntake.reduce((sum, water) => sum + water.amount, 0) / 7;

    return {
      period: {
        start: weekAgo,
        end: today,
      },
      averages: {
        dailyCalories: avgDailyCalories,
        dailyCaloriesBurned: avgDailyCaloriesBurned,
        dailyWaterIntake: avgDailyWaterIntake,
        netCalories: avgDailyCalories - avgDailyCaloriesBurned,
      },
      totals: {
        totalMeals: weeklyMeals.length,
        totalExercises: weeklyExercises.length,
        totalWaterIntake: weeklyWaterIntake.reduce((sum, water) => sum + water.amount, 0),
      },
    };
  }
} 