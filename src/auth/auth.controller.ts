import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Inject,
  UnauthorizedException,
  Res,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SocialLoginDto } from './dto/social-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../common/enums/role.enum';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('LOGIN_GOOGLE_ENABLED') private readonly loginGoogleEnabled: boolean,
    @Inject('LOGIN_FB_ENABLED') private readonly loginFbEnabled: boolean,
    @Inject('LOGIN_ZALO_ENABLED') private readonly loginZaloEnabled: boolean,
  ) {}

  // ===== OAUTH CALLBACK ROUTES REMOVED =====
  // Các route OAuth callback cũ đã được xóa bỏ vì NextAuth tự quản lý OAuth flow

  // ===== DIRECT OAUTH ENDPOINTS (for NextAuth integration) =====

  // Đăng ký tài khoản thông thường đã bị vô hiệu hóa
  // Chỉ hỗ trợ đăng nhập qua OAuth (Google, Facebook)

  // Đăng nhập thông thường đã bị vô hiệu hóa
  // Chỉ hỗ trợ đăng nhập qua OAuth (Google, Facebook)

  @Public()
  @Post('google')
  @ApiOperation({ 
    summary: 'Đăng nhập bằng Google OAuth',
    description: 'Đăng nhập bằng tài khoản Google. Nếu tài khoản chưa tồn tại, hệ thống sẽ tạo tài khoản mới.'
  })
  @ApiBody({ 
    type: SocialLoginDto,
    description: 'Thông tin từ Google OAuth'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Đăng nhập Google thành công',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          username: 'john_doe',
          email: 'john.doe@gmail.com',
          role: Role.User,
          displayName: 'John Doe',
          profilePicture: 'https://lh3.googleusercontent.com/...',
          googleId: '123456789'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dữ liệu OAuth không hợp lệ'
  })
  @ApiResponse({ 
    status: 503, 
    description: 'Google OAuth chưa được cấu hình',
    schema: {
      example: {
        statusCode: 503,
        message: 'Google OAuth is not configured',
        error: 'Service Unavailable'
      }
    }
  })
  googleLogin(@Body() socialLoginDto: SocialLoginDto) {
    if (!this.loginGoogleEnabled) {
      throw new Error('Google OAuth is not configured. Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL in your environment variables.');
    }
    return this.authService.socialLogin(socialLoginDto, 'google');
  }

  @Public()
  @Post('facebook')
  @ApiOperation({ 
    summary: 'Đăng nhập bằng Facebook OAuth',
    description: 'Đăng nhập bằng tài khoản Facebook. Nếu tài khoản chưa tồn tại, hệ thống sẽ tạo tài khoản mới.'
  })
  @ApiBody({ 
    type: SocialLoginDto,
    description: 'Thông tin từ Facebook OAuth'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Đăng nhập Facebook thành công',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          username: 'john_doe',
          email: 'john.doe@facebook.com',
          role: Role.User,
          displayName: 'John Doe',
          profilePicture: 'https://graph.facebook.com/...',
          facebookId: '123456789'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dữ liệu OAuth không hợp lệ'
  })
  @ApiResponse({ 
    status: 503, 
    description: 'Facebook OAuth chưa được cấu hình',
    schema: {
      example: {
        statusCode: 503,
        message: 'Facebook OAuth is not configured',
        error: 'Service Unavailable'
      }
    }
  })
  facebookLogin(@Body() socialLoginDto: SocialLoginDto) {
    if (!this.loginFbEnabled) {
      throw new Error('Facebook OAuth is not configured. Please set FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, and FACEBOOK_CALLBACK_URL in your environment variables.');
    }
    return this.authService.socialLogin(socialLoginDto, 'facebook');
  }

  @Public()
  @Post('zalo')
  @ApiOperation({ 
    summary: 'Đăng nhập bằng Zalo OAuth',
    description: 'Đăng nhập bằng tài khoản Zalo. Nếu tài khoản chưa tồn tại, hệ thống sẽ tạo tài khoản mới.'
  })
  @ApiBody({ 
    type: SocialLoginDto,
    description: 'Thông tin từ Zalo OAuth'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Đăng nhập Zalo thành công',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          username: 'john_doe',
          email: 'john.doe@zalo.me',
          role: Role.User,
          displayName: 'John Doe',
          profilePicture: 'https://s120-ava-talk.zadn.vn/...',
          zaloId: '1234567890123456789'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dữ liệu OAuth không hợp lệ'
  })
  @ApiResponse({ 
    status: 503, 
    description: 'Zalo OAuth chưa được cấu hình',
    schema: {
      example: {
        statusCode: 503,
        message: 'Zalo OAuth is not configured',
        error: 'Service Unavailable'
      }
    }
  })
  zaloLogin(@Body() socialLoginDto: SocialLoginDto) {
    if (!this.loginZaloEnabled) {
      throw new Error('Zalo OAuth is not configured. Please set ZALO_CLIENT_ID and ZALO_CLIENT_SECRET in your environment variables.');
    }
    return this.authService.socialLogin(socialLoginDto, 'zalo');
  }

  // Chức năng quên mật khẩu và reset mật khẩu đã bị vô hiệu hóa
  // Vì chỉ sử dụng OAuth, không cần mật khẩu

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ 
    summary: 'Lấy thông tin profile hiện tại',
    description: 'Lấy thông tin chi tiết của người dùng đang đăng nhập.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Thông tin profile được lấy thành công',
    schema: {
      example: {
        id: 1,
        username: 'john_doe',
        email: 'john.doe@example.com',
        role: Role.User,
        displayName: 'John Doe',
        profilePicture: 'https://example.com/avatar.jpg',
        isVerified: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  @ApiBearerAuth()
  getProfile(@Request() req) {
    return this.authService.validateUser(req.user.userId);
  }

  @Public()
  @Get('oauth-status')
  @ApiOperation({ 
    summary: 'Kiểm tra trạng thái cấu hình OAuth',
    description: 'Kiểm tra xem Google và Facebook OAuth đã được cấu hình hay chưa.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Trạng thái OAuth được lấy thành công',
    schema: {
      example: {
        google: true,
        facebook: false
      }
    }
  })
  getOAuthStatus() {
    return {
      google: this.loginGoogleEnabled,
      facebook: this.loginFbEnabled,
      zalo: this.loginZaloEnabled,
    };
  }



  // ===== DUPLICATE GOOGLE CALLBACK REMOVED =====
  // Route Google callback trùng lặp đã được xóa bỏ

  // ===== REFRESH TOKEN & LOGOUT ROUTES REMOVED =====
  // Các route refresh-token và logout cũ đã được xóa bỏ vì NextAuth tự quản lý session
} 