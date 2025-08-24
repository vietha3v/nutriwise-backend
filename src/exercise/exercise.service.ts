import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './entities/exercise.entity';
import { Profile } from '../profile/entities/profile.entity';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async create(createExerciseDto: any): Promise<Exercise> {
    const exercise = new Exercise();
    Object.assign(exercise, {
      ...createExerciseDto,
      date: new Date(createExerciseDto.date), // Convert string to Date
    });
    return await this.exerciseRepository.save(exercise);
  }

  async findAll(): Promise<Exercise[]> {
    return await this.exerciseRepository.find({
      where: { isDeleted: false },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Exercise> {
    const exercise = await this.exerciseRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }
    return exercise;
  }

  async update(id: number, updateExerciseDto: any): Promise<Exercise> {
    const exercise = await this.findOne(id);
    Object.assign(exercise, {
      ...updateExerciseDto,
      date: updateExerciseDto.date ? new Date(updateExerciseDto.date) : exercise.date, // Convert string to Date
    });
    return await this.exerciseRepository.save(exercise);
  }

  async remove(id: number): Promise<void> {
    const exercise = await this.findOne(id);
    exercise.isDeleted = true;
    await this.exerciseRepository.save(exercise);
  }


} 