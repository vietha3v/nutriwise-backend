# 👥 2. Quản lý người dùng (User Management)

## Chức năng:
- **Tạo người dùng**: Thêm người dùng mới vào hệ thống
- **Cập nhật thông tin**: Chỉnh sửa thông tin người dùng
- **Xem danh sách**: Quản lý danh sách người dùng
- **Xem chi tiết**: Xem thông tin chi tiết người dùng
- **Xóa người dùng**: Xóa mềm người dùng

## API Endpoints:
- `POST /users` - Tạo người dùng mới (Admin only)
- `GET /users` - Lấy danh sách người dùng (Admin only)
- `GET /users/:id` - Xem chi tiết người dùng
- `PATCH /users/:id` - Cập nhật người dùng
- `DELETE /users/:id` - Xóa người dùng (Admin only)

## Cấu trúc thư mục:
```
src/user/
├── user.controller.ts
├── user.module.ts
├── user.service.ts
├── dto/
│   ├── create-user.dto.ts
│   └── update-user.dto.ts
└── entities/
    └── user.entity.ts
```

## Thông tin người dùng:
- **Thông tin cơ bản**: Tên, email, số điện thoại, ngày sinh
- **Thông tin đăng nhập**: Username, password (mã hóa), trạng thái tài khoản
- **Phân quyền**: Role (User, Trainer, Nutritionist, Admin)
- **Thông tin liên hệ**: Địa chỉ, thành phố, quốc gia
- **Cài đặt**: Ngôn ngữ, múi giờ, thông báo
- **Trạng thái**: ACTIVE, INACTIVE, SUSPENDED, DELETED 