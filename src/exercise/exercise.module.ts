import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { ExerciseTemplate } from './entities/exercise-template.entity';
import { ExerciseSession } from './entities/exercise-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExerciseTemplate, ExerciseSession])],
  controllers: [ExerciseController],
  providers: [ExerciseService],
  exports: [ExerciseService],
})
export class ExerciseModule {} 