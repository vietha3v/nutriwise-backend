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
import { NutritionGoalService } from './nutrition-goal.service';
import { CreateNutritionGoalDto } from './dto/create-nutrition-goal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { NutritionGoal } from './entities/nutrition-goal.entity';

@ApiTags('Nutrition Goals')
@Controller('nutrition-goals')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NutritionGoalController {
  constructor(private readonly nutritionGoalService: NutritionGoalService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mục tiêu dinh dưỡng mới' })
  @ApiResponse({ status: 201, description: 'Tạo mục tiêu dinh dưỡng thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  async create(
    @Body() createNutritionGoalDto: CreateNutritionGoalDto,
    @Request() req,
  ): Promise<NutritionGoal> {
    return this.nutritionGoalService.create(createNutritionGoalDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all nutrition goals for current user' })
  @ApiResponse({ status: 200, description: 'List of nutrition goals' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Request() req) {
    return this.nutritionGoalService.findAll(req.user.userId);
  }

  @Get('personal')
  @ApiOperation({ summary: 'Get personal nutrition goals and progress' })
  @ApiResponse({ status: 200, description: 'Personal nutrition goals and progress' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getPersonalGoals(@Request() req) {
    return this.nutritionGoalService.calculatePersonalizedGoals(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get nutrition goal by ID' })
  @ApiResponse({ status: 200, description: 'Nutrition goal found' })
  @ApiResponse({ status: 404, description: 'Nutrition goal not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.nutritionGoalService.findOne(+id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update nutrition goal' })
  @ApiResponse({ status: 200, description: 'Nutrition goal updated successfully' })
  @ApiResponse({ status: 404, description: 'Nutrition goal not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateNutritionGoalDto: any, @Request() req) {
    return this.nutritionGoalService.update(+id, updateNutritionGoalDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete nutrition goal' })
  @ApiResponse({ status: 200, description: 'Nutrition goal deleted successfully' })
  @ApiResponse({ status: 404, description: 'Nutrition goal not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string, @Request() req) {
    return this.nutritionGoalService.remove(+id, req.user.userId);
  }
} 