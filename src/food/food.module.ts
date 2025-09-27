import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { FoodAiService } from './services/food-ai.service';
import { Food } from './entities/food.entity';
import { UserFoodPreference } from './entities/user-food-preference.entity';
// import { PantryItem } from './entities/pantry-item.entity';
import { AiAssistantModule } from '../ai-assistant/ai-assistant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Food, UserFoodPreference]),
    ConfigModule,
    AiAssistantModule,
  ],
  controllers: [FoodController],
  providers: [FoodService, FoodAiService],
  exports: [FoodService],
})
export class FoodModule {} 