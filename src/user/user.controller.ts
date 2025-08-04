import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Tạo người dùng mới (Admin only)',
    description: 'Cho phép Admin tạo tài khoản mới cho người dùng khác. Chỉ SystemAdmin mới có quyền thực hiện thao tác này.'
  })
  @ApiBody({ 
    type: CreateUserDto,
    description: 'Thông tin người dùng cần tạo'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Người dùng được tạo thành công',
    schema: {
      example: {
        id: 2,
        username: 'jane_doe',
        email: 'jane.doe@example.com',
        role: 'User',
        isVerified: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dữ liệu không hợp lệ',
    schema: {
      example: {
        statusCode: 400,
        message: ['username must be longer than or equal to 3 characters'],
        error: 'Bad Request'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Không có quyền Admin',
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden'
      }
    }
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Username hoặc email đã tồn tại'
  })
  @Roles(Role.SystemAdmin)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Lấy danh sách tất cả người dùng (Admin only)',
    description: 'Lấy danh sách tất cả người dùng trong hệ thống. Chỉ SystemAdmin mới có quyền xem danh sách này.'
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    description: 'Số trang (mặc định: 1)',
    type: Number
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Số lượng item mỗi trang (mặc định: 10)',
    type: Number
  })
  @ApiQuery({ 
    name: 'role', 
    required: false, 
    description: 'Lọc theo vai trò',
    enum: Role
  })
  @ApiQuery({ 
    name: 'isVerified', 
    required: false, 
    description: 'Lọc theo trạng thái xác thực',
    type: Boolean
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Danh sách người dùng được lấy thành công',
    schema: {
      example: {
        data: [
          {
            id: 1,
            username: 'john_doe',
            email: 'john.doe@example.com',
            role: 'User',
            displayName: 'John Doe',
            isVerified: true,
            createdAt: '2024-01-01T00:00:00.000Z'
          },
          {
            id: 2,
            username: 'jane_doe',
            email: 'jane.doe@example.com',
            role: 'Trainer',
            displayName: 'Jane Doe',
            isVerified: false,
            createdAt: '2024-01-02T00:00:00.000Z'
          }
        ],
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Không có quyền Admin'
  })
  @Roles(Role.SystemAdmin)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Xem chi tiết người dùng (Admin only)',
    description: 'Lấy thông tin chi tiết của một người dùng theo ID. Chỉ SystemAdmin mới có quyền xem thông tin này.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Thông tin người dùng được lấy thành công',
    schema: {
      example: {
        id: 1,
        username: 'john_doe',
        email: 'john.doe@example.com',
        role: 'User',
        displayName: 'John Doe',
        profilePicture: 'https://example.com/avatar.jpg',
        googleId: '123456789',
        facebookId: null,
        isVerified: true,
        isDeleted: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Không tìm thấy người dùng',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Không có quyền Admin'
  })
  @Roles(Role.SystemAdmin)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Cập nhật thông tin người dùng (Admin only)',
    description: 'Cập nhật thông tin của một người dùng. Chỉ SystemAdmin mới có quyền thực hiện thao tác này.'
  })
  @ApiBody({ 
    type: UpdateUserDto,
    description: 'Thông tin cần cập nhật'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Thông tin người dùng được cập nhật thành công',
    schema: {
      example: {
        id: 1,
        username: 'john_doe_updated',
        email: 'john.doe.updated@example.com',
        role: 'Trainer',
        displayName: 'John Doe Updated',
        isVerified: true,
        updatedAt: '2024-01-01T12:00:00.000Z'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Không tìm thấy người dùng'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Không có quyền Admin'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Username hoặc email đã tồn tại'
  })
  @Roles(Role.SystemAdmin)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Xóa người dùng (Admin only)',
    description: 'Xóa mềm một người dùng khỏi hệ thống. Dữ liệu sẽ được đánh dấu là đã xóa nhưng không bị xóa vĩnh viễn. Chỉ SystemAdmin mới có quyền thực hiện thao tác này.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Người dùng được xóa thành công',
    schema: {
      example: {
        message: 'User deleted successfully',
        id: 1
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Không tìm thấy người dùng'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Không có quyền Admin'
  })
  @Roles(Role.SystemAdmin)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
} 