import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    // Check if user already has a profile
    const existingProfile = await this.profileRepository.findOne({
      where: { userId: createProfileDto.userId, isDeleted: false },
    });

    if (existingProfile) {
      throw new ConflictException('User already has a profile. Use update instead.');
    }

    const profile = new Profile();
    Object.assign(profile, createProfileDto);
    return await this.profileRepository.save(profile);
  }

  async findAll(): Promise<Profile[]> {
    return await this.profileRepository.find({
      where: { isDeleted: false },
    });
  }

  async findOne(id: number): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  async findByUserId(userId: number): Promise<Profile | null> {
    return await this.profileRepository.findOne({
      where: { userId, isDeleted: false },
    });
  }

  async findOrCreateByUserId(userId: number, createProfileDto?: CreateProfileDto): Promise<Profile> {
    let profile = await this.findByUserId(userId);
    
    if (!profile) {
      if (!createProfileDto) {
        throw new NotFoundException('Profile not found and no create data provided');
      }
      createProfileDto.userId = userId;
      profile = await this.create(createProfileDto);
    }
    
    return profile;
  }

  async update(id: number, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.findOne(id);
    Object.assign(profile, updateProfileDto);
    return await this.profileRepository.save(profile);
  }

  async updateByUserId(userId: number, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException(`Profile for user ${userId} not found`);
    }
    Object.assign(profile, updateProfileDto);
    return await this.profileRepository.save(profile);
  }

  async remove(id: number): Promise<void> {
    const profile = await this.findOne(id);
    profile.isDeleted = true;
    await this.profileRepository.save(profile);
  }
} 