import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal, GoalStatus, GoalType } from './entities/goal.entity';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private goalRepository: Repository<Goal>,
  ) {}

  async create(userId: number, createGoalDto: CreateGoalDto): Promise<Goal> {
    const goal = this.goalRepository.create({
      ...createGoalDto,
      userId,
      startDate: new Date(createGoalDto.startDate),
      targetDate: createGoalDto.targetDate ? new Date(createGoalDto.targetDate) : undefined,
    });
    
    return await this.goalRepository.save(goal);
  }

  async findAll(userId: number): Promise<Goal[]> {
    return await this.goalRepository.find({
      where: { userId },
      order: { priority: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(userId: number, id: number): Promise<Goal> {
    const goal = await this.goalRepository.findOne({
      where: { id, userId },
    });

    if (!goal) {
      throw new NotFoundException('Không tìm thấy mục tiêu');
    }

    return goal;
  }

  async update(userId: number, id: number, updateGoalDto: UpdateGoalDto): Promise<Goal> {
    const goal = await this.findOne(userId, id);

    // Xử lý ngày tháng
    const updateData: any = { ...updateGoalDto };
    if (updateGoalDto.startDate) {
      updateData.startDate = new Date(updateGoalDto.startDate);
    }
    if (updateGoalDto.targetDate) {
      updateData.targetDate = new Date(updateGoalDto.targetDate);
    }

    Object.assign(goal, updateData);
    return await this.goalRepository.save(goal);
  }

  async remove(userId: number, id: number): Promise<void> {
    const goal = await this.findOne(userId, id);
    await this.goalRepository.remove(goal);
  }

  async updatePriority(userId: number, id: number, priority: number): Promise<Goal> {
    if (priority < 1 || priority > 10) {
      throw new BadRequestException('Priority phải từ 1 đến 10');
    }

    const goal = await this.findOne(userId, id);
    goal.priority = priority;
    return await this.goalRepository.save(goal);
  }

  async updateStatus(userId: number, id: number, status: GoalStatus): Promise<Goal> {
    const goal = await this.findOne(userId, id);
    goal.status = status;
    return await this.goalRepository.save(goal);
  }

  async getActiveGoals(userId: number): Promise<Goal[]> {
    return await this.goalRepository.find({
      where: { userId, status: GoalStatus.ACTIVE },
      order: { priority: 'ASC', createdAt: 'DESC' },
    });
  }

  async getGoalsByType(userId: number, goalType: GoalType): Promise<Goal[]> {
    return await this.goalRepository.find({
      where: { userId, goalType },
      order: { priority: 'ASC', createdAt: 'DESC' },
    });
  }
}
