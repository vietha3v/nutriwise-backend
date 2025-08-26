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

  async findAll(userId?: number): Promise<Exercise[]> {
    const whereCondition: any = { isDeleted: false };
    if (userId) {
      whereCondition.userId = userId;
    }
    
    return await this.exerciseRepository.find({
      where: whereCondition,
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

  async getExerciseGoals(userId: number): Promise<any> {
    // Lấy profile người dùng để xem mục tiêu tập luyện
    const profile = await this.profileRepository.findOne({ where: { userId } });
    
    // Lấy các bài tập gần đây
    const recentExercises = await this.exerciseRepository.find({
      where: { userId, isDeleted: false },
      order: { createdAt: 'DESC' },
      take: 10,
    });

    // Tính toán thống kê cơ bản
    const totalExercises = recentExercises.length;
    const totalCaloriesBurned = recentExercises.reduce((sum, exercise) => sum + (exercise.caloriesBurned || 0), 0);
    const averageCaloriesPerExercise = totalExercises > 0 ? totalCaloriesBurned / totalExercises : 0;

    return {
      profile: {
        goalType: profile?.goalType || 'maintenance',
        activityLevel: profile?.activityLevel || 'moderate',
      },
      goals: {
        weeklyWorkouts: 3, // Mục tiêu mặc định
        weeklyCalories: 1500, // Mục tiêu mặc định
        currentWeekProgress: {
          workoutsCompleted: totalExercises,
          caloriesBurned: totalCaloriesBurned,
        },
      },
      recentActivity: {
        totalExercises,
        totalCaloriesBurned,
        averageCaloriesPerExercise,
        exercises: recentExercises.map(exercise => ({
          id: exercise.id,
          name: exercise.name,
          duration: exercise.duration,
          caloriesBurned: exercise.caloriesBurned,
          date: exercise.date,
        })),
      },
      recommendations: [
        'Tập luyện đều đặn 3-5 lần/tuần',
        'Kết hợp cardio và strength training',
        'Nghỉ ngơi đầy đủ giữa các buổi tập',
      ],
    };
  }
} 