import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MealService } from './meal.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Meals')
@Controller('meals')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MealController {
  constructor(
    private readonly mealService: MealService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new meal' })
  @ApiResponse({ status: 201, description: 'Meal created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createMealDto: CreateMealDto, @Request() req) {
    return this.mealService.create(req.user.userId, createMealDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all meals for current user' })
  @ApiResponse({ status: 200, description: 'List of meals' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Request() req) {
    return this.mealService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get meal by ID' })
  @ApiResponse({ status: 200, description: 'Meal found' })
  @ApiResponse({ status: 404, description: 'Meal not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.mealService.findOne(+id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update meal' })
  @ApiResponse({ status: 200, description: 'Meal updated successfully' })
  @ApiResponse({ status: 404, description: 'Meal not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateMealDto: any, @Request() req) {
    return this.mealService.update(+id, req.user.userId, updateMealDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete meal' })
  @ApiResponse({ status: 200, description: 'Meal deleted successfully' })
  @ApiResponse({ status: 404, description: 'Meal not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string, @Request() req) {
    return this.mealService.remove(+id, req.user.userId);
  }

  // Meal by date endpoints
  @Get('by-date/:date')
  @ApiOperation({ summary: 'Get meals by date' })
  @ApiResponse({ status: 200, description: 'List of meals for the date' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByDate(@Param('date') date: string, @Request() req) {
    return this.mealService.findByDate(req.user.userId, date);
  }

  @Get('by-date-range')
  @ApiOperation({ summary: 'Get meals by date range' })
  @ApiQuery({ name: 'startDate', description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', description: 'End date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'List of meals in date range' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Request() req,
  ) {
    return this.mealService.findByDateRange(req.user.userId, startDate, endDate);
  }

  // Statistics endpoints
  @Get('stats/daily/:date')
  @ApiOperation({ summary: 'Get daily nutrition statistics' })
  @ApiResponse({ status: 200, description: 'Daily statistics' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getDailyStats(@Param('date') date: string, @Request() req) {
    return this.mealService.getDailyStats(req.user.userId, date);
  }

  @Get('stats/weekly')
  @ApiOperation({ summary: 'Get weekly nutrition statistics' })
  @ApiQuery({ name: 'startDate', description: 'Start date of week (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Weekly statistics' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getWeeklyStats(@Query('startDate') startDate: string, @Request() req) {
    return this.mealService.getWeeklyStats(req.user.userId, startDate);
  }

  @Get('stats/monthly')
  @ApiOperation({ summary: 'Get monthly nutrition statistics' })
  @ApiQuery({ name: 'year', description: 'Year (YYYY)' })
  @ApiQuery({ name: 'month', description: 'Month (1-12)' })
  @ApiResponse({ status: 200, description: 'Monthly statistics' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMonthlyStats(
    @Query('year') year: string,
    @Query('month') month: string,
    @Request() req,
  ) {
    return this.mealService.getMonthlyStats(req.user.userId, +year, +month);
  }
} 