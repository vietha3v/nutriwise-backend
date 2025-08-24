import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { WaterIntake } from './entities/water-intake.entity';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class WaterService {
  constructor(
    @InjectRepository(WaterIntake)
    private waterIntakeRepository: Repository<WaterIntake>,
    private profileService: ProfileService,
  ) {}

  // Helper functions
  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  }

  private endOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
  }

  private getHours(date: Date): number {
    return date.getHours();
  }

  async create(createWaterIntakeDto: any, userId: number): Promise<WaterIntake> {
    const waterIntake = new WaterIntake();
    Object.assign(waterIntake, {
      ...createWaterIntakeDto,
      userId,
      datetime: new Date(createWaterIntakeDto.datetime),
    });
    return await this.waterIntakeRepository.save(waterIntake);
  }

  async findAllByUserId(userId: number): Promise<WaterIntake[]> {
    return await this.waterIntakeRepository.find({
      where: { userId, isDeleted: false },
      order: { datetime: 'DESC' },
    });
  }

  async getTodayProgress(userId: number): Promise<any> {
    const profile = await this.profileService.findByUserId(userId);
    const dailyGoal = profile?.dailyWaterGoal || 2000;

    const today = new Date();
    const startOfToday = this.startOfDay(today);
    const endOfToday = this.endOfDay(today);
    
    const waterToday = await this.waterIntakeRepository.find({
      where: {
        userId,
        datetime: Between(startOfToday, endOfToday),
        isDeleted: false,
      },
      order: { datetime: 'DESC' },
    });

    const totalDrank = waterToday.reduce((sum, w) => sum + Number(w.amount), 0);
    const remaining = Math.max(dailyGoal - totalDrank, 0);
    const progressPercentage = Math.min((totalDrank / dailyGoal) * 100, 100);

    return {
      totalDrank,
      dailyGoal,
      remaining,
      progressPercentage,
      recordCount: waterToday.length,
      lastDrinkTime: waterToday.length > 0 ? waterToday[0].datetime : null,
    };
  }

  async getStatsByDate(userId: number, date: string): Promise<any> {
    const profile = await this.profileService.findByUserId(userId);
    const dailyGoal = profile?.dailyWaterGoal || 2000;

    const targetDate = new Date(date);
    const startOfTargetDate = this.startOfDay(targetDate);
    const endOfTargetDate = this.endOfDay(targetDate);
    
    const waterRecords = await this.waterIntakeRepository.find({
      where: {
        userId,
        datetime: Between(startOfTargetDate, endOfTargetDate),
        isDeleted: false,
      },
      order: { datetime: 'ASC' },
    });

    const totalDrank = waterRecords.reduce((sum, w) => sum + Number(w.amount), 0);
    const remaining = Math.max(dailyGoal - totalDrank, 0);
    const progressPercentage = Math.min((totalDrank / dailyGoal) * 100, 100);

    // Thống kê theo giờ
    const hourlyData: number[] = new Array(24).fill(0);
    const hourlyCount: number[] = new Array(24).fill(0);
    
    waterRecords.forEach(water => {
      const hour = this.getHours(water.datetime);
      hourlyData[hour] += Number(water.amount);
      hourlyCount[hour]++;
    });

    return {
      date,
      totalDrank,
      dailyGoal,
      remaining,
      progressPercentage,
      recordCount: waterRecords.length,
      hourlyData,
      hourlyCount,
      records: waterRecords,
    };
  }

  async findOne(id: number): Promise<WaterIntake> {
    const waterIntake = await this.waterIntakeRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!waterIntake) {
      throw new NotFoundException(`Water intake with ID ${id} not found`);
    }
    return waterIntake;
  }

  async update(id: number, updateWaterIntakeDto: any): Promise<WaterIntake> {
    const waterIntake = await this.findOne(id);
    Object.assign(waterIntake, {
      ...updateWaterIntakeDto,
      datetime: updateWaterIntakeDto.datetime ? new Date(updateWaterIntakeDto.datetime) : waterIntake.datetime,
    });
    return await this.waterIntakeRepository.save(waterIntake);
  }

  async remove(id: number): Promise<void> {
    const waterIntake = await this.findOne(id);
    waterIntake.isDeleted = true;
    await this.waterIntakeRepository.save(waterIntake);
  }
} 