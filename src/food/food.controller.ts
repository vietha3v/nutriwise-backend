import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FoodService } from './food.service';

@ApiTags('Food System')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('foods')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả thực phẩm' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thực phẩm thành công' })
  async findAll(): Promise<any[]> {
    return await this.foodService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm thực phẩm' })
  @ApiQuery({ name: 'query', description: 'Từ khóa tìm kiếm' })
  @ApiResponse({ status: 200, description: 'Tìm kiếm thực phẩm thành công' })
  async searchFoods(@Query('query') query: string): Promise<any[]> {
    return await this.foodService.searchFoods(query);
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Lấy sở thích thực phẩm của người dùng' })
  @ApiResponse({ status: 200, description: 'Lấy sở thích thành công' })
  async getUserPreferences(@Request() req): Promise<any[]> {
    return await this.foodService.getUserPreferences(req.user.userId);
  }

  @Post('preferences')
  @ApiOperation({ summary: 'Cập nhật sở thích thực phẩm' })
  @ApiResponse({ status: 201, description: 'Cập nhật sở thích thành công' })
  async updateUserPreference(
    @Request() req,
    @Body() body: {
      foodId: number;
      preferenceLevel: number;
      dislikeReason?: string;
      isAllergic?: boolean;
    },
  ): Promise<any> {
    return await this.foodService.updateUserPreference(
      req.user.userId,
      body.foodId,
      body.preferenceLevel,
      body.dislikeReason,
      body.isAllergic,
    );
  }

  @Get('availability')
  @ApiOperation({ summary: 'Lấy thực phẩm có sẵn của người dùng' })
  @ApiQuery({ name: 'date', description: 'Ngày (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Lấy thực phẩm có sẵn thành công' })
  async getDailyAvailability(
    @Request() req,
    @Query('date') date: string,
  ): Promise<any[]> {
    return await this.foodService.getDailyAvailability(req.user.userId, new Date(date));
  }

  @Post('availability')
  @ApiOperation({ summary: 'Cập nhật thực phẩm có sẵn' })
  @ApiResponse({ status: 201, description: 'Cập nhật thực phẩm có sẵn thành công' })
  async updateDailyAvailability(
    @Request() req,
    @Body() body: {
      date: string;
      availableFoods: {
        foodId: number;
        foodName: string;
        quantity: number;
        unit: string;
        notes?: string;
      }[];
      notes?: string;
    },
  ): Promise<any> {
    return await this.foodService.updateDailyAvailability(
      req.user.userId,
      new Date(body.date),
      body.availableFoods,
      body.notes,
    );
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Lấy gợi ý bữa ăn' })
  @ApiQuery({ name: 'date', description: 'Ngày (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Lấy gợi ý bữa ăn thành công' })
  async getMealSuggestions(
    @Request() req,
    @Query('date') date: string,
  ): Promise<any[]> {
    return await this.foodService.getMealSuggestions(req.user.userId, new Date(date));
  }

  @Post('suggestions/:mealType/feedback')
  @ApiOperation({ summary: 'Cập nhật phản hồi gợi ý bữa ăn' })
  @ApiParam({ name: 'mealType', description: 'Loại bữa ăn' })
  @ApiResponse({ status: 200, description: 'Cập nhật phản hồi thành công' })
  async updateMealSuggestionFeedback(
    @Request() req,
    @Param('mealType') mealType: string,
    @Body() body: { date: string; feedback?: string },
  ): Promise<any> {
    return await this.foodService.updateMealSuggestionFeedback(
      req.user.userId,
      new Date(body.date),
      mealType,
      body.feedback,
    );
  }
} 