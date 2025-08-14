import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Meal } from '../meal/entities/meal.entity';
import { WaterIntake } from '../water/entities/water-intake.entity';
import { Exercise } from '../exercise/entities/exercise.entity';
import { Goal } from '../goals/entities/goal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meal, WaterIntake, Exercise, Goal])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {} 