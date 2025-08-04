# 🔐 1. Quản lý xác thực và phân quyền (Authentication & Authorization)

## Chức năng:
- **Đăng ký tài khoản**: Tạo tài khoản mới cho người dùng
- **Đăng nhập**: Xác thực người dùng và tạo JWT token
- **Đăng xuất**: Hủy token và đăng xuất
- **Quên mật khẩu**: Gửi email reset mật khẩu
- **Đặt lại mật khẩu**: Cập nhật mật khẩu mới
- **Refresh token**: Làm mới access token
- **Phân quyền**: Hệ thống role-based access control

## API Endpoints:
- `POST /auth/register` - Đăng ký tài khoản
- `POST /auth/login` - Đăng nhập
- `POST /auth/logout` - Đăng xuất
- `POST /auth/forgot-password` - Quên mật khẩu
- `POST /auth/reset-password` - Đặt lại mật khẩu
- `POST /auth/refresh` - Làm mới token
- `GET /auth/profile` - Lấy thông tin profile

## Phân quyền:
- **SystemAdmin**: Quyền cao nhất, có thể truy cập tất cả
- **Nutritionist**: Chuyên gia dinh dưỡng
- **Trainer**: Huấn luyện viên
- **User**: Người dùng thông thường

## Cấu trúc thư mục:
```
src/auth/
├── auth.controller.ts
├── auth.module.ts
├── auth.service.ts
├── decorators/
│   ├── public.decorator.ts
│   └── roles.decorator.ts
├── dto/
│   ├── forgot-password.dto.ts
│   ├── login.dto.ts
│   ├── register.dto.ts
│   ├── reset-password.dto.ts
│   └── social-login.dto.ts
├── guards/
│   ├── jwt-auth.guard.ts
│   └── roles.guard.ts
└── strategies/
    ├── facebook.strategy.ts
    ├── google.strategy.ts
    └── jwt.strategy.ts
``` 