import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
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
  @ApiOperation({ 
    summary: 'Đăng ký tài khoản mới',
    description: 'Cho phép người dùng tạo tài khoản mới với thông tin cơ bản. Hệ thống sẽ gửi email xác thực để kích hoạt tài khoản.'
  })
  @ApiBody({ 
    type: RegisterDto,
    description: 'Thông tin đăng ký tài khoản'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Đăng ký thành công. Tài khoản được tạo với vai trò mặc định là User.',
    schema: {
      example: {
        id: 1,
        username: 'john_doe',
        email: 'john.doe@example.com',
        role: 'User',
        isVerified: false,
        message: 'Vui lòng kiểm tra email để xác thực tài khoản'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dữ liệu không hợp lệ',
    schema: {
      example: {
        statusCode: 400,
        message: ['username must be longer than or equal to 3 characters'],
        error: 'Bad Request'
      }
    }
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Username hoặc email đã tồn tại',
    schema: {
      example: {
        statusCode: 409,
        message: 'Username or email already exists',
        error: 'Conflict'
      }
    }
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ 
    summary: 'Đăng nhập bằng username/email và mật khẩu',
    description: 'Xác thực người dùng và trả về JWT token để truy cập hệ thống.'
  })
  @ApiBody({ 
    type: LoginDto,
    description: 'Thông tin đăng nhập'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Đăng nhập thành công',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          username: 'john_doe',
          email: 'john.doe@example.com',
          role: 'User',
          displayName: 'John Doe',
          profilePicture: 'https://example.com/avatar.jpg'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Thông tin đăng nhập không chính xác',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized'
      }
    }
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

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
          role: 'User',
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
          role: 'User',
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
  @Post('forgot-password')
  @ApiOperation({ 
    summary: 'Gửi email reset mật khẩu',
    description: 'Gửi email chứa link reset mật khẩu đến địa chỉ email đã đăng ký.'
  })
  @ApiBody({ 
    type: ForgotPasswordDto,
    description: 'Email cần reset mật khẩu'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Email reset mật khẩu đã được gửi (nếu tài khoản tồn tại)',
    schema: {
      example: {
        message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được email reset mật khẩu trong vài phút.'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Email không hợp lệ'
  })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ 
    summary: 'Đặt lại mật khẩu với token',
    description: 'Đặt lại mật khẩu mới bằng token từ email.'
  })
  @ApiBody({ 
    type: ResetPasswordDto,
    description: 'Token và mật khẩu mới'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Mật khẩu đã được đặt lại thành công',
    schema: {
      example: {
        message: 'Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập lại.'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token không hợp lệ hoặc đã hết hạn',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid or expired token',
        error: 'Unauthorized'
      }
    }
  })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

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
        role: 'User',
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
    };
  }
} 