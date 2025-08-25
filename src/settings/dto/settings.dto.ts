import { IsEnum, IsBoolean, IsOptional, IsString, IsArray, ValidateNested, Matches, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { AIPersonality, AIStyle, AITone, NotificationType, Theme, Language } from '../../common/enums/settings.enum';

export class AICustomPreferencesDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  favoriteEmojis?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  favoriteColors?: string[];

  @IsOptional()
  @IsString()
  communicationStyle?: string;

  @IsOptional()
  @IsString()
  responseLength?: 'short' | 'medium' | 'long';

  @IsOptional()
  @IsString()
  detailLevel?: 'basic' | 'detailed' | 'expert';
}

export class UpdateAISettingsDto {
  @IsOptional()
  @IsString()
  aiPersonality?: string;

  @IsOptional()
  @IsString()
  aiStyle?: string;

  @IsOptional()
  @IsString()
  aiTone?: string;

  @IsOptional()
  @IsBoolean()
  aiUseEmojis?: boolean;

  @IsOptional()
  @IsBoolean()
  aiUseNicknames?: boolean;

  @IsOptional()
  @IsBoolean()
  aiUseGenZSlang?: boolean;

  @IsOptional()
  @IsBoolean()
  aiShowPersonalizedReactions?: boolean;

  @IsOptional()
  @IsString()
  aiCustomName?: string;



  @IsOptional()
  @ValidateNested()
  @Type(() => AICustomPreferencesDto)
  aiCustomPreferences?: AICustomPreferencesDto;
}

export class UpdateNotificationSettingsDto {
  @IsOptional()
  @IsBoolean()
  notificationsEnabled?: boolean;

  @IsOptional()
  @IsArray()
  @IsEnum(NotificationType, { each: true })
  notificationTypes?: NotificationType[];

  @IsOptional()
  @IsBoolean()
  waterReminders?: boolean;

  @IsOptional()
  @IsBoolean()
  mealReminders?: boolean;

  @IsOptional()
  @IsBoolean()
  exerciseReminders?: boolean;

  @IsOptional()
  @IsBoolean()
  goalReminders?: boolean;

  @IsOptional()
  @IsDateString()
  reminderStartTime?: string;

  @IsOptional()
  @IsDateString()
  reminderEndTime?: string;
}

export class UpdateUISettingsDto {
  @IsOptional()
  @IsString()
  theme?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsBoolean()
  showTips?: boolean;

  @IsOptional()
  @IsBoolean()
  showTutorials?: boolean;

  @IsOptional()
  @IsBoolean()
  showProgressAnimations?: boolean;
}

export class UpdatePrivacySettingsDto {
  @IsOptional()
  @IsBoolean()
  shareDataForResearch?: boolean;

  @IsOptional()
  @IsBoolean()
  allowPersonalizedAds?: boolean;

  @IsOptional()
  @IsBoolean()
  allowAnalytics?: boolean;
}

export class UpdateSettingsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAISettingsDto)
  ai?: UpdateAISettingsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateNotificationSettingsDto)
  notifications?: UpdateNotificationSettingsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUISettingsDto)
  ui?: UpdateUISettingsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePrivacySettingsDto)
  privacy?: UpdatePrivacySettingsDto;
}

export class SettingsResponseDto {
  id: number;
  userId: number;
  
  // AI Settings
  aiPersonality: string;
  aiStyle: string;
  aiTone: string;
  aiUseEmojis: boolean;
  aiUseNicknames: boolean;
  aiUseGenZSlang: boolean;
  aiShowPersonalizedReactions: boolean;
  aiCustomName?: string;
  aiCustomPreferences?: AICustomPreferencesDto;

  // Notification Settings
  notificationsEnabled: boolean;
  notificationTypes: NotificationType[];
  waterReminders: boolean;
  mealReminders: boolean;
  exerciseReminders: boolean;
  goalReminders: boolean;
  reminderStartTime: string;
  reminderEndTime: string;

  // UI Settings
  theme: string;
  language: string;
  showTips: boolean;
  showTutorials: boolean;
  showProgressAnimations: boolean;

  // Privacy Settings
  shareDataForResearch: boolean;
  allowPersonalizedAds: boolean;
  allowAnalytics: boolean;

  createdAt: Date;
  updatedAt: Date;
}
