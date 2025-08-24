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
import { WaterService } from './water.service';
import { CreateWaterIntakeDto } from './dto/create-water-intake.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Water')
@Controller('water')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WaterController {
  constructor(
    private readonly waterService: WaterService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Ghi nhận uống nước' })
  @ApiResponse({ status: 201, description: 'Ghi nhận thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  async create(@Body() createWaterIntakeDto: CreateWaterIntakeDto, @Request() req) {
    return await this.waterService.create(createWaterIntakeDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả bản ghi uống nước' })
  @ApiResponse({ status: 200, description: 'Danh sách bản ghi' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  findAll(@Request() req) {
    return this.waterService.findAllByUserId(req.user.userId);
  }

  @Get('today')
  @ApiOperation({ summary: 'Lấy tiến độ uống nước hôm nay' })
  @ApiResponse({ status: 200, description: 'Tiến độ hôm nay' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  getTodayProgress(@Request() req) {
    return this.waterService.getTodayProgress(req.user.userId);
  }

  @Get('stats/:date')
  @ApiOperation({ summary: 'Thống kê uống nước theo ngày' })
  @ApiResponse({ status: 200, description: 'Thống kê chi tiết' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  getStatsByDate(@Param('date') date: string, @Request() req) {
    return this.waterService.getStatsByDate(req.user.userId, date);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy bản ghi theo ID' })
  @ApiResponse({ status: 200, description: 'Bản ghi tìm thấy' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  findOne(@Param('id') id: string) {
    return this.waterService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật bản ghi' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  update(@Param('id') id: string, @Body() updateWaterIntakeDto: any) {
    return this.waterService.update(+id, updateWaterIntakeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa bản ghi' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  remove(@Param('id') id: string) {
    return this.waterService.remove(+id);
  }
} 