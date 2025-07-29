import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WaterIntake } from './entities/water-intake.entity';

@Injectable()
export class WaterService {
  constructor(
    @InjectRepository(WaterIntake)
    private waterIntakeRepository: Repository<WaterIntake>,
  ) {}

  async create(createWaterIntakeDto: any): Promise<WaterIntake> {
    const waterIntake = new WaterIntake();
    Object.assign(waterIntake, {
      ...createWaterIntakeDto,
      date: new Date(createWaterIntakeDto.date), // Convert string to Date
    });
    return await this.waterIntakeRepository.save(waterIntake);
  }

  async findAll(): Promise<WaterIntake[]> {
    return await this.waterIntakeRepository.find({
      where: { isDeleted: false },
      order: { createdAt: 'DESC' },
    });
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
      date: updateWaterIntakeDto.date ? new Date(updateWaterIntakeDto.date) : waterIntake.date, // Convert string to Date
    });
    return await this.waterIntakeRepository.save(waterIntake);
  }

  async remove(id: number): Promise<void> {
    const waterIntake = await this.findOne(id);
    waterIntake.isDeleted = true;
    await this.waterIntakeRepository.save(waterIntake);
  }
} 