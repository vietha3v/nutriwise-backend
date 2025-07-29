import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL');

    // Only initialize if OAuth credentials are provided
    if (clientID && clientSecret && callbackURL) {
      super({
        clientID,
        clientSecret,
        callbackURL,
        scope: ['email', 'profile'],
      });
    } else {
      // Skip initialization if no credentials provided
      super({
        clientID: 'dummy',
        clientSecret: 'dummy',
        callbackURL: 'dummy',
        scope: ['email', 'profile'],
      });
    }
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    // Skip validation if no credentials provided
    const clientID = this.configService.get<string>('GOOGLE_CLIENT_ID');
    if (!clientID) {
      return done(new Error('Google OAuth not configured'), null);
    }

    const { name, emails, photos } = profile;
    const user = {
      googleId: profile.id,
      email: emails[0].value,
      displayName: name.givenName + ' ' + name.familyName,
      profilePicture: photos[0].value,
      locale: profile._json.locale,
      accessToken,
    };
    done(null, user);
  }
} 