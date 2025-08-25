import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { WaterService } from './water.service';
import { CreateWaterIntakeDto } from './dto/create-water-intake.dto';
import { WaterResponseDto } from './dto/water-response.dto';
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
  @ApiOperation({ 
    summary: 'Ghi nhận uống nước',
    description: 'Tạo bản ghi mới về việc uống nước của người dùng. Hệ thống sẽ lưu trữ lượng nước (ml) và thời gian uống.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Ghi nhận thành công',
    type: WaterResponseDto
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ - kiểm tra amount phải > 0 và datetime không được trong tương lai' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập hoặc token không hợp lệ' })
  async create(@Body() createWaterIntakeDto: CreateWaterIntakeDto, @Request() req) {
    return await this.waterService.create(createWaterIntakeDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Lấy thông tin uống nước',
    description: 'Lấy danh sách bản ghi uống nước và tiến độ uống nước theo ngày. Mặc định lấy dữ liệu hôm nay, hoặc có thể truyền tham số date (ISO 8601) để lấy dữ liệu theo ngày cụ thể. Lượng nước cần uống được tính toán tự động dựa trên thông tin cá nhân.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Thông tin uống nước',
    schema: {
      type: 'object',
      properties: {
        records: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              amount: { type: 'number', example: 250 },
              datetime: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          },
          description: 'Danh sách tất cả bản ghi uống nước, sắp xếp theo thời gian giảm dần'
        },
        progress: {
          oneOf: [
            {
              type: 'object',
              properties: {
                totalDrank: { type: 'number', example: 1500, description: 'Tổng lượng đã uống (ml)' },
                dailyGoal: { type: 'number', example: 2000, description: 'Mục tiêu hàng ngày (ml)' },
                remaining: { type: 'number', example: 500, description: 'Lượng còn lại cần uống (ml)' },
                progressPercentage: { type: 'number', example: 75, description: 'Phần trăm hoàn thành (%)' },
                recordCount: { type: 'number', example: 6, description: 'Số lần uống nước' },
                lastDrinkTime: { type: 'string', format: 'date-time', example: '2024-01-15T16:30:00.000Z', description: 'Thời gian uống nước cuối cùng' },
                hourlyData: { type: 'array', items: { type: 'number' }, description: 'Dữ liệu uống nước theo giờ' },
                hourlyCount: { type: 'array', items: { type: 'number' }, description: 'Số lần uống nước theo giờ' }
              },
              description: 'Thống kê chi tiết theo ngày (khi truyền tham số date)'
            },
            {
              type: 'object',
              properties: {
                todayProgress: {
                  type: 'object',
                  properties: {
                    totalDrank: { type: 'number', example: 1500, description: 'Tổng lượng đã uống hôm nay (ml)' },
                    dailyGoal: { type: 'number', example: 2000, description: 'Mục tiêu hàng ngày (ml)' },
                    remaining: { type: 'number', example: 500, description: 'Lượng còn lại cần uống (ml)' },
                    progressPercentage: { type: 'number', example: 75, description: 'Phần trăm hoàn thành (%)' },
                    recordCount: { type: 'number', example: 6, description: 'Số lần uống nước hôm nay' },
                    lastDrinkTime: { type: 'string', format: 'date-time', example: '2024-01-15T16:30:00.000Z', description: 'Thời gian uống nước cuối cùng' }
                  },
                  description: 'Tiến độ uống nước hôm nay (khi không truyền tham số date)'
                }
              },
              description: 'Tiến độ hôm nay (mặc định)'
            }
          ],
          description: 'Thông tin tiến độ uống nước'
        },
        datasets: {
          type: 'object',
          properties: {
            intake: { 
              type: 'array', 
              items: { type: 'number' }, 
              example: [250, 300, 200, 400, 350],
              description: 'Lượng nước uống theo từng lần (ml)' 
            },
            datetime: { 
              type: 'array', 
              items: { type: 'string', format: 'date-time' }, 
              example: ['2024-01-15T08:00:00.000Z', '2024-01-15T10:30:00.000Z'],
              description: 'Thời gian uống nước theo từng lần' 
            },
            labels: { 
              type: 'array', 
              items: { type: 'string' }, 
              example: ['08:00', '10:30', '12:15', '15:45', '18:20'],
              description: 'Nhãn thời gian cho biểu đồ' 
            }
          },
          description: 'Dữ liệu cho biểu đồ (thống nhất format với module profile)'
        },
        units: {
          type: 'object',
          properties: {
            intake: { type: 'string', example: 'ml', description: 'Đơn vị lượng nước' },
            datetime: { type: 'string', example: 'ISO 8601', description: 'Định dạng thời gian' }
          },
          description: 'Đơn vị đo lường'
        },
        totalRecords: { type: 'number', example: 5, description: 'Tổng số bản ghi' },
        date: { type: 'string', example: '2024-01-15', description: 'Ngày dữ liệu' }
      }
    }
  })
  @ApiQuery({ 
    name: 'date', 
    required: false, 
    description: 'Ngày cần lấy dữ liệu (format: ISO 8601)', 
    example: '2024-01-15T00:00:00.000Z' 
  })
  @ApiResponse({ status: 400, description: 'Định dạng ngày không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập hoặc token không hợp lệ' })
  getWaterInfo(@Request() req, @Query('date') date?: string) {
    return this.waterService.getWaterInfo(req.user.userId, date);
  }

  @Get('stats/:date')
  @ApiOperation({ 
    summary: 'Thống kê uống nước theo ngày',
    description: 'Lấy thống kê chi tiết về việc uống nước trong một ngày cụ thể, bao gồm dữ liệu theo giờ và danh sách các bản ghi.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Thống kê chi tiết theo ngày',
    schema: {
      type: 'object',
      properties: {
        date: { type: 'string', example: '2024-01-15', description: 'Ngày thống kê' },
        totalDrank: { type: 'number', example: 1800, description: 'Tổng lượng đã uống (ml)' },
        dailyGoal: { type: 'number', example: 2000, description: 'Mục tiêu hàng ngày (ml)' },
        remaining: { type: 'number', example: 200, description: 'Lượng còn lại (ml)' },
        progressPercentage: { type: 'number', example: 90, description: 'Phần trăm hoàn thành (%)' },
        recordCount: { type: 'number', example: 8, description: 'Số lần uống nước' },
        hourlyData: { 
          type: 'array', 
          items: { type: 'number' }, 
          example: [0, 0, 0, 0, 0, 0, 0, 0, 250, 300, 0, 200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          description: 'Dữ liệu uống nước theo từng giờ (24 giờ)' 
        },
        hourlyCount: { 
          type: 'array', 
          items: { type: 'number' }, 
          example: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          description: 'Số lần uống nước theo từng giờ (24 giờ)' 
        },
        records: { 
          type: 'array', 
          items: { 
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              amount: { type: 'number', example: 250 },
              datetime: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          },
          description: 'Danh sách các bản ghi uống nước trong ngày'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Định dạng ngày không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập hoặc token không hợp lệ' })
  getStatsByDate(@Param('date') date: string, @Request() req) {
    return this.waterService.getStatsByDate(req.user.userId, date);
  }

  @Get('stats')
  @ApiOperation({ 
    summary: 'Thống kê uống nước theo thời gian',
    description: 'Lấy thống kê chi tiết về việc uống nước theo tuần hoặc tháng, bao gồm dữ liệu theo ngày, biểu đồ và phân tích AI.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Thống kê chi tiết',
    schema: {
      type: 'object',
      properties: {
        period: { type: 'string', example: 'week', description: 'Loại thống kê (week/month)' },
        periodData: { type: 'string', example: '2024-W03', description: 'Dữ liệu thời gian' },
        timeRange: {
          type: 'object',
          properties: {
            startDate: { type: 'string', example: '2024-01-15' },
            endDate: { type: 'string', example: '2024-01-21' },
            displayName: { type: 'string', example: 'Tuần 3, 2024' }
          }
        },
        dailyStats: { 
          type: 'array', 
          items: { type: 'object' },
          description: 'Thống kê chi tiết theo từng ngày'
        },
        weeklyStats: { 
          type: 'array', 
          items: { type: 'object' },
          description: 'Thống kê theo từng tuần (chỉ có khi period=month)'
        },
        chartData: { type: 'object', description: 'Dữ liệu cho biểu đồ' },
        summary: { type: 'object', description: 'Tóm tắt thống kê' },
        aiAnalysisData: { type: 'object', description: 'Dữ liệu phân tích AI' },
        smartWaterSchedule: { type: 'object', description: 'Lịch trình uống nước thông minh' },
        totalRecords: { type: 'number', description: 'Tổng số bản ghi uống nước' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Định dạng thời gian không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập hoặc token không hợp lệ' })
  @ApiQuery({ 
    name: 'period', 
    required: true, 
    description: 'Loại thống kê', 
    enum: ['week', 'month', 'custom'],
    example: 'week'
  })
  @ApiQuery({ 
    name: 'time', 
    required: false, 
    description: 'Thời gian cụ thể (format: YYYY-WNN cho week, YYYY-MM cho month)', 
    example: '2024-W03'
  })
  @ApiQuery({ 
    name: 'startDate', 
    required: false, 
    description: 'Ngày bắt đầu (format: ISO 8601) - chỉ dùng khi period=custom', 
    example: '2024-01-15T00:00:00.000Z'
  })
  @ApiQuery({ 
    name: 'endDate', 
    required: false, 
    description: 'Ngày kết thúc (format: ISO 8601) - chỉ dùng khi period=custom', 
    example: '2024-01-21T23:59:59.999Z'
  })
  getStats(
    @Request() req, 
    @Query('period') period: string, 
    @Query('time') time?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.waterService.getStats(req.user.userId, period, time, startDate, endDate);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Xóa bản ghi uống nước',
    description: 'Xóa một bản ghi uống nước theo ID. Hệ thống sẽ thực hiện soft delete (đánh dấu isDeleted = true).'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Xóa thành công',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Bản ghi uống nước đã được xóa thành công' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bản ghi với ID này' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập hoặc token không hợp lệ' })
  @ApiResponse({ status: 403, description: 'Không có quyền xóa bản ghi này' })
  remove(@Param('id') id: string) {
    return this.waterService.remove(+id);
  }
} 