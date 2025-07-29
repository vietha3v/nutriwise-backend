import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from './entities/meal.entity';
import { MealFood } from './entities/meal-food.entity';
import { MealService } from './meal.service';
import { MealController } from './meal.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Meal, MealFood])],
  controllers: [MealController],
  providers: [MealService],
  exports: [MealService],
})
export class MealModule {} 