import { Controller, Get, Post, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AiService, ProfileAnalysis } from './ai.service';

@ApiTags('AI')
@Controller('ai')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('water-analysis')
  @ApiOperation({ 
    summary: 'Phân tích uống nước và đưa lời khuyên',
    description: 'Phân tích thói quen uống nước theo ngày/tuần và đưa ra lời khuyên cá nhân hóa'
  })
  @ApiQuery({ 
    name: 'period', 
    enum: ['day', 'week'], 
    description: 'Thời gian phân tích (ngày/tuần)',
    default: 'day'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Phân tích uống nước thành công',
    schema: {
      type: 'object',
      properties: {
        period: { type: 'string', enum: ['day', 'week'] },
        analysis: {
          type: 'object',
          properties: {
            totalIntake: { type: 'number', description: 'Tổng lượng nước uống (ml)' },
            averagePerDay: { type: 'number', description: 'Trung bình mỗi ngày (ml)' },
            goalAchievement: { type: 'number', description: 'Tỷ lệ đạt mục tiêu (%)' },
            consistency: { type: 'string', enum: ['EXCELLENT', 'GOOD', 'AVERAGE', 'POOR'] },
            hydrationScore: { type: 'number', description: 'Điểm hydrat hóa (0-100)' }
          }
        },
        patterns: {
          type: 'object',
          properties: {
            bestTime: { type: 'string', description: 'Thời gian uống nước tốt nhất' },
            worstTime: { type: 'string', description: 'Thời gian uống nước ít nhất' },
            frequency: { type: 'string', description: 'Tần suất uống nước' },
            interval: { type: 'number', description: 'Khoảng cách trung bình giữa các lần uống (phút)' }
          }
        },
        recommendations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['IMMEDIATE', 'SHORT_TERM', 'LONG_TERM'] },
              priority: { type: 'number', description: 'Mức độ ưu tiên (1-5)' },
              title: { type: 'string' },
              description: { type: 'string' },
              actionable: { type: 'boolean' }
            }
          }
        },
        insights: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy dữ liệu' })
  async getWaterAnalysis(
    @Request() req,
    @Query('period') period: 'day' | 'week' = 'day',
  ): Promise<any> {
    return this.aiService.analyzeWaterIntake(req.user.userId, period);
  }

  @Get('profile-analysis')
  @ApiOperation({ 
    summary: 'Phân tích profile người dùng',
    description: 'Phân tích các chỉ số sức khỏe hiện tại, đánh giá tình trạng và so sánh với tiêu chuẩn'
  })
  @ApiQuery({ 
    name: 'forceRefresh', 
    required: false, 
    type: Boolean, 
    description: 'Buộc làm mới cache (mặc định: false)' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Phân tích profile thành công',
    schema: {
      type: 'object',
      properties: {
        healthAssessment: {
          type: 'object',
          properties: {
            overallHealth: { type: 'string', enum: ['GOOD', 'AVERAGE', 'NEEDS_IMPROVEMENT'] },
            bodyType: { type: 'string', enum: ['ECTOMORPH', 'MESOMORPH', 'ENDOMORPH'] },
            healthScore: { type: 'number' },
            weightAnalysis: { type: 'object' },
            bodyFatAnalysis: { type: 'object' },
            muscleAnalysis: { type: 'object' },
            visceralFatAnalysis: { type: 'object' }
          }
        },
        comparisonWithStandards: {
          type: 'object',
          properties: {
            ageGroup: { type: 'string' },
            genderGroup: { type: 'string' },
            percentile: { type: 'number' },
            ranking: { type: 'string', enum: ['BOTTOM_25%', '25-50%', '50-75%', 'TOP_25%'] }
          }
        },
        healthIssues: {
          type: 'object',
          properties: {
            immediate: { type: 'array', items: { type: 'string' } },
            longTerm: { type: 'array', items: { type: 'string' } },
            recommendations: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Không được phép' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hồ sơ người dùng' })
  async analyzeProfile(
    @Request() req,
    @Query('forceRefresh') forceRefresh?: boolean,
  ): Promise<ProfileAnalysis> {
    return this.aiService.analyzeProfile(req.user.userId, forceRefresh);
  }

  @Post('refresh-cache')
  @ApiOperation({ summary: 'Làm mới cache AI cho người dùng' })
  @ApiQuery({ name: 'requestType', required: false, type: String, description: 'Loại yêu cầu cụ thể để làm mới' })
  @ApiResponse({ status: 200, description: 'Làm mới cache thành công' })
  @ApiResponse({ status: 401, description: 'Không được phép' })
  async refreshCache(
    @Request() req,
    @Query('requestType') requestType?: string,
  ): Promise<{ message: string; refreshedCount: number }> {
    await this.aiService.refreshCache(req.user.userId, requestType);
    return { 
      message: 'Làm mới cache thành công',
      refreshedCount: requestType ? 1 : 2 // 2 loại yêu cầu: profile_analysis và water_analysis
    };
  }

  @Get('cache-stats')
  @ApiOperation({ summary: 'Lấy thống kê cache AI cho người dùng' })
  @ApiResponse({ status: 200, description: 'Lấy thống kê cache thành công', type: Object })
  @ApiResponse({ status: 401, description: 'Không được phép' })
  async getCacheStats(@Request() req): Promise<any> {
    return this.aiService.getCacheStats(req.user.userId);
  }

  @Get('gpt-status')
  @ApiOperation({ summary: 'Kiểm tra trạng thái tích hợp GPT' })
  @ApiResponse({ status: 200, description: 'Lấy trạng thái GPT thành công', type: Object })
  @ApiResponse({ status: 401, description: 'Không được phép' })
  async getGptStatus(): Promise<{ isAvailable: boolean; message: string; config: any }> {
    // This would check if OpenAI is properly configured
    const isAvailable = process.env.OPENAI_API_KEY ? true : false;
    return {
      isAvailable,
      message: isAvailable 
        ? 'Tích hợp GPT có sẵn' 
        : 'Tích hợp GPT chưa được cấu hình. Sử dụng tính toán dự phòng.',
      config: {
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        maxTokens: process.env.OPENAI_MAX_TOKENS || '2000',
        temperature: process.env.OPENAI_TEMPERATURE || '0.7',
        cacheEnabled: process.env.AI_CACHE_ENABLED === 'true',
        cacheExpiryHours: process.env.AI_CACHE_EXPIRY_HOURS || '24',
      }
    };
  }
}
