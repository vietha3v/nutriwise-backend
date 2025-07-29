import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meal } from './entities/meal.entity';
import { MealFood } from './entities/meal-food.entity';

@Injectable()
export class MealService {
  constructor(
    @InjectRepository(Meal)
    private mealRepository: Repository<Meal>,
    @InjectRepository(MealFood)
    private mealFoodRepository: Repository<MealFood>,
  ) {}

  async create(createMealDto: any): Promise<Meal> {
    const meal = new Meal();
    Object.assign(meal, {
      ...createMealDto,
      date: new Date(createMealDto.date), // Convert string to Date
    });
    return await this.mealRepository.save(meal);
  }

  async findAll(): Promise<Meal[]> {
    return await this.mealRepository.find({
      where: { isDeleted: false },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Meal> {
    const meal = await this.mealRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }
    return meal;
  }

  async update(id: number, updateMealDto: any): Promise<Meal> {
    const meal = await this.findOne(id);
    Object.assign(meal, {
      ...updateMealDto,
      date: updateMealDto.date ? new Date(updateMealDto.date) : meal.date, // Convert string to Date
    });
    return await this.mealRepository.save(meal);
  }

  async remove(id: number): Promise<void> {
    const meal = await this.findOne(id);
    meal.isDeleted = true;
    await this.mealRepository.save(meal);
  }
} 