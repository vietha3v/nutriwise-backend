import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NutritionGoal } from './entities/nutrition-goal.entity';
import { CreateNutritionGoalDto } from './dto/create-nutrition-goal.dto';
import { UpdateNutritionGoalDto } from './dto/update-nutrition-goal.dto';
import { Profile } from '../profile/entities/profile.entity';
import { AiService } from '../ai/ai.service';

@Injectable()
export class NutritionGoalService {
  constructor(
    @InjectRepository(NutritionGoal)
    private nutritionGoalRepository: Repository<NutritionGoal>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private aiService: AiService,
  ) {}

  async create(createNutritionGoalDto: CreateNutritionGoalDto, userId: number): Promise<NutritionGoal> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
    
    const nutritionGoal = this.nutritionGoalRepository.create({
      ...createNutritionGoalDto,
      userId,
    });

    return await this.nutritionGoalRepository.save(nutritionGoal);
  }

  async findAll(userId: number): Promise<NutritionGoal[]> {
    return await this.nutritionGoalRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<NutritionGoal> {
    const nutritionGoal = await this.nutritionGoalRepository.findOne({
      where: { id, userId },
    });
    if (!nutritionGoal) {
      throw new Error('Không tìm thấy mục tiêu dinh dưỡng');
    }
    return nutritionGoal;
  }

  async update(id: number, updateNutritionGoalDto: UpdateNutritionGoalDto, userId: number): Promise<NutritionGoal> {
    const nutritionGoal = await this.findOne(id, userId);
    Object.assign(nutritionGoal, updateNutritionGoalDto);
    return await this.nutritionGoalRepository.save(nutritionGoal);
  }

  async remove(id: number, userId: number): Promise<void> {
    const nutritionGoal = await this.findOne(id, userId);
    await this.nutritionGoalRepository.remove(nutritionGoal);
  }

  async calculatePersonalizedGoals(userId: number): Promise<any> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) {
      throw new Error('Không tìm thấy hồ sơ người dùng');
    }

    const nutritionGoals = await this.nutritionGoalRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 10,
    });

    const recommendations = this.aiService.calculateNutritionGoals(userId);

    return {
      profile,
      nutritionGoals,
      recommendations,
    };
  }
} 