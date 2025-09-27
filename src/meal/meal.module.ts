import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealController } from './meal.controller';
import { MealService } from './meal.service';
import { Meal } from './entities/meal.entity';
import { MealFood } from './entities/meal-food.entity';
import { Food } from '../food/entities/food.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Meal,
      MealFood,
      Food,
    ]),
  ],
  controllers: [MealController],
  providers: [MealService],
  exports: [MealService],
})
export class MealModule {} 