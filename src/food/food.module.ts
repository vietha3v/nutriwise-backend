import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { Food } from './entities/food.entity';
import { UserFoodPreference } from './entities/user-food-preference.entity';
import { DailyFoodAvailability } from './entities/daily-food-availability.entity';
import { MealSuggestion } from './entities/meal-suggestion.entity';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Food,
      UserFoodPreference,
      DailyFoodAvailability,
      MealSuggestion,
    ]),
    ProfileModule
  ],
  controllers: [FoodController],
  providers: [FoodService],
  exports: [FoodService],
})
export class FoodModule {} 