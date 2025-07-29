import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { AiService, ExerciseGoals, NutritionGoals, ProgressAnalysis, WeeklyMealPlan, SmartMealSuggestion } from './ai.service';

@ApiTags('AI')
@Controller('ai')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('exercise-goals')
  @ApiOperation({ summary: 'Lấy mục tiêu tập luyện cá nhân hóa' })
  @ApiQuery({ name: 'forceRefresh', required: false, type: Boolean, description: 'Buộc làm mới cache' })
  @ApiResponse({ status: 200, description: 'Lấy mục tiêu tập luyện thành công', type: Object })
  @ApiResponse({ status: 401, description: 'Không được phép' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hồ sơ' })
  async getExerciseGoals(
    @Request() req,
    @Query('forceRefresh') forceRefresh?: boolean,
  ): Promise<ExerciseGoals> {
    return this.aiService.calculateExerciseGoals(req.user.userId, forceRefresh);
  }

  @Get('nutrition-goals')
  @ApiOperation({ summary: 'Lấy mục tiêu dinh dưỡng cá nhân hóa' })
  @ApiQuery({ name: 'forceRefresh', required: false, type: Boolean, description: 'Buộc làm mới cache' })
  @ApiResponse({ status: 200, description: 'Lấy mục tiêu dinh dưỡng thành công', type: Object })
  @ApiResponse({ status: 401, description: 'Không được phép' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hồ sơ' })
  async getNutritionGoals(
    @Request() req,
    @Query('forceRefresh') forceRefresh?: boolean,
  ): Promise<NutritionGoals> {
    return this.aiService.calculateNutritionGoals(req.user.userId, forceRefresh);
  }

  @Get('progress-analysis')
  @ApiOperation({ summary: 'Phân tích tiến độ người dùng' })
  @ApiQuery({ name: 'forceRefresh', required: false, type: Boolean, description: 'Buộc làm mới cache' })
  @ApiResponse({ status: 200, description: 'Phân tích tiến độ thành công', type: Object })
  @ApiResponse({ status: 401, description: 'Không được phép' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hồ sơ' })
  async getProgressAnalysis(
    @Request() req,
    @Query('forceRefresh') forceRefresh?: boolean,
  ): Promise<ProgressAnalysis> {
    return this.aiService.analyzeProgress(req.user.userId, forceRefresh);
  }

  @Get('weekly-meal-plan')
  @ApiOperation({ summary: 'Tạo kế hoạch ăn uống hàng tuần' })
  @ApiQuery({ name: 'forceRefresh', required: false, type: Boolean, description: 'Buộc làm mới cache' })
  @ApiResponse({ status: 200, description: 'Tạo kế hoạch ăn uống thành công', type: Object })
  @ApiResponse({ status: 401, description: 'Không được phép' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hồ sơ' })
  async getWeeklyMealPlan(
    @Request() req,
    @Query('forceRefresh') forceRefresh?: boolean,
  ): Promise<WeeklyMealPlan> {
    return this.aiService.generateWeeklyMealPlan(req.user.userId, forceRefresh);
  }

  @Get('smart-meal-suggestion/:mealType')
  @ApiOperation({ summary: 'Tạo gợi ý bữa ăn thông minh dựa trên thực phẩm có sẵn' })
  @ApiParam({ name: 'mealType', description: 'Loại bữa ăn (breakfast, lunch, dinner, snack)' })
  @ApiQuery({ name: 'date', description: 'Ngày (YYYY-MM-DD)', required: false })
  @ApiQuery({ name: 'forceRefresh', required: false, type: Boolean, description: 'Buộc làm mới cache' })
  @ApiResponse({ status: 200, description: 'Tạo gợi ý bữa ăn thành công', type: Object })
  @ApiResponse({ status: 401, description: 'Không được phép' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hồ sơ' })
  async getSmartMealSuggestion(
    @Request() req,
    @Param('mealType') mealType: string,
    @Query('date') date?: string,
    @Query('forceRefresh') forceRefresh?: boolean,
  ): Promise<SmartMealSuggestion> {
    const targetDate = date ? new Date(date) : new Date();
    return this.aiService.generateSmartMealSuggestion(
      req.user.userId,
      mealType,
      targetDate,
      forceRefresh,
    );
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
      refreshedCount: requestType ? 1 : 4 // 4 loại yêu cầu khác nhau
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