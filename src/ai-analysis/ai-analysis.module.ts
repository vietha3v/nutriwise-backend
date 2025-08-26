import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiAnalysisController } from './ai-analysis.controller';
import { AiAnalysisService } from './ai-analysis.service';
import { AiCache } from './entities/ai-cache.entity';
import { WaterModule } from '../water/water.module';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AiCache]),
    WaterModule,
    forwardRef(() => ProfileModule)
  ],
  controllers: [AiAnalysisController],
  providers: [AiAnalysisService],
  exports: [AiAnalysisService],
})
export class AiAnalysisModule {} 