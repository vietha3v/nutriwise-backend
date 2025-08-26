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
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Exercise')
@Controller('exercise')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  @ApiOperation({ summary: 'Log exercise activity' })
  @ApiResponse({ status: 201, description: 'Exercise logged successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createExerciseDto: CreateExerciseDto, @Request() req) {
    createExerciseDto.userId = req.user.userId;
    return this.exerciseService.create(createExerciseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all exercise records for current user' })
  @ApiResponse({ status: 200, description: 'List of exercise records' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Request() req) {
    return this.exerciseService.findAll(req.user.userId);
  }

  @Get('goals')
  @ApiOperation({ summary: 'Get exercise goals and progress for current user' })
  @ApiResponse({ status: 200, description: 'Exercise goals and progress' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getExerciseGoals(@Request() req) {
    return this.exerciseService.getExerciseGoals(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exercise by ID' })
  @ApiResponse({ status: 200, description: 'Exercise found' })
  @ApiResponse({ status: 404, description: 'Exercise not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.exerciseService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update exercise' })
  @ApiResponse({ status: 200, description: 'Exercise updated successfully' })
  @ApiResponse({ status: 404, description: 'Exercise not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateExerciseDto: any) {
    return this.exerciseService.update(+id, updateExerciseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete exercise' })
  @ApiResponse({ status: 200, description: 'Exercise deleted successfully' })
  @ApiResponse({ status: 404, description: 'Exercise not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.exerciseService.remove(+id);
  }
} 