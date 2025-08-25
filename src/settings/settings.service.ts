import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSettings } from './entities/user-settings.entity';
import { AIPersonality, AIStyle, AITone, NotificationType, Theme, Language } from '../common/enums/settings.enum';
import { UpdateSettingsDto, SettingsResponseDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(UserSettings)
    private settingsRepository: Repository<UserSettings>,
  ) {}

  async getSettings(userId: number): Promise<SettingsResponseDto> {
    let settings = await this.settingsRepository.findOne({
      where: { userId }
    });

    if (!settings) {
      // Tạo settings mặc định nếu chưa có
      settings = await this.createDefaultSettings(userId);
    }

    return this.mapToResponseDto(settings);
  }

  async findOne(id: number, userId: number): Promise<UserSettings> {
    const settings = await this.settingsRepository.findOne({
      where: { id, userId }
    });
    
    if (!settings) {
      throw new NotFoundException(`Settings with ID ${id} not found`);
    }

    return settings;
  }

  async updateSettings(userId: number, updateSettingsDto: UpdateSettingsDto): Promise<SettingsResponseDto> {
    let settings = await this.settingsRepository.findOne({
      where: { userId }
    });

    if (!settings) {
      settings = await this.createDefaultSettings(userId);
    }

    // Cập nhật AI settings
    if (updateSettingsDto.ai) {
      Object.assign(settings, updateSettingsDto.ai);
    }

    // Cập nhật notification settings
    if (updateSettingsDto.notifications) {
      Object.assign(settings, updateSettingsDto.notifications);
    }

    // Cập nhật UI settings
    if (updateSettingsDto.ui) {
      Object.assign(settings, updateSettingsDto.ui);
    }

    // Cập nhật privacy settings
    if (updateSettingsDto.privacy) {
      Object.assign(settings, updateSettingsDto.privacy);
    }

    const updatedSettings = await this.settingsRepository.save(settings);
    return this.mapToResponseDto(updatedSettings);
  }

  async updateAISettings(userId: number, aiSettings: any): Promise<SettingsResponseDto> {
    let settings = await this.settingsRepository.findOne({
      where: { userId }
    });

    if (!settings) {
      settings = await this.createDefaultSettings(userId);
    }

    Object.assign(settings, aiSettings);
    const updatedSettings = await this.settingsRepository.save(settings);
    return this.mapToResponseDto(updatedSettings);
  }

  async updateNotificationSettings(userId: number, notificationSettings: any): Promise<SettingsResponseDto> {
    let settings = await this.settingsRepository.findOne({
      where: { userId }
    });

    if (!settings) {
      settings = await this.createDefaultSettings(userId);
    }

    Object.assign(settings, notificationSettings);
    const updatedSettings = await this.settingsRepository.save(settings);
    return this.mapToResponseDto(updatedSettings);
  }

  async updateUISettings(userId: number, uiSettings: any): Promise<SettingsResponseDto> {
    let settings = await this.settingsRepository.findOne({
      where: { userId }
    });

    if (!settings) {
      settings = await this.createDefaultSettings(userId);
    }

    Object.assign(settings, uiSettings);
    const updatedSettings = await this.settingsRepository.save(settings);
    return this.mapToResponseDto(updatedSettings);
  }

  async updatePrivacySettings(userId: number, privacySettings: any): Promise<SettingsResponseDto> {
    let settings = await this.settingsRepository.findOne({
      where: { userId }
    });

    if (!settings) {
      settings = await this.createDefaultSettings(userId);
    }

    Object.assign(settings, privacySettings);
    const updatedSettings = await this.settingsRepository.save(settings);
    return this.mapToResponseDto(updatedSettings);
  }

  async resetToDefaults(userId: number): Promise<SettingsResponseDto> {
    const settings = await this.settingsRepository.findOne({
      where: { userId }
    });

    if (settings) {
      await this.settingsRepository.remove(settings);
    }

    const defaultSettings = await this.createDefaultSettings(userId);
    return this.mapToResponseDto(defaultSettings);
  }

  private async createDefaultSettings(userId: number): Promise<UserSettings> {
    const defaultSettings = new UserSettings();
    defaultSettings.userId = userId;
    
    // AI settings mặc định
    defaultSettings.aiPersonality = 'cute';
    defaultSettings.aiStyle = 'gen_z';
    defaultSettings.aiTone = 'sweet';
    defaultSettings.aiUseEmojis = true;
    defaultSettings.aiUseNicknames = true;
    defaultSettings.aiUseGenZSlang = true;
    defaultSettings.aiShowPersonalizedReactions = true;
         defaultSettings.aiCustomName = 'Mẫn Nhi';
    defaultSettings.aiCustomPreferences = {
      favoriteEmojis: ['😊', '🌟', '💪', '💧', '🍎', '🏃‍♀️'],
      favoriteColors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
      communicationStyle: 'friendly',
      responseLength: 'medium',
      detailLevel: 'detailed'
    };
    
    // Notification settings mặc định
    defaultSettings.notificationsEnabled = true;
    defaultSettings.notificationTypes = [NotificationType.EMAIL, NotificationType.IN_APP];
    defaultSettings.waterReminders = true;
    defaultSettings.mealReminders = true;
    defaultSettings.exerciseReminders = true;
    defaultSettings.goalReminders = true;
    defaultSettings.reminderStartTime = '08:00';
    defaultSettings.reminderEndTime = '22:00';
    
         // UI settings mặc định
     defaultSettings.theme = 'auto';
     defaultSettings.language = 'vi';
    defaultSettings.showTips = true;
    defaultSettings.showTutorials = true;
    defaultSettings.showProgressAnimations = true;
    
    // Privacy settings mặc định
    defaultSettings.shareDataForResearch = false;
    defaultSettings.allowPersonalizedAds = true;
    defaultSettings.allowAnalytics = true;

    return await this.settingsRepository.save(defaultSettings);
  }

  mapToResponseDto(settings: UserSettings): SettingsResponseDto {
    return {
      id: settings.id,
      userId: settings.userId,
      
      // AI Settings
      aiPersonality: settings.aiPersonality,
      aiStyle: settings.aiStyle,
      aiTone: settings.aiTone,
      aiUseEmojis: settings.aiUseEmojis,
      aiUseNicknames: settings.aiUseNicknames,
      aiUseGenZSlang: settings.aiUseGenZSlang,
      aiShowPersonalizedReactions: settings.aiShowPersonalizedReactions,
      aiCustomName: settings.aiCustomName,
      aiCustomPreferences: settings.aiCustomPreferences,

      // Notification Settings
      notificationsEnabled: settings.notificationsEnabled,
      notificationTypes: settings.notificationTypes,
      waterReminders: settings.waterReminders,
      mealReminders: settings.mealReminders,
      exerciseReminders: settings.exerciseReminders,
      goalReminders: settings.goalReminders,
      reminderStartTime: settings.reminderStartTime,
      reminderEndTime: settings.reminderEndTime,

      // UI Settings
      theme: settings.theme,
      language: settings.language,
      showTips: settings.showTips,
      showTutorials: settings.showTutorials,
      showProgressAnimations: settings.showProgressAnimations,

      // Privacy Settings
      shareDataForResearch: settings.shareDataForResearch,
      allowPersonalizedAds: settings.allowPersonalizedAds,
      allowAnalytics: settings.allowAnalytics,

      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt
    };
  }
}
