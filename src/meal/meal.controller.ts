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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MealService } from './meal.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Meals')
@Controller('meals')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new meal' })
  @ApiResponse({ status: 201, description: 'Meal created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createMealDto: CreateMealDto, @Request() req) {
    createMealDto.userId = req.user.userId;
    return this.mealService.create(createMealDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all meals for current user' })
  @ApiResponse({ status: 200, description: 'List of meals' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Request() req) {
    return this.mealService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get meal by ID' })
  @ApiResponse({ status: 200, description: 'Meal found' })
  @ApiResponse({ status: 404, description: 'Meal not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.mealService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update meal' })
  @ApiResponse({ status: 200, description: 'Meal updated successfully' })
  @ApiResponse({ status: 404, description: 'Meal not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateMealDto: any) {
    return this.mealService.update(+id, updateMealDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete meal' })
  @ApiResponse({ status: 200, description: 'Meal deleted successfully' })
  @ApiResponse({ status: 404, description: 'Meal not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.mealService.remove(+id);
  }
} 