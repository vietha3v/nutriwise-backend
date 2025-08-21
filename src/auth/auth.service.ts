import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
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

  async register(registerDto: RegisterDto): Promise<any> {
    const { username, email, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [
        { username },
        { email }
      ]
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User();
    Object.assign(user, {
      username,
      email,
      password: hashedPassword,
      role: Role.User,
      isVerified: true, // Auto verify for now
    });

    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const payload = { username: user.username, sub: user.id, userId: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role,
        isVerified: savedUser.isVerified,
      },
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { username, password } = loginDto;

    // Find user by username or email
    const user = await this.userRepository.findOne({
      where: [
        { username },
        { email: username }
      ]
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password - try multiple hash methods for backward compatibility
    let isPasswordValid = false;
    
    // Try current bcrypt method
    isPasswordValid = await bcrypt.compare(password, user.password);
    
    // If not valid, try to rehash with new method (for old users)
    if (!isPasswordValid) {
      // Check if this might be an old password hash
      const oldHashPattern = /^[a-f0-9]{32}$/; // MD5 pattern
      if (oldHashPattern.test(user.password)) {
        // This is an old hash, update to new bcrypt hash
        const newHash = await bcrypt.hash(password, 10);
        user.password = newHash;
        await this.userRepository.save(user);
        isPasswordValid = true;
      }
    }

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
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
      },
      token, 
      refresh_token: refreshToken
    };
  }

  async socialLogin(socialLoginDto: SocialLoginDto, provider: 'google' | 'facebook'): Promise<any> {
    const { socialId, email, displayName, profilePicture, locale, timezone, role } = socialLoginDto;

    // Check if user already exists by social ID
    let user = await this.userRepository.findOne({
      where: provider === 'google' ? { googleId: socialId } : { facebookId: socialId }
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
        } else {
          user.facebookId = socialId;
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
          [provider === 'google' ? 'googleId' : 'facebookId']: socialId,
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
      },
      token,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    const { email } = forgotPasswordDto;

    const user = await this.userRepository.findOne({
      where: { email }
    });

    if (!user) {
      // Don't reveal if email exists or not
      return { message: 'If the email exists, a reset link has been sent' };
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await this.userRepository.save(user);

    // Send email
    try {
      await this.emailService.sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
      console.error('Failed to send email:', error);
      // Don't throw error, just log it
    }

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any> {
    const { token, newPassword } = resetPasswordDto;

    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: new Date(Date.now())
      }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = '';
    user.resetPasswordExpires = new Date();
    await this.userRepository.save(user);

    return { message: 'Password reset successfully' };
  }

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

  async refreshToken(refreshToken: string): Promise<any> {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken);
      
      // Check if this is a refresh token
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Find user
      const user = await this.userRepository.findOne({
        where: { id: payload.userId }
      });
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Create new access token
      const accessPayload = { 
        username: user.username, 
        sub: user.id, 
        userId: user.id, 
        role: user.role 
      };
      const newAccessToken = this.jwtService.sign(accessPayload);

      // Generate new refresh token
      const newRefreshPayload = { 
        username: user.username, 
        sub: user.id, 
        userId: user.id, 
        role: user.role,
        type: 'refresh'
      };
      const newRefreshToken = this.jwtService.sign(newRefreshPayload, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME || '30d'
      });

      return {
        token: newAccessToken,
        refresh_token: newRefreshToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          profilePicture: user.profilePicture,
          displayName: user.displayName,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
} 