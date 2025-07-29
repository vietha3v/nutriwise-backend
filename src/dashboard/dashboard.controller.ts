import {
  Controller,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get dashboard data for current user' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getDashboardData(@Request() req) {
    return this.dashboardService.getDashboardData(req.user.userId);
  }

  @Get('weekly-report')
  @ApiOperation({ summary: 'Get weekly nutrition report for current user' })
  @ApiResponse({ status: 200, description: 'Weekly report retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getWeeklyReport(@Request() req) {
    return this.dashboardService.getWeeklyReport(req.user.userId);
  }
} 