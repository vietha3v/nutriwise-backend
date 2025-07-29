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
  constructor(private readonly waterService: WaterService) {}

  @Post()
  @ApiOperation({ summary: 'Log water intake' })
  @ApiResponse({ status: 201, description: 'Water intake logged successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createWaterIntakeDto: CreateWaterIntakeDto, @Request() req) {
    createWaterIntakeDto.userId = req.user.userId;
    return this.waterService.create(createWaterIntakeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all water intake records for current user' })
  @ApiResponse({ status: 200, description: 'List of water intake records' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Request() req) {
    return this.waterService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get water intake by ID' })
  @ApiResponse({ status: 200, description: 'Water intake found' })
  @ApiResponse({ status: 404, description: 'Water intake not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.waterService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update water intake' })
  @ApiResponse({ status: 200, description: 'Water intake updated successfully' })
  @ApiResponse({ status: 404, description: 'Water intake not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateWaterIntakeDto: any) {
    return this.waterService.update(+id, updateWaterIntakeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete water intake' })
  @ApiResponse({ status: 200, description: 'Water intake deleted successfully' })
  @ApiResponse({ status: 404, description: 'Water intake not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.waterService.remove(+id);
  }
} 