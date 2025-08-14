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

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMessage, UserPlatform, User]),
    ConfigModule,
  ],
  controllers: [AiAssistantController],
  providers: [AiAssistantService, AISemanticService, MediaAnalysisService, MediaDetectionService],
  exports: [AiAssistantService],
})
export class AiAssistantModule {}
