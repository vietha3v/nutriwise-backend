import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { SocialLoginDto } from './dto/social-login.dto';
import { EmailService } from '../email/email.service';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  // ===== REGISTER METHOD REMOVED =====
  // Method register đã được xóa bỏ vì NextAuth chỉ sử dụng OAuth, không cần đăng ký thủ công

  // ===== LOGIN METHOD REMOVED =====
  // Method login đã được xóa bỏ vì NextAuth chỉ sử dụng OAuth, không cần đăng nhập thủ công

  async socialLogin(socialLoginDto: SocialLoginDto, provider: 'google' | 'facebook' | 'zalo'): Promise<any> {
    const { socialId, email, displayName, profilePicture, locale, timezone, role } = socialLoginDto;

    // Check if user already exists by social ID
    let user = await this.userRepository.findOne({
      where: provider === 'google' ? { googleId: socialId } 
             : provider === 'facebook' ? { facebookId: socialId }
             : { zaloId: socialId }
    });

    if (!user) {
      // Check if user exists by email
      user = await this.userRepository.findOne({
        where: { email }
      });

      if (user) {
        // Link existing account with social ID
        if (provider === 'google') {
          user.googleId = socialId;
        } else if (provider === 'facebook') {
          user.facebookId = socialId;
        } else {
          user.zaloId = socialId;
        }
        user.profilePicture = profilePicture || user.profilePicture;
        user.displayName = displayName || user.displayName;
        user.locale = locale || user.locale;
        user.timezone = timezone || user.timezone;
      } else {
        // Create new user
        user = new User();
        Object.assign(user, {
          username: email.split('@')[0] + '_' + Date.now(), // Generate unique username
          email,
          password: await bcrypt.hash(Math.random().toString(36), 10), // Random password
          role: role || Role.User,
          isVerified: true,
          [provider === 'google' ? 'googleId' : provider === 'facebook' ? 'facebookId' : 'zaloId']: socialId,
          profilePicture,
          displayName,
          locale,
          timezone,
        });
      }

      user = await this.userRepository.save(user);
    }

    // Generate JWT token
    const payload = { username: user.username, sub: user.id, userId: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    // Generate refresh token
    const refreshPayload = { 
      username: user.username, 
      sub: user.id, 
      userId: user.id, 
      role: user.role,
      type: 'refresh'
    };
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME || '30d'
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profilePicture: user.profilePicture,
        displayName: user.displayName,
        googleId: user.googleId,
        facebookId: user.facebookId,
        zaloId: user.zaloId,
      },
      token,
      refresh_token: refreshToken,
    };
  }

  // ===== FORGOT PASSWORD & RESET PASSWORD METHODS REMOVED =====
  // Các methods forgotPassword và resetPassword đã được xóa bỏ vì NextAuth chỉ sử dụng OAuth, không cần mật khẩu

  async validateUser(userId: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      profilePicture: user.profilePicture,
      displayName: user.displayName,
    };
  }

  // ===== REFRESH TOKEN METHOD REMOVED =====
  // Method refreshToken đã được xóa bỏ vì NextAuth tự quản lý session và token
} 