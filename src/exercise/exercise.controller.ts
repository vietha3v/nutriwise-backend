import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ExerciseService } from './exercise.service';
import { CreateExerciseTemplateDto } from './dto/create-exercise-template.dto';
import { CreateExerciseSessionDto } from './dto/create-exercise-session.dto';
import { ExerciseTemplateSearchDto } from './dto/exercise-template-search.dto';
import { ExerciseSessionSearchDto } from './dto/exercise-session-search.dto';
import { ExerciseStatsDto } from './dto/exercise-stats.dto';

@ApiTags('Exercise')
@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  // ==================== EXERCISE TEMPLATES (PUBLIC) ====================

  @Get('templates')
  @ApiOperation({ summary: 'Get exercise templates with filters' })
  @ApiResponse({ status: 200, description: 'List of exercise templates' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name or description' })
  @ApiQuery({ name: 'bodyPart', required: false, description: 'Filter by body part' })
  @ApiQuery({ name: 'exerciseType', required: false, description: 'Filter by exercise type' })
  @ApiQuery({ name: 'difficultyLevel', required: false, description: 'Filter by difficulty level (1-5)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  findAllTemplates(@Query() searchDto: ExerciseTemplateSearchDto) {
    return this.exerciseService.findAllTemplates(searchDto);
  }

  @Get('templates/:id')
  @ApiOperation({ summary: 'Get exercise template by ID' })
  @ApiResponse({ status: 200, description: 'Exercise template details' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  findTemplateById(@Param('id', ParseIntPipe) id: number) {
    return this.exerciseService.findTemplateById(id);
  }

  // ==================== EXERCISE SESSIONS (USER-SPECIFIC) ====================

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user exercise sessions' })
  @ApiResponse({ status: 200, description: 'List of user exercise sessions' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date filter (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date filter (YYYY-MM-DD)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  findAllSessions(@Query() searchDto: ExerciseSessionSearchDto, @Request() req) {
    return this.exerciseService.findAllSessions(req.user.userId, searchDto);
  }

  @Post('sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new exercise session' })
  @ApiResponse({ status: 201, description: 'Exercise session created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createSession(@Body() createDto: CreateExerciseSessionDto, @Request() req) {
    return this.exerciseService.createSession(req.user.userId, createDto);
  }

  @Delete('sessions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete exercise session' })
  @ApiResponse({ status: 200, description: 'Exercise session deleted successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  deleteSession(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.exerciseService.deleteSession(req.user.userId, id);
  }

  // ==================== STATISTICS ====================

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get exercise statistics' })
  @ApiResponse({ status: 200, description: 'Exercise statistics' })
  @ApiQuery({ name: 'period', required: false, description: 'Stats period (day, week, month, year)' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for stats (YYYY-MM-DD)' })
  getStats(@Query() statsDto: ExerciseStatsDto, @Request() req) {
    return this.exerciseService.getStats(req.user.userId, statsDto);
  }

  // ==================== ADMIN ENDPOINTS ====================

  @Post('admin/templates')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SystemAdmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create exercise template (Admin only)' })
  @ApiResponse({ status: 201, description: 'Exercise template created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  createTemplate(@Body() createDto: CreateExerciseTemplateDto) {
    return this.exerciseService.createTemplate(createDto);
  }

  @Patch('admin/templates/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SystemAdmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update exercise template (Admin only)' })
  @ApiResponse({ status: 200, description: 'Exercise template updated successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  updateTemplate(@Param('id', ParseIntPipe) id: number, @Body() updateDto: Partial<CreateExerciseTemplateDto>) {
    return this.exerciseService.updateTemplate(id, updateDto);
  }

  @Delete('admin/templates/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SystemAdmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete exercise template (Admin only)' })
  @ApiResponse({ status: 200, description: 'Exercise template deleted successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  deleteTemplate(@Param('id', ParseIntPipe) id: number) {
    return this.exerciseService.deleteTemplate(id);
  }
}
