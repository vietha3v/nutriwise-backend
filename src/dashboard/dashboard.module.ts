import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Meal } from '../meal/entities/meal.entity';
import { WaterIntake } from '../water/entities/water-intake.entity';
import { Exercise } from '../exercise/entities/exercise.entity';
import { NutritionGoal } from '../nutrition-goal/entities/nutrition-goal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meal, WaterIntake, Exercise, NutritionGoal])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {} 