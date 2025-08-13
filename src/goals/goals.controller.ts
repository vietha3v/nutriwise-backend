import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal, GoalStatus, GoalType } from './entities/goal.entity';

@ApiTags('Goals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mục tiêu mới' })
  @ApiResponse({ status: 201, description: 'Tạo mục tiêu thành công', type: Goal })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Không được phép' })
  async create(@Request() req, @Body() createGoalDto: CreateGoalDto): Promise<Goal> {
    return this.goalsService.create(req.user.userId, createGoalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách mục tiêu' })
  @ApiQuery({ name: 'status', required: false, enum: GoalStatus, description: 'Lọc theo trạng thái' })
  @ApiQuery({ name: 'goalType', required: false, description: 'Lọc theo loại mục tiêu' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công', type: [Goal] })
  @ApiResponse({ status: 401, description: 'Không được phép' })
  async findAll(
    @Request() req,
    @Query('status') status?: GoalStatus,
    @Query('goalType') goalType?: GoalType,
  ): Promise<Goal[]> {
    if (status === GoalStatus.ACTIVE) {
      return this.goalsService.getActiveGoals(req.user.userId);
    }
    if (goalType) {
      return this.goalsService.getGoalsByType(req.user.userId, goalType);
    }
    return this.goalsService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết mục tiêu' })
  @ApiResponse({ status: 200, description: 'Lấy chi tiết thành công', type: Goal })
  @ApiResponse({ status: 401, description: 'Không được phép' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy mục tiêu' })
  async findOne(@Request() req, @Param('id') id: string): Promise<Goal> {
    return this.goalsService.findOne(req.user.userId, +id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật mục tiêu' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công', type: Goal })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Không được phép' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy mục tiêu' })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto,
  ): Promise<Goal> {
    return this.goalsService.update(req.user.userId, +id, updateGoalDto);
  }

  @Patch(':id/priority')
  @ApiOperation({ summary: 'Cập nhật thứ tự ưu tiên' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công', type: Goal })
  @ApiResponse({ status: 400, description: 'Priority không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Không được phép' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy mục tiêu' })
  async updatePriority(
    @Request() req,
    @Param('id') id: string,
    @Body('priority') priority: number,
  ): Promise<Goal> {
    return this.goalsService.updatePriority(req.user.userId, +id, priority);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái mục tiêu' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công', type: Goal })
  @ApiResponse({ status: 400, description: 'Status không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Không được phép' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy mục tiêu' })
  async updateStatus(
    @Request() req,
    @Param('id') id: string,
    @Body('status') status: GoalStatus,
  ): Promise<Goal> {
    return this.goalsService.updateStatus(req.user.userId, +id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa mục tiêu' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 401, description: 'Không được phép' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy mục tiêu' })
  async remove(@Request() req, @Param('id') id: string): Promise<void> {
    return this.goalsService.remove(req.user.userId, +id);
  }
}
