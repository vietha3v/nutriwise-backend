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
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Profiles')
@Controller('profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Tạo profile mới',
    description: 'Tạo profile mới để lưu trạng thái cơ thể tại thời điểm hiện tại (cho phép tạo nhiều profile để theo dõi lịch sử thay đổi)'
  })
  @ApiResponse({ status: 201, description: 'Profile được tạo thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  create(@Body() createProfileDto: CreateProfileDto, @Request() req) {
    return this.profileService.create(createProfileDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Lấy danh sách profile của user',
    description: 'Lấy tất cả profile của người dùng đang đăng nhập (sắp xếp theo thời gian, mới nhất trước)'
  })
  @ApiResponse({ status: 200, description: 'Danh sách profile' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  findAll(@Request() req) {
    return this.profileService.findAll(req.user.userId);
  }

  @Get('latest')
  @ApiOperation({ 
    summary: 'Lấy profile mới nhất',
    description: 'Lấy profile mới nhất của người dùng đang đăng nhập'
  })
  @ApiResponse({ status: 200, description: 'Profile mới nhất' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy profile' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  findLatestProfile(@Request() req) {
    return this.profileService.findByUserId(req.user.userId);
  }

  @Get('compare/:profile1Id/:profile2Id')
  @ApiOperation({ 
    summary: 'So sánh 2 profile',
    description: 'So sánh 2 profile tại các thời điểm khác nhau'
  })
  @ApiResponse({ status: 200, description: 'Kết quả so sánh' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy profile' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  async compareProfiles(
    @Param('profile1Id') profile1Id: string,
    @Param('profile2Id') profile2Id: string,
    @Request() req
  ) {
    return await this.profileService.compareProfiles(+profile1Id, +profile2Id, req.user.userId);
  }

  @Get('trends')
  @ApiOperation({ 
    summary: 'Phân tích xu hướng',
    description: 'Phân tích thay đổi các chỉ số theo thời gian'
  })
  @ApiResponse({ status: 200, description: 'Dữ liệu xu hướng' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  @ApiQuery({ name: 'period', required: false, description: 'Thời gian phân tích (ngày)', example: 30 })
  async getTrends(@Request() req, @Query('period') period?: string) {
    const profile = await this.profileService.findByUserId(req.user.userId);
    if (!profile) {
      return { message: 'Không có dữ liệu profile để phân tích xu hướng' };
    }

    // Note: Detailed trend analysis should be handled by AI module
    return {
      currentProfile: profile,
      trends: {
        weight: profile.weight,
        bodyFat: profile.bodyFatPercentage,
        muscleMass: profile.skeletalMuscleMass,
        bmi: profile.bmi,
        healthAssessment: profile.healthAssessment
      },
      note: 'Phân tích xu hướng chi tiết và khuyến nghị sẽ được cung cấp bởi AI module'
    };
  }

  @Get('charts')
  @ApiOperation({ 
    summary: 'Dữ liệu biểu đồ',
    description: 'Lấy dữ liệu lịch sử cho biểu đồ tiến độ theo thời gian'
  })
  @ApiResponse({ status: 200, description: 'Dữ liệu biểu đồ' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  async getChartData(@Request() req) {
    const profiles = await this.profileService.findAllByUserId(req.user.userId);
    if (!profiles || profiles.length === 0) {
      return { message: 'Không có lịch sử profile để hiển thị biểu đồ' };
    }

    // Sắp xếp theo thời gian (cũ nhất trước)
    const sortedProfiles = profiles.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return {
      timeline: sortedProfiles.map(p => p.createdAt),
      datasets: {
        weight: sortedProfiles.map(p => p.weight),
        bodyFat: sortedProfiles.map(p => p.bodyFatPercentage),
        muscleMass: sortedProfiles.map(p => p.skeletalMuscleMass),
        bmi: sortedProfiles.map(p => p.bmi),
        ffmi: sortedProfiles.map(p => p.ffmi),
        visceralFat: sortedProfiles.map(p => p.visceralFatLevel)
      },
      labels: sortedProfiles.map(p => {
        const date = new Date(p.createdAt);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      }),
      units: {
        weight: 'kg',
        bodyFat: '%',
        muscleMass: 'kg',
        bmi: '',
        ffmi: '',
        visceralFat: ''
      },
      latestProfile: sortedProfiles[sortedProfiles.length - 1],
      totalProfiles: sortedProfiles.length
    };
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Lấy profile theo ID',
    description: 'Lấy chi tiết profile theo ID (chỉ có thể truy cập profile của chính mình)'
  })
  @ApiResponse({ status: 200, description: 'Profile được tìm thấy' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy profile' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.profileService.findOne(+id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Cập nhật profile theo ID',
    description: 'Cập nhật profile theo ID (bao gồm chỉ số Inbody)'
  })
  @ApiResponse({ status: 200, description: 'Profile được cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy profile' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  @ApiResponse({ status: 403, description: 'Không có quyền cập nhật' })
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto, @Request() req) {
    return this.profileService.update(+id, updateProfileDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Xóa profile',
    description: 'Xóa profile theo ID (chỉ có thể xóa profile của chính mình)'
  })
  @ApiResponse({ status: 200, description: 'Profile được xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy profile' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  @ApiResponse({ status: 403, description: 'Không có quyền xóa' })
  remove(@Param('id') id: string, @Request() req) {
    return this.profileService.remove(+id, req.user.userId);
  }
} 