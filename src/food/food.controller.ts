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
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { FoodSearchDto } from './dto/food-search.dto';
import { CreateFoodPreferenceDto } from './dto/create-food-preference.dto';
import { UpdateFoodPreferenceDto } from './dto/update-food-preference.dto';
import { CreatePantryFoodDto } from './dto/create-pantry-food.dto';
import { UpdatePantryFoodDto } from './dto/update-pantry-food.dto';
import { Food, FoodCategory } from './entities/food.entity';
import { UserFoodPreference } from './entities/user-food-preference.entity';
// import { PantryItem } from './entities/pantry-item.entity';
import { FoodResponseDto, FoodSearchResponseDto } from './dto/food-response.dto';

@ApiTags('Foods')
@Controller('foods')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post()
  @Roles(Role.SystemAdmin)
  @ApiOperation({ summary: 'Create a new food item' })
  @ApiResponse({ status: 201, description: 'Food created successfully' })
  create(@Body() createFoodDto: CreateFoodDto): Promise<Food> {
    return this.foodService.create(createFoodDto);
  }

  // ==================== FOOD CRUD & SEARCH ====================
  
  @Get()
  @ApiOperation({ summary: 'Get all foods' })
  @ApiResponse({ status: 200, description: 'List of all foods' })
  findAll(): Promise<Food[]> {
    return this.foodService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search foods with filters' })
  @ApiResponse({ status: 200, description: 'Search results', type: FoodSearchResponseDto })
  search(@Query() searchDto: FoodSearchDto, @Request() req) {
    return this.foodService.search(searchDto, req.user?.userId);
  }





  @Get('category/:category')
  @ApiOperation({ summary: 'Get foods by category' })
  @ApiResponse({ status: 200, description: 'Foods in category' })
  findByCategory(@Param('category') category: FoodCategory): Promise<Food[]> {
    return this.foodService.findByCategory(category);
  }



  // Available Food Management
  @Post('pantry')
  @ApiOperation({ 
    summary: 'Thêm thực phẩm vào tủ đồ',
    description: 'Thêm thực phẩm vào tủ đồ của người dùng'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Thực phẩm đã được thêm vào tủ đồ',
    type: Object
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  addPantryItem(
    @Request() req,
    @Body() createDto: CreatePantryFoodDto,
  ): Promise<any> {
    return this.foodService.addPantryItem(req.user.userId, createDto);
  }

  @Get('pantry')
  @ApiOperation({ 
    summary: 'Lấy danh sách tủ đồ',
    description: 'Lấy tất cả thực phẩm trong tủ đồ của người dùng đang đăng nhập'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Danh sách thực phẩm trong tủ đồ',
    type: [Object]
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  getPantryItems(@Request() req): Promise<any[]> {
    console.log('🔥 [DEBUG] GET /foods/pantry - User ID:', req.user.userId);
    return this.foodService.getPantryItems(req.user.userId);
  }

  @Patch('pantry/:id')
  @ApiOperation({ 
    summary: 'Cập nhật thực phẩm trong tủ đồ',
    description: 'Cập nhật thông tin của một thực phẩm trong tủ đồ'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Thực phẩm trong tủ đồ đã được cập nhật',
    type: Object
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thực phẩm trong tủ đồ' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  updatePantryItem(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDto: UpdatePantryFoodDto,
  ): Promise<any> {
    const pantryItemId = parseInt(id);
    if (isNaN(pantryItemId)) {
      throw new BadRequestException('ID không hợp lệ');
    }
    return this.foodService.updatePantryItem(req.user.userId, pantryItemId, updateDto);
  }

  @Delete('pantry/:id')
  @ApiOperation({ 
    summary: 'Xóa thực phẩm khỏi tủ đồ',
    description: 'Xóa một thực phẩm khỏi tủ đồ'
  })
  @ApiResponse({ status: 200, description: 'Thực phẩm đã được xóa khỏi tủ đồ' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thực phẩm trong tủ đồ' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  removePantryItem(@Request() req, @Param('id') id: string): Promise<void> {
    const pantryItemId = parseInt(id);
    if (isNaN(pantryItemId)) {
      throw new BadRequestException('ID không hợp lệ');
    }
    return this.foodService.removePantryItem(req.user.userId, pantryItemId);
  }

  // ==================== FOOD BY ID (MUST BE LAST) ====================
  
  @Get(':id')
  @ApiOperation({ summary: 'Get food by ID' })
  @ApiResponse({ status: 200, description: 'Food details', type: FoodResponseDto })
  findOne(@Param('id') id: string, @Request() req) {
    console.log('🔥 [DEBUG] GET /foods/:id - ID:', id);
    return this.foodService.findOne(+id, req.user?.userId);
  }

  @Patch(':id')
  @Roles(Role.SystemAdmin)
  @ApiOperation({ summary: 'Update food' })
  @ApiResponse({ status: 200, description: 'Food updated successfully' })
  update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto): Promise<Food> {
    return this.foodService.update(+id, updateFoodDto);
  }

  @Delete(':id')
  @Roles(Role.SystemAdmin)
  @ApiOperation({ summary: 'Delete food' })
  @ApiResponse({ status: 200, description: 'Food deleted successfully' })
  remove(@Param('id') id: string): Promise<void> {
    return this.foodService.remove(+id);
  }

  // User Food Preferences
  @Post('preferences')
  @ApiOperation({ summary: 'Create user food preference' })
  @ApiResponse({ status: 201, description: 'Preference created successfully' })
  createUserPreference(
    @Request() req,
    @Body() createDto: CreateFoodPreferenceDto,
  ): Promise<UserFoodPreference> {
    return this.foodService.createUserPreference(req.user.userId, createDto);
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get user food preferences' })
  @ApiResponse({ status: 200, description: 'User preferences' })
  getUserPreferences(@Request() req): Promise<UserFoodPreference[]> {
    return this.foodService.getUserPreferences(req.user.userId);
  }

  @Get('preferences/foods')
  @ApiOperation({ summary: 'Get user food preferences by type' })
  @ApiResponse({ status: 200, description: 'Food preferences by type' })
  @ApiQuery({ name: 'type', required: true, enum: ['favorites', 'disliked', 'allergic'] })
  getUserFoodPreferencesByType(@Request() req, @Query('type') type: string): Promise<Food[]> {
    switch (type) {
      case 'favorites':
        return this.foodService.getUserFavoriteFoods(req.user.userId);
      case 'disliked':
        return this.foodService.getUserDislikedFoods(req.user.userId);
      case 'allergic':
        return this.foodService.getUserAllergicFoods(req.user.userId);
      default:
        throw new Error('Invalid preference type');
    }
  }

  @Get('preferences/:foodId')
  @ApiOperation({ summary: 'Get user preference for specific food' })
  @ApiResponse({ status: 200, description: 'Food preference' })
  getUserPreference(@Request() req, @Param('foodId') foodId: string): Promise<UserFoodPreference | null> {
    return this.foodService.getUserPreference(req.user.userId, +foodId);
  }

  @Patch('preferences/:foodId')
  @ApiOperation({ summary: 'Update user food preference' })
  @ApiResponse({ status: 200, description: 'Preference updated successfully' })
  updateUserPreference(
    @Request() req,
    @Param('foodId') foodId: string,
    @Body() updateDto: UpdateFoodPreferenceDto,
  ): Promise<UserFoodPreference> {
    return this.foodService.updateUserPreference(req.user.userId, +foodId, updateDto);
  }

  @Delete('preferences/:foodId')
  @ApiOperation({ summary: 'Remove user food preference' })
  @ApiResponse({ status: 200, description: 'Preference removed successfully' })
  removeUserPreference(@Request() req, @Param('foodId') foodId: string): Promise<void> {
    return this.foodService.removeUserPreference(req.user.userId, +foodId);
  }


} 