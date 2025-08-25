import { Controller, Get, Post, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AiAnalysisService } from './ai-analysis.service';

// Define the ProfileAnalysis interface locally since it's not exported from service
interface ProfileAnalysis {
  healthAssessment: {
    overallHealth: string;
    bodyType: string;
    healthScore: number;
    weightAnalysis: any;
    bodyFatAnalysis: any;
    muscleAnalysis: any;
    visceralFatAnalysis: any;
  };
  comparisonWithStandards: {
    ageGroup: string;
    genderGroup: string;
    percentile: number;
    ranking: string;
  };
  healthIssues: {
    immediate: string[];
    longTerm: string[];
    recommendations: string[];
  };
}

@ApiTags('AI Analysis')
@Controller('ai-analysis')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AiAnalysisController {
  constructor(private readonly aiAnalysisService: AiAnalysisService) {}

  @Get('hydration-expert-analysis')
  @ApiOperation({ 
    summary: 'Phân tích chuyên gia dinh dưỡng về tác động của nước lên profile',
    description: 'Phân tích chi tiết tác động của thói quen uống nước lên các chỉ số sức khỏe và đưa ra bài viết phân tích chuyên gia'
  })
  @ApiQuery({ 
    name: 'period', 
    enum: ['week', 'month'], 
    description: 'Thời gian phân tích (tuần/tháng)',
    default: 'month'
  })
  @ApiQuery({ 
    name: 'analysisType', 
    enum: ['comprehensive', 'focused'], 
    description: 'Loại phân tích (toàn diện/tập trung)',
    default: 'comprehensive'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Phân tích chuyên gia thành công',
    schema: {
      type: 'object',
      properties: {
        period: { type: 'string' },
        analysisType: { type: 'string' },
        expertAnalysis: { type: 'string', description: 'Text phân tích từ chuyên gia dinh dưỡng' },
        dataSummary: { type: 'object' },
        generatedAt: { type: 'string' },
        aiModel: { type: 'string' },
        tokensUsed: { type: 'number' },
        costUsd: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy dữ liệu' })
  async getHydrationExpertAnalysis(
    @Request() req,
    @Query('period') period: 'week' | 'month' = 'month',
    @Query('analysisType') analysisType: 'comprehensive' | 'focused' = 'comprehensive',
  ): Promise<any> {
    return this.aiAnalysisService.generateHydrationExpertAnalysis(req.user.userId, period, analysisType);
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
        analysis: { type: 'string', description: 'Text phân tích từ chuyên gia sức khỏe' },
        dataSummary: { type: 'object' },
        generatedAt: { type: 'string' },
        aiModel: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Không được phép' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hồ sơ người dùng' })
  async analyzeProfile(
    @Request() req,
    @Query('forceRefresh') forceRefresh?: boolean,
  ): Promise<any> {
    return this.aiAnalysisService.analyzeProfile(req.user.userId, forceRefresh);
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
    await this.aiAnalysisService.refreshCache(req.user.userId, requestType);
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
    return this.aiAnalysisService.getCacheStats(req.user.userId);
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
        : 'Tích hợp GPT chưa được cấu hình',
      config: {
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        maxTokens: process.env.OPENAI_MAX_TOKENS || '2000',
        temperature: process.env.OPENAI_TEMPERATURE || '0.7',
      }
    };
  }
}
