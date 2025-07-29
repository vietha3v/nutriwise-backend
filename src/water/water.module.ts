import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaterIntake } from './entities/water-intake.entity';
import { WaterService } from './water.service';
import { WaterController } from './water.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WaterIntake])],
  controllers: [WaterController],
  providers: [WaterService],
  exports: [WaterService],
})
export class WaterModule {} 