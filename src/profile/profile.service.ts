import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async create(createProfileDto: CreateProfileDto, userId: number): Promise<Profile> {
    // Allow multiple profiles per user for tracking body changes over time
    const profile = new Profile();
    Object.assign(profile, createProfileDto);
    profile.userId = userId; // Ensure userId is set from request
    
    // Calculate basic metrics if not provided
    if (!profile.bmi && profile.height && profile.weight) {
      profile.bmi = this.calculateBMI(profile.height, profile.weight);
      profile.bmiCategory = this.getBMICategory(profile.bmi);
    }

    // Calculate FFMI if not provided
    if (!profile.ffmi && profile.weight && profile.height && profile.bodyFatPercentage) {
      profile.ffmi = this.calculateFFMI(profile.weight, profile.height, profile.bodyFatPercentage);
    }

    // Calculate BMR if not provided
    if (!profile.bmr && profile.weight && profile.height && profile.age && profile.gender) {
      profile.bmr = this.calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
    }

    // Calculate TDEE if BMR is available
    if (profile.bmr && profile.activityLevel) {
      profile.tdee = this.calculateTDEE(profile.bmr, profile.activityLevel);
    }

    // Note: Ideal values and health assessment will be calculated by AI module
    // This service only handles basic calculations
    
    return await this.profileRepository.save(profile);
  }

  async findAll(userId: number): Promise<Profile[]> {
    // Users can only see their own profiles
    return await this.profileRepository.find({
      where: { userId, isDeleted: false },
      order: { createdAt: 'DESC' }, // Latest profiles first
    });
  }

  async findOne(id: number, userId: number): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { id, isDeleted: false },
    });
    
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    // Check if user has permission to access this profile
    if (profile.userId !== userId) {
      throw new ForbiddenException('You can only access your own profile');
    }

    return profile;
  }

  async findByUserId(userId: number): Promise<Profile | null> {
    // Get the latest profile for the user
    return await this.profileRepository.findOne({
      where: { userId, isDeleted: false },
      order: { createdAt: 'DESC' },
    });
  }

  async findAllByUserId(userId: number): Promise<Profile[]> {
    // Get all profiles for the user (for history tracking)
    return await this.profileRepository.find({
      where: { userId, isDeleted: false },
      order: { createdAt: 'DESC' },
    });
  }

  async findOrCreateByUserId(userId: number, createProfileDto?: CreateProfileDto): Promise<Profile> {
    let profile = await this.findByUserId(userId);
    
    if (!profile) {
      if (!createProfileDto) {
        throw new NotFoundException('Profile not found and no create data provided');
      }
      profile = await this.create(createProfileDto, userId);
    }
    
    return profile;
  }

  async update(id: number, updateProfileDto: UpdateProfileDto, userId: number): Promise<Profile> {
    const profile = await this.findOne(id, userId);
    
    Object.assign(profile, updateProfileDto);
    
    // Recalculate basic values if basic info changed
    if (updateProfileDto.height || updateProfileDto.weight) {
      if (profile.height && profile.weight) {
        profile.bmi = this.calculateBMI(profile.height, profile.weight);
        profile.bmiCategory = this.getBMICategory(profile.bmi);
      }
    }

    // Recalculate FFMI if body composition changed
    if (updateProfileDto.weight || updateProfileDto.height || updateProfileDto.bodyFatPercentage) {
      if (profile.weight && profile.height && profile.bodyFatPercentage) {
        profile.ffmi = this.calculateFFMI(profile.weight, profile.height, profile.bodyFatPercentage);
      }
    }

    if (updateProfileDto.weight || updateProfileDto.height || updateProfileDto.age || updateProfileDto.gender) {
      if (profile.weight && profile.height && profile.age && profile.gender) {
        profile.bmr = this.calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
      }
    }

    if (profile.bmr && profile.activityLevel) {
      profile.tdee = this.calculateTDEE(profile.bmr, profile.activityLevel);
    }

    // Note: Ideal values and health assessment will be recalculated by AI module
    // This service only handles basic calculations

    return await this.profileRepository.save(profile);
  }

  async updateByUserId(userId: number, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException(`Profile for user ${userId} not found`);
    }
    
    Object.assign(profile, updateProfileDto);
    
    // Recalculate basic values if basic info changed
    if (updateProfileDto.height || updateProfileDto.weight) {
      if (profile.height && profile.weight) {
        profile.bmi = this.calculateBMI(profile.height, profile.weight);
        profile.bmiCategory = this.getBMICategory(profile.bmi);
      }
    }

    // Recalculate FFMI if body composition changed
    if (updateProfileDto.weight || updateProfileDto.height || updateProfileDto.bodyFatPercentage) {
      if (profile.weight && profile.height && profile.bodyFatPercentage) {
        profile.ffmi = this.calculateFFMI(profile.weight, profile.height, profile.bodyFatPercentage);
      }
    }

    if (updateProfileDto.weight || updateProfileDto.height || updateProfileDto.age || updateProfileDto.gender) {
      if (profile.weight && profile.height && profile.age && profile.gender) {
        profile.bmr = this.calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
      }
    }

    if (profile.bmr && profile.activityLevel) {
      profile.tdee = this.calculateTDEE(profile.bmr, profile.activityLevel);
    }

    // Note: Ideal values and health assessment will be recalculated by AI module
    // This service only handles basic calculations

    return await this.profileRepository.save(profile);
  }

  async remove(id: number, userId: number): Promise<void> {
    const profile = await this.findOne(id, userId);
    
    profile.isDeleted = true;
    await this.profileRepository.save(profile);
  }

  // === COMPARISON METHODS ===
  
  async compareProfiles(profile1Id: number, profile2Id: number, userId: number) {
    const profile1 = await this.findOne(profile1Id, userId);
    const profile2 = await this.findOne(profile2Id, userId);

    return {
      profile1,
      profile2,
      comparison: {
        weight: this.calculateDifference(profile2.weight, profile1.weight),
        bodyFat: this.calculateDifference(profile2.bodyFatPercentage, profile1.bodyFatPercentage),
        muscleMass: this.calculateDifference(profile2.skeletalMuscleMass, profile1.skeletalMuscleMass),
        bmi: this.calculateDifference(profile2.bmi, profile1.bmi),
        visceralFat: this.calculateDifference(profile2.visceralFatLevel, profile1.visceralFatLevel),
        ffmi: this.calculateDifference(profile2.ffmi, profile1.ffmi),
        timeSpan: {
          days: Math.floor((new Date(profile2.createdAt).getTime() - new Date(profile1.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        }
      }
    };
  }

  private calculateDifference(newValue: number, oldValue: number) {
    if (!newValue || !oldValue) return null;
    
    const change = newValue - oldValue;
    const percentage = (change / oldValue) * 100;
    
    return {
      change: Number(change.toFixed(2)),
      percentage: Number(percentage.toFixed(2))
    };
  }

  // === BASIC CALCULATION METHODS ===
  // These are standard formulas that don't require AI

  private calculateBMI(height: number, weight: number): number {
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  private getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }

  private calculateFFMI(weight: number, height: number, bodyFatPercentage: number): number {
    // FFMI = (weight × (1 - bodyFatPercentage/100)) / (height/100)²
    const fatFreeMass = weight * (1 - bodyFatPercentage / 100);
    const heightInMeters = height / 100;
    return Number((fatFreeMass / (heightInMeters * heightInMeters)).toFixed(2));
  }

  private calculateBMR(weight: number, height: number, age: number, gender: string): number {
    // Mifflin-St Jeor Equation
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    bmr = gender === 'Male' ? bmr + 5 : bmr - 161;
    return Math.round(bmr);
  }

  private calculateTDEE(bmr: number, activityLevel: string): number {
    const activityMultipliers = {
      'Sedentary': 1.2,
      'LightlyActive': 1.375,
      'ModeratelyActive': 1.55,
      'VeryActive': 1.725,
      'ExtremelyActive': 1.9,
    };
    
    const multiplier = activityMultipliers[activityLevel] || 1.2;
    return Math.round(bmr * multiplier);
  }
} 