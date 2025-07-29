import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NutritionGoalService } from './nutrition-goal.service';
import { NutritionGoalController } from './nutrition-goal.controller';
import { NutritionGoal } from './entities/nutrition-goal.entity';
import { Profile } from '../profile/entities/profile.entity';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([NutritionGoal, Profile]), AiModule],
  controllers: [NutritionGoalController],
  providers: [NutritionGoalService],
  exports: [NutritionGoalService],
})
export class NutritionGoalModule {} 