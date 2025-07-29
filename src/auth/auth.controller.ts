import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('LOGIN_GOOGLE_ENABLED') private readonly loginGoogleEnabled: boolean,
    @Inject('LOGIN_FB_ENABLED') private readonly loginFbEnabled: boolean,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Username or email already exists' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login with username/email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('google')
  @ApiOperation({ summary: 'Login with Google OAuth data' })
  @ApiResponse({ status: 200, description: 'Google login successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 503, description: 'Google OAuth not configured' })
  googleLogin(@Body() socialLoginDto: SocialLoginDto) {
    if (!this.loginGoogleEnabled) {
      throw new Error('Google OAuth is not configured. Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL in your environment variables.');
    }
    return this.authService.socialLogin(socialLoginDto, 'google');
  }

  @Public()
  @Post('facebook')
  @ApiOperation({ summary: 'Login with Facebook OAuth data' })
  @ApiResponse({ status: 200, description: 'Facebook login successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 503, description: 'Facebook OAuth not configured' })
  facebookLogin(@Body() socialLoginDto: SocialLoginDto) {
    if (!this.loginFbEnabled) {
      throw new Error('Facebook OAuth is not configured. Please set FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, and FACEBOOK_CALLBACK_URL in your environment variables.');
    }
    return this.authService.socialLogin(socialLoginDto, 'facebook');
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Send password reset email' })
  @ApiResponse({ status: 200, description: 'Reset email sent if account exists' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  getProfile(@Request() req) {
    return this.authService.validateUser(req.user.userId);
  }

  @Public()
  @Get('oauth-status')
  @ApiOperation({ summary: 'Get OAuth configuration status' })
  @ApiResponse({ status: 200, description: 'OAuth status retrieved' })
  getOAuthStatus() {
    return {
      google: this.loginGoogleEnabled,
      facebook: this.loginFbEnabled,
    };
  }
} 