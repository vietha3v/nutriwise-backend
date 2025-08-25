import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto, SettingsResponseDto } from './dto/settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Settings')
@Controller('settings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Lấy cài đặt của người dùng',
    description: 'Lấy tất cả cài đặt của người dùng hiện tại, bao gồm AI, notification, UI và privacy settings'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lấy cài đặt thành công',
    type: SettingsResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  async getSettings(@Request() req): Promise<SettingsResponseDto> {
    return this.settingsService.getSettings(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Lấy cài đặt theo ID',
    description: 'Lấy cài đặt cụ thể theo ID (chỉ cho phép xem cài đặt của chính mình)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lấy cài đặt thành công',
    type: SettingsResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Settings not found' 
  })
  async findOne(@Param('id') id: string, @Request() req): Promise<SettingsResponseDto> {
    const settings = await this.settingsService.findOne(+id, req.user.userId);
    return this.settingsService.mapToResponseDto(settings);
  }

  @Put()
  @ApiOperation({ 
    summary: 'Cập nhật cài đặt của người dùng',
    description: 'Cập nhật một hoặc nhiều loại cài đặt của người dùng'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cập nhật cài đặt thành công',
    type: SettingsResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad Request - Dữ liệu không hợp lệ' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  async updateSettings(
    @Request() req,
    @Body() updateSettingsDto: UpdateSettingsDto
  ): Promise<SettingsResponseDto> {
    return this.settingsService.updateSettings(req.user.userId, updateSettingsDto);
  }

  @Put('ai')
  @ApiOperation({ 
    summary: 'Cập nhật cài đặt AI',
    description: 'Cập nhật chỉ cài đặt AI assistant'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cập nhật cài đặt AI thành công',
    type: SettingsResponseDto
  })
  async updateAISettings(
    @Request() req,
    @Body() aiSettings: any
  ): Promise<SettingsResponseDto> {
    return this.settingsService.updateAISettings(req.user.userId, aiSettings);
  }

  @Put('notifications')
  @ApiOperation({ 
    summary: 'Cập nhật cài đặt thông báo',
    description: 'Cập nhật chỉ cài đặt thông báo'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cập nhật cài đặt thông báo thành công',
    type: SettingsResponseDto
  })
  async updateNotificationSettings(
    @Request() req,
    @Body() notificationSettings: any
  ): Promise<SettingsResponseDto> {
    return this.settingsService.updateNotificationSettings(req.user.userId, notificationSettings);
  }

  @Put('ui')
  @ApiOperation({ 
    summary: 'Cập nhật cài đặt giao diện',
    description: 'Cập nhật chỉ cài đặt giao diện người dùng'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cập nhật cài đặt giao diện thành công',
    type: SettingsResponseDto
  })
  async updateUISettings(
    @Request() req,
    @Body() uiSettings: any
  ): Promise<SettingsResponseDto> {
    return this.settingsService.updateUISettings(req.user.userId, uiSettings);
  }

  @Put('privacy')
  @ApiOperation({ 
    summary: 'Cập nhật cài đặt quyền riêng tư',
    description: 'Cập nhật chỉ cài đặt quyền riêng tư'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cập nhật cài đặt quyền riêng tư thành công',
    type: SettingsResponseDto
  })
  async updatePrivacySettings(
    @Request() req,
    @Body() privacySettings: any
  ): Promise<SettingsResponseDto> {
    return this.settingsService.updatePrivacySettings(req.user.userId, privacySettings);
  }

  @Put('reset')
  @ApiOperation({ 
    summary: 'Đặt lại cài đặt về mặc định',
    description: 'Xóa tất cả cài đặt hiện tại và tạo lại cài đặt mặc định'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Đặt lại cài đặt thành công',
    type: SettingsResponseDto
  })
  async resetToDefaults(@Request() req): Promise<SettingsResponseDto> {
    return this.settingsService.resetToDefaults(req.user.userId);
  }
}
