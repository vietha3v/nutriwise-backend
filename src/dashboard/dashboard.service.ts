import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Meal } from '../meal/entities/meal.entity';
import { WaterIntake } from '../water/entities/water-intake.entity';
import { ExerciseSession } from '../exercise/entities/exercise-session.entity';
import { Goal, GoalStatus } from '../goals/entities/goal.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Meal)
    private mealRepository: Repository<Meal>,
    @InjectRepository(WaterIntake)
    private waterIntakeRepository: Repository<WaterIntake>,
    @InjectRepository(ExerciseSession)
    private exerciseSessionRepository: Repository<ExerciseSession>,
    @InjectRepository(Goal)
    private goalRepository: Repository<Goal>,
  ) {}

  async getDashboardData(userId: number): Promise<any> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    // Get today's meal data
    const todayMeals = await this.mealRepository.find({
      where: {
        userId,
        date: today,
        isDeleted: false,
      },
    });

    // Get today's water intake data
    const todayWaterIntake = await this.waterIntakeRepository.find({
      where: {
        userId,
        datetime: Between(startOfDay, endOfDay),
        isDeleted: false,
      },
    });

    // Get today's exercise data
    const todayExercises = await this.exerciseSessionRepository.find({
      where: {
        userId,
        startedAt: Between(startOfDay, endOfDay),
      },
    });

    // Get current goal
    const currentGoal = await this.goalRepository.findOne({
      where: {
        userId,
        status: GoalStatus.ACTIVE,
      },
      order: { createdAt: 'DESC' },
    });

    // Calculate total calories consumed today
    const totalCaloriesConsumed = todayMeals.reduce((sum, meal) => sum + meal.totalCalories, 0);
    const totalProteinConsumed = todayMeals.reduce((sum, meal) => sum + meal.totalProtein, 0);
    const totalCarbsConsumed = todayMeals.reduce((sum, meal) => sum + meal.totalCarbs, 0);
    const totalFatConsumed = todayMeals.reduce((sum, meal) => sum + meal.totalFat, 0);

    // Calculate total calories burned today
    const totalCaloriesBurned = todayExercises.reduce((sum, session) => sum + session.caloriesBurned, 0);

    // Calculate total water intake today
    const totalWaterIntake = todayWaterIntake.reduce((sum, water) => sum + water.amount, 0);

    // Calculate net calories
    const netCalories = totalCaloriesConsumed - totalCaloriesBurned;

    return {
      today: {
        date: today,
        meals: todayMeals,
        waterIntake: todayWaterIntake,
        exerciseSessions: todayExercises,
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

    // Get data for the last 7 days
    const weeklyMeals = await this.mealRepository.find({
      where: {
        userId,
        date: Between(weekAgo, today),
        isDeleted: false,
      },
    });

    const weeklyExercises = await this.exerciseSessionRepository.find({
      where: {
        userId,
        startedAt: Between(weekAgo, today),
      },
    });

    const weeklyWaterIntake = await this.waterIntakeRepository.find({
      where: {
        userId,
        datetime: Between(weekAgo, today),
        isDeleted: false,
      },
    });

    // Calculate average daily values
    const avgDailyCalories = weeklyMeals.reduce((sum, meal) => sum + meal.totalCalories, 0) / 7;
    const avgDailyCaloriesBurned = weeklyExercises.reduce((sum, session) => sum + session.caloriesBurned, 0) / 7;
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
        totalExerciseSessions: weeklyExercises.length,
        totalWaterIntake: weeklyWaterIntake.reduce((sum, water) => sum + water.amount, 0),
      },
    };
  }
} 