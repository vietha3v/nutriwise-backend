import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AiAssistantController } from './ai-assistant.controller';
import { AiAssistantService } from './ai-assistant.service';
import { AISemanticService } from './services/ai-semantic.service';
import { MediaAnalysisService } from './services/media-analysis.service';
import { MediaDetectionService } from './services/media-detection.service';
import { ChatMessage } from './entities/chat-message.entity';
import { UserPlatform } from './entities/user-platform.entity';
import { User } from '../user/entities/user.entity';
import { ProfileModule } from '../profile/profile.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMessage, UserPlatform, User]),
    ConfigModule,
    ProfileModule,
    SettingsModule,
  ],
  controllers: [AiAssistantController],
  providers: [AiAssistantService, AISemanticService, MediaAnalysisService, MediaDetectionService],
  exports: [AiAssistantService],
})
export class AiAssistantModule {}
