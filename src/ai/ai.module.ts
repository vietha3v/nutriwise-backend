import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { AiCache } from './entities/ai-cache.entity';
import { Profile } from '../profile/entities/profile.entity';
import { Meal } from '../meal/entities/meal.entity';
import { Exercise } from '../exercise/entities/exercise.entity';
import { Goal } from '../goals/entities/goal.entity';
import { FoodModule } from '../food/food.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AiCache,
      Profile,
      Meal,
      Exercise,
      Goal,
    ]),
    FoodModule,
  ],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {} 