import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Profile } from './entities/profile.entity';
import { AiAnalysisModule } from '../ai-analysis/ai-analysis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), forwardRef(() => AiAnalysisModule)],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService,TypeOrmModule],
})
export class ProfileModule {} 