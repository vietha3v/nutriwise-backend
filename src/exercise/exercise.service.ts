import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { ExerciseTemplate } from './entities/exercise-template.entity';
import { ExerciseSession } from './entities/exercise-session.entity';
import { CreateExerciseTemplateDto } from './dto/create-exercise-template.dto';
import { CreateExerciseSessionDto } from './dto/create-exercise-session.dto';
import { ExerciseTemplateSearchDto } from './dto/exercise-template-search.dto';
import { ExerciseSessionSearchDto } from './dto/exercise-session-search.dto';
import { ExerciseStatsDto } from './dto/exercise-stats.dto';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(ExerciseTemplate)
    private exerciseTemplateRepository: Repository<ExerciseTemplate>,
    @InjectRepository(ExerciseSession)
    private exerciseSessionRepository: Repository<ExerciseSession>,
  ) {}

  // ==================== EXERCISE TEMPLATES ====================

  async findAllTemplates(searchDto: ExerciseTemplateSearchDto) {
    const {
      search,
      bodyPart,
      exerciseType,
      difficultyLevel,
      page = 1,
      limit = 20
    } = searchDto;

    const queryBuilder = this.exerciseTemplateRepository.createQueryBuilder('template');

    // Search by name or description
    if (search) {
      queryBuilder.andWhere(
        '(template.name ILIKE :search OR template.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Filter by body part
    if (bodyPart) {
      queryBuilder.andWhere('template.bodyPart = :bodyPart', { bodyPart });
    }

    // Filter by exercise type
    if (exerciseType) {
      queryBuilder.andWhere('template.exerciseType = :exerciseType', { exerciseType });
    }

    // Filter by difficulty level
    if (difficultyLevel) {
      queryBuilder.andWhere('template.difficultyLevel = :difficultyLevel', { difficultyLevel });
    }

    // Order by name
    queryBuilder.orderBy('template.name', 'ASC');

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [templates, total] = await queryBuilder.getManyAndCount();

    return {
      templates,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findTemplateById(id: number) {
    const template = await this.exerciseTemplateRepository.findOne({
      where: { id }
    });

    if (!template) {
      throw new NotFoundException(`Exercise template with ID ${id} not found`);
    }

    return template;
  }

  async createTemplate(createDto: CreateExerciseTemplateDto) {
    const template = this.exerciseTemplateRepository.create(createDto);
    return await this.exerciseTemplateRepository.save(template);
  }

  async updateTemplate(id: number, updateDto: Partial<CreateExerciseTemplateDto>) {
    const template = await this.findTemplateById(id);
    
    Object.assign(template, updateDto);
    return await this.exerciseTemplateRepository.save(template);
  }

  async deleteTemplate(id: number) {
    const template = await this.findTemplateById(id);
    await this.exerciseTemplateRepository.remove(template);
    return { success: true };
  }

  // ==================== EXERCISE SESSIONS ====================

  async findAllSessions(userId: number, searchDto: ExerciseSessionSearchDto) {
    const {
      startDate,
      endDate,
      page = 1,
      limit = 20
    } = searchDto;

    const queryBuilder = this.exerciseSessionRepository.createQueryBuilder('session')
      .leftJoinAndSelect('session.template', 'template')
      .where('session.userId = :userId', { userId });

    // Filter by date range
    if (startDate && endDate) {
      queryBuilder.andWhere('session.startedAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      });
    } else if (startDate) {
      queryBuilder.andWhere('session.startedAt >= :startDate', { startDate });
    } else if (endDate) {
      queryBuilder.andWhere('session.startedAt <= :endDate', { endDate });
    }

    // Order by start time (newest first)
    queryBuilder.orderBy('session.startedAt', 'DESC');

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [sessions, total] = await queryBuilder.getManyAndCount();

    return {
      sessions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async createSession(userId: number, createDto: CreateExerciseSessionDto) {
    // Find template to get calories per minute
    const template = await this.findTemplateById(createDto.templateId);
    
    // Calculate calories burned
    const caloriesBurned = template.caloriesPerMinute * createDto.duration;

    const session = this.exerciseSessionRepository.create({
      userId,
      templateId: createDto.templateId,
      startedAt: new Date(createDto.startedAt),
      durationMinutes: createDto.duration,
      caloriesBurned,
      notes: createDto.notes
    });

    const savedSession = await this.exerciseSessionRepository.save(session);
    
    // Return with template info
    return await this.exerciseSessionRepository.findOne({
      where: { id: savedSession.id },
      relations: ['template']
    });
  }

  async deleteSession(userId: number, id: number) {
    const session = await this.exerciseSessionRepository.findOne({
      where: { id, userId }
    });

    if (!session) {
      throw new NotFoundException(`Exercise session with ID ${id} not found`);
    }

    await this.exerciseSessionRepository.remove(session);
    return { success: true };
  }

  // ==================== STATISTICS ====================

  async getStats(userId: number, statsDto: ExerciseStatsDto) {
    const { period = 'week', startDate } = statsDto;

    let dateFilter = {};
    const now = new Date();

    switch (period) {
      case 'day':
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        dateFilter = { startedAt: Between(today, now) };
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = { startedAt: Between(weekAgo, now) };
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFilter = { startedAt: Between(monthAgo, now) };
        break;
      case 'year':
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        dateFilter = { startedAt: Between(yearAgo, now) };
        break;
    }

    // If startDate is provided, use it instead
    if (startDate) {
      const start = new Date(startDate);
      const end = new Date(start.getTime() + 24 * 60 * 60 * 1000); // Next day
      dateFilter = { startedAt: Between(start, end) };
    }

    const sessions = await this.exerciseSessionRepository.find({
      where: { userId, ...dateFilter }
    });

    const totalSessions = sessions.length;
    const totalDuration = sessions.reduce((sum, session) => sum + session.durationMinutes, 0);
    const totalCalories = sessions.reduce((sum, session) => sum + session.caloriesBurned, 0);

    return {
      totalSessions,
      totalDuration,
      totalCalories,
      averageDuration: totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0,
      averageCalories: totalSessions > 0 ? Math.round(totalCalories / totalSessions) : 0,
      period,
      startDate: startDate || null
    };
  }
}
