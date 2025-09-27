import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
    EmailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME') || '1h',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtStrategy,
    {
      provide: 'LOGIN_GOOGLE_ENABLED',
      useFactory: (configService: ConfigService) => {
        const enableGoogle = configService.get<string>('ENABLE_GOOGLE_OAUTH');
        const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
        const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
        const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL');
        return enableGoogle === 'true' && !!(clientID && clientSecret && callbackURL);
      },
      inject: [ConfigService],
    },
    {
      provide: 'LOGIN_FB_ENABLED',
      useFactory: (configService: ConfigService) => {
        const enableFacebook = configService.get<string>('ENABLE_FACEBOOK_OAUTH');
        const clientID = configService.get<string>('FACEBOOK_CLIENT_ID');
        const clientSecret = configService.get<string>('FACEBOOK_CLIENT_SECRET');
        const callbackURL = configService.get<string>('FACEBOOK_CALLBACK_URL');
        return enableFacebook === 'true' && !!(clientID && clientSecret && callbackURL);
      },
      inject: [ConfigService],
    },
    {
      provide: 'LOGIN_ZALO_ENABLED',
      useFactory: (configService: ConfigService) => {
        const enableZalo = configService.get<string>('ENABLE_ZALO_OAUTH');
        const clientID = configService.get<string>('ZALO_CLIENT_ID');
        const clientSecret = configService.get<string>('ZALO_CLIENT_SECRET');
        return enableZalo === 'true' && !!(clientID && clientSecret);
      },
      inject: [ConfigService],
    },
    {
      provide: GoogleStrategy,
      useFactory: (configService: ConfigService) => {
        const enableGoogle = configService.get<boolean>('ENABLE_GOOGLE_OAUTH');
        const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
        const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
        const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL');
        
        // Only provide strategy if enabled and credentials are configured
        if (enableGoogle === true && clientID && clientSecret && callbackURL) {
          return new GoogleStrategy(configService);
        }
        return null;
      },
      inject: [ConfigService],
    },
    {
      provide: FacebookStrategy,
      useFactory: (configService: ConfigService) => {
        const enableFacebook = configService.get<boolean>('ENABLE_FACEBOOK_OAUTH');
        const clientID = configService.get<string>('FACEBOOK_CLIENT_ID');
        const clientSecret = configService.get<string>('FACEBOOK_CLIENT_SECRET');
        const callbackURL = configService.get<string>('FACEBOOK_CALLBACK_URL');
        
        // Only provide strategy if enabled and credentials are configured
        if (enableFacebook === true && clientID && clientSecret && callbackURL) {
          return new FacebookStrategy(configService);
        }
        return null;
      },
      inject: [ConfigService],
    },
  ],
  exports: [AuthService],
})
export class AuthModule {} 