import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private configService: ConfigService) {
    const clientID = configService.get<string>('FACEBOOK_CLIENT_ID');
    const clientSecret = configService.get<string>('FACEBOOK_CLIENT_SECRET');
    const callbackURL = configService.get<string>('FACEBOOK_CALLBACK_URL');

    // Only initialize if OAuth credentials are provided
    if (clientID && clientSecret && callbackURL) {
      super({
        clientID,
        clientSecret,
        callbackURL,
        scope: ['email'],
        profileFields: ['emails', 'name', 'photos'],
      });
    } else {
      // Skip initialization if no credentials provided
      super({
        clientID: 'dummy',
        clientSecret: 'dummy',
        callbackURL: 'dummy',
        scope: ['email'],
        profileFields: ['emails', 'name', 'photos'],
      });
    }
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    // Skip validation if no credentials provided
    const clientID = this.configService.get<string>('FACEBOOK_CLIENT_ID');
    if (!clientID) {
      return done(new Error('Facebook OAuth not configured'), null);
    }

    const { name, emails, photos } = profile;
    const user = {
      facebookId: profile.id,
      email: emails[0].value,
      displayName: name.givenName + ' ' + name.familyName,
      profilePicture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
} 