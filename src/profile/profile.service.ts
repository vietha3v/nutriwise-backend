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
    
    // Process array fields - ensure they are arrays
    if (profile.allergies && !Array.isArray(profile.allergies)) {
      profile.allergies = [profile.allergies];
    }
    if (profile.medicalConditions && !Array.isArray(profile.medicalConditions)) {
      profile.medicalConditions = [profile.medicalConditions];
    }
    if (profile.healthIssues && !Array.isArray(profile.healthIssues)) {
      profile.healthIssues = [profile.healthIssues];
    }
    
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

    // Calculate TDEE if BMR is available (or calculate BMR first if needed)
    if (profile.weight && profile.height && profile.age && profile.gender) {
      if (!profile.bmr) {
        profile.bmr = this.calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
      }
      // Use default activity level if not provided
      const activityLevel = profile.activityLevel || 'ModeratelyActive';
      profile.tdee = this.calculateTDEE(profile.bmr, activityLevel);
    }

    // Calculate additional derived metrics
    this.calculateDerivedMetrics(profile);

    // Save profile
    const savedProfile = await this.profileRepository.save(profile);
    
    // Return profile with calculated fields for immediate display
    return this.sanitizeProfileForResponse(savedProfile);
  }

  async findAll(userId: number): Promise<Profile[]> {
    // Users can only see their own profiles
    const profiles = await this.profileRepository.find({
      where: { userId, isDeleted: false },
      order: { createdAt: 'DESC' }, // Latest profiles first
    });
    
    return profiles.map(profile => this.sanitizeProfileForResponse(profile));
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

    return this.sanitizeProfileForResponse(profile);
  }

  async findByUserId(userId: number): Promise<Profile | null> {
    // Get the latest profile for the user
    const profile = await this.profileRepository.findOne({
      where: { userId, isDeleted: false },
      order: { createdAt: 'DESC' },
    });
    
    return profile ? this.sanitizeProfileForResponse(profile) : null;
  }

  async findAllByUserId(userId: number): Promise<Profile[]> {
    // Get all profiles for the user (for history tracking)
    const profiles = await this.profileRepository.find({
      where: { userId, isDeleted: false },
      order: { createdAt: 'DESC' },
    });
    
    return profiles.map(profile => this.sanitizeProfileForResponse(profile));
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
    
    // Process array fields - ensure they are arrays
    if (profile.allergies && !Array.isArray(profile.allergies)) {
      profile.allergies = [profile.allergies];
    }
    if (profile.medicalConditions && !Array.isArray(profile.medicalConditions)) {
      profile.medicalConditions = [profile.medicalConditions];
    }
    if (profile.healthIssues && !Array.isArray(profile.healthIssues)) {
      profile.healthIssues = [profile.healthIssues];
    }
    
    // Recalculate basic values if basic info changed
    if (profile.height && profile.weight) {
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

    // Calculate TDEE if BMR is available (or calculate BMR first if needed)
    if (profile.weight && profile.height && profile.age && profile.gender) {
      if (!profile.bmr) {
        profile.bmr = this.calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
      }
      // Use default activity level if not provided
      const activityLevel = profile.activityLevel || 'ModeratelyActive';
      profile.tdee = this.calculateTDEE(profile.bmr, activityLevel);
    }

    // Calculate additional derived metrics
    this.calculateDerivedMetrics(profile);

    // Save profile
    const savedProfile = await this.profileRepository.save(profile);
    
    return this.sanitizeProfileForResponse(savedProfile);
  }

  async updateByUserId(userId: number, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException(`Profile for user ${userId} not found`);
    }
    
    Object.assign(profile, updateProfileDto);
    
    // Process array fields - ensure they are arrays
    if (profile.allergies && !Array.isArray(profile.allergies)) {
      profile.allergies = [profile.allergies];
    }
    if (profile.medicalConditions && !Array.isArray(profile.medicalConditions)) {
      profile.medicalConditions = [profile.medicalConditions];
    }
    if (profile.healthIssues && !Array.isArray(profile.healthIssues)) {
      profile.healthIssues = [profile.healthIssues];
    }
    
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

  // === STANDARD CALCULATIONS ===
  
  /**
   * Tính toán chỉ số tiêu chuẩn lý tưởng dựa trên tuổi, giới tính và chiều cao
   */
  calculateIdealStandards(age: number, gender: string, height: number) {
    const heightInMeters = height / 100;
    
    // Tính BMI lý tưởng (18.5 - 24.9)
    const idealBMIMin = 18.5;
    const idealBMIMax = gender === 'Male' ? 25.0 : 24.0;
    const idealWeightMin = idealBMIMin * heightInMeters * heightInMeters;
    const idealWeightMax = idealBMIMax * heightInMeters * heightInMeters;
    const idealWeight = (idealWeightMin + idealWeightMax) / 2;

    // Tính tỷ lệ mỡ lý tưởng theo giới tính và tuổi
    const idealBodyFatPercentage = this.calculateIdealBodyFatPercentage(age, gender);
    
    // Tính khối lượng cơ lý tưởng
    const idealMuscleMass = this.calculateIdealMuscleMass(age, gender, height);
    
    // Tính tỷ lệ nước lý tưởng (50-65% trọng lượng cơ thể)
    const idealWaterPercentage = 0.55; // 55% trung bình
    const idealTotalWater = idealWeight * idealWaterPercentage;
    
    // Tính BMR lý tưởng
    const idealBMR = this.calculateBMR(idealWeight, height, age, gender);
    
    // Tính TDEE lý tưởng (với mức hoạt động vừa phải)
    const idealTDEE = idealBMR * 1.55; // Moderately Active
    
    // Tính FFMI lý tưởng
    const idealFFMI = this.calculateFFMI(idealWeight, height, idealBodyFatPercentage);
    
    // Tính VFL lý tưởng (1-9 là tốt)
    const idealVFL = 5; // Giá trị trung bình tốt
    
    return {
      // Các field tương đồng với FE
      bmi: 21.7, // BMI trung bình lý tưởng
      weight: Math.round(idealWeight * 10) / 10,
      bodyFatPercentage: Math.round(idealBodyFatPercentage * 10) / 10,
      skeletalMuscleMass: Math.round(idealMuscleMass * 10) / 10,
      visceralFatLevel: idealVFL,
      totalBodyWater: Math.round(idealTotalWater * 10) / 10,
      intracellularWater: Math.round(idealTotalWater * 0.67 * 10) / 10, // 67% của tổng nước
      extracellularWater: Math.round(idealTotalWater * 0.33 * 10) / 10, // 33% của tổng nước
      icwEcwRatio: 1.0, // Tỷ lệ lý tưởng
      ffmi: Math.round(idealFFMI * 10) / 10,
      bmr: Math.round(idealBMR),
      tdee: Math.round(idealTDEE),
      
      // Các field gốc để tương thích ngược
      idealWeight: Math.round(idealWeight * 10) / 10,
      idealWeightRange: {
        min: Math.round(idealWeightMin * 10) / 10,
        max: Math.round(idealWeightMax * 10) / 10
      },
      idealBodyFatPercentage: Math.round(idealBodyFatPercentage * 10) / 10,
      idealMuscleMass: Math.round(idealMuscleMass * 10) / 10,
      idealTotalWater: Math.round(idealTotalWater * 10) / 10,
      idealBMR: Math.round(idealBMR),
      idealTDEE: Math.round(idealTDEE),
      idealFFMI: Math.round(idealFFMI * 10) / 10,
      idealVFL: idealVFL,
      idealICWECWRatio: 1.0, // Tỷ lệ lý tưởng
    };
  }

  /**
   * Tính tỷ lệ mỡ lý tưởng theo tuổi và giới tính
   */
  private calculateIdealBodyFatPercentage(age: number, gender: string): number {
    if (gender === 'Male') {
      if (age < 20) return 10; // 10-15%
      if (age < 30) return 12; // 12-17%
      if (age < 40) return 14; // 14-19%
      if (age < 50) return 16; // 16-21%
      if (age < 60) return 18; // 18-23%
      return 20; // 20-25%
    } else {
      if (age < 20) return 18; // 18-23%
      if (age < 30) return 20; // 20-25%
      if (age < 40) return 22; // 22-27%
      if (age < 50) return 24; // 24-29%
      if (age < 60) return 26; // 26-31%
      return 28; // 28-33%
    }
  }

  /**
   * Tính khối lượng cơ lý tưởng theo tuổi, giới tính và chiều cao
   */
  private calculateIdealMuscleMass(age: number, gender: string, height: number): number {
    const heightInMeters = height / 100;
    
    // Cơ sở tính toán: tỷ lệ cơ bắp theo giới tính
    let musclePercentage = gender === 'Male' ? 0.45 : 0.35; // 45% cho nam, 35% cho nữ
    
    // Điều chỉnh theo tuổi
    if (age < 20) musclePercentage += 0.05; // Tăng 5% cho người trẻ
    else if (age > 50) musclePercentage -= 0.05; // Giảm 5% cho người lớn tuổi
    
    // Tính cân nặng lý tưởng trung bình
    const idealBMI = gender === 'Male' ? 22.5 : 21.5;
    const idealWeight = idealBMI * heightInMeters * heightInMeters;
    
    return idealWeight * musclePercentage;
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

  /**
   * Tính toán các chỉ số phái sinh từ dữ liệu cơ bản
   */
  private calculateDerivedMetrics(profile: Profile): void {
    // Tính tỷ lệ nước nếu có tổng lượng nước
    if (profile.totalBodyWater && profile.weight && !profile.icwEcwRatio) {
      const waterPercentage = (profile.totalBodyWater / profile.weight) * 100;
      
      // Tính nước nội bào và ngoại bào nếu chưa có
      if (!profile.intracellularWater && !profile.extracellularWater) {
        profile.intracellularWater = Number((profile.totalBodyWater * 0.67).toFixed(1)); // 67% của tổng nước
        profile.extracellularWater = Number((profile.totalBodyWater * 0.33).toFixed(1)); // 33% của tổng nước
      }
      
      // Tính tỷ lệ ICW/ECW
      if (profile.intracellularWater && profile.extracellularWater) {
        profile.icwEcwRatio = Number((profile.intracellularWater / profile.extracellularWater).toFixed(2));
      }
    }

    // Tính tỷ lệ mỡ cơ thể nếu có khối lượng mỡ
    if (profile.weight && !profile.bodyFatPercentage) {
      if (profile.subcutaneousFat && profile.visceralFat) {
        const totalFat = profile.subcutaneousFat + profile.visceralFat;
        profile.bodyFatPercentage = Number(((totalFat / profile.weight) * 100).toFixed(1));
      }
    }

    // Tính tỷ lệ mỡ dưới da nếu có khối lượng mỡ dưới da
    if (profile.subcutaneousFat && profile.weight && !profile.subcutaneousFatPercentage) {
      profile.subcutaneousFatPercentage = Number(((profile.subcutaneousFat / profile.weight) * 100).toFixed(1));
    }

    // Tính tỷ lệ cơ bắp nếu có khối lượng cơ
    if (profile.skeletalMuscleMass && profile.weight && !profile.muscleMassPercentage) {
      profile.muscleMassPercentage = Number(((profile.skeletalMuscleMass / profile.weight) * 100).toFixed(1));
    }

    // Tính SMM Index nếu có khối lượng cơ và chiều cao
    if (profile.skeletalMuscleMass && profile.height && !profile.smmIndex) {
      const heightInMeters = profile.height / 100;
      profile.smmIndex = Number((profile.skeletalMuscleMass / (heightInMeters * heightInMeters)).toFixed(2));
    }

    // Tính tỷ lệ xương nếu có khối lượng xương
    if (profile.boneMass && profile.weight && !profile.boneMassPercentage) {
      profile.boneMassPercentage = Number(((profile.boneMass / profile.weight) * 100).toFixed(1));
    }

    // Tính mục tiêu dinh dưỡng hàng ngày nếu có TDEE
    if (profile.tdee && !profile.dailyCalorieGoal) {
      // Mục tiêu calo dựa trên goalType
      if (profile.goalType === 'WeightLoss') {
        profile.dailyCalorieGoal = Math.round(profile.tdee * 0.85); // Giảm 15%
      } else if (profile.goalType === 'WeightGain') {
        profile.dailyCalorieGoal = Math.round(profile.tdee * 1.15); // Tăng 15%
      } else {
        profile.dailyCalorieGoal = Math.round(profile.tdee); // Duy trì
      }

      // Tính mục tiêu protein (1.6-2.2g/kg cho người tập luyện)
      const activityLevel = profile.activityLevel || 'ModeratelyActive';
      const proteinPerKg = activityLevel === 'Sedentary' ? 1.2 : 1.8;
      profile.dailyProteinGoal = Math.round(profile.weight * proteinPerKg);

      // Tính mục tiêu fat (20-35% tổng calo)
      const fatPercentage = 0.25; // 25%
      profile.dailyFatGoal = Math.round((profile.dailyCalorieGoal * fatPercentage) / 9); // 9 cal/g fat

      // Tính mục tiêu carb (phần còn lại)
      const carbCalories = profile.dailyCalorieGoal - (profile.dailyProteinGoal * 4) - (profile.dailyFatGoal * 9);
      profile.dailyCarbGoal = Math.round(carbCalories / 4); // 4 cal/g carb

      // Tính mục tiêu nước (35ml/kg)
      profile.dailyWaterGoal = Math.round(profile.weight * 35);
    }
  }

  /**
   * Sanitize profile data for API response (remove sensitive fields)
   */
  private sanitizeProfileForResponse(profile: Profile): Profile {
    // Create a new object without sensitive fields
    const { isDeleted, userId, ...sanitizedProfile } = profile;
    return sanitizedProfile as Profile;
  }
} 