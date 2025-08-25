import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Controllers
import { AppController } from './app.controller';

// Services
import { AppService } from './app.service';

// Entities
import { User } from './user/entities/user.entity';
import { Profile } from './profile/entities/profile.entity';
import { Meal } from './meal/entities/meal.entity';
import { MealFood } from './meal/entities/meal-food.entity';
import { WaterIntake } from './water/entities/water-intake.entity';
import { Exercise } from './exercise/entities/exercise.entity';
import { Goal } from './goals/entities/goal.entity';

import { AiCache } from './ai-analysis/entities/ai-cache.entity';
import { UserPlatform } from './ai-assistant/entities/user-platform.entity';
import { ChatMessage } from './ai-assistant/entities/chat-message.entity';
import { Food } from './food/entities/food.entity';
import { UserFoodPreference } from './food/entities/user-food-preference.entity';
import { DailyFoodAvailability } from './food/entities/daily-food-availability.entity';
import { MealSuggestion } from './food/entities/meal-suggestion.entity';
import { UserSettings } from './settings/entities/user-settings.entity';

// Feature modules
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { MealModule } from './meal/meal.module';
import { WaterModule } from './water/water.module';
import { ExerciseModule } from './exercise/exercise.module';
import { GoalsModule } from './goals/goals.module';

import { EmailModule } from './email/email.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AiAnalysisModule } from './ai-analysis/ai-analysis.module';
import { AiAssistantModule } from './ai-assistant/ai-assistant.module';
import { FoodModule } from './food/food.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'password',
      database: process.env.DATABASE_NAME || 'nutriwise',
      entities: [
        User, 
        Profile, 
        Meal, 
        MealFood, 
        WaterIntake, 
        Exercise, 
        Goal,
        AiCache,
        UserPlatform,
        ChatMessage,
        Food,
        UserFoodPreference,
        DailyFoodAvailability,
        MealSuggestion,
        UserSettings,
      ],
      synchronize: true,
      logging: process.env.DEBUG_DATABASE === 'true',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION_TIME || '7d'
      },
    }),
    PassportModule,

    // Feature modules
    AuthModule,
    UserModule,
    ProfileModule,
    MealModule,
    WaterModule,
    ExerciseModule,
    GoalsModule,

    EmailModule,
    DashboardModule,
    AiAnalysisModule,
    AiAssistantModule,
    FoodModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 