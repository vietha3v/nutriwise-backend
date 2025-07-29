# NutriWise Backend

## Giới thiệu

NutriWise Backend là hệ thống backend cho ứng dụng quản lý dinh dưỡng và sức khỏe NutriWise, được xây dựng bằng NestJS. Hệ thống cung cấp các API để quản lý thông tin người dùng, theo dõi bữa ăn, lượng nước uống, tập luyện và mục tiêu dinh dưỡng.

## Công nghệ sử dụng

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL với TypeORM
- **Authentication**: JWT với Passport
- **Documentation**: Swagger/OpenAPI
- **Email**: Nodemailer
- **Validation**: Class-validator, Class-transformer
- **Security**: bcrypt cho mã hóa mật khẩu

## Cấu trúc dự án

```
src/
├── auth/                 # Xác thực và phân quyền
├── user/                # Quản lý người dùng
├── profile/             # Hồ sơ cá nhân và thông tin sức khỏe
├── meal/                # Quản lý bữa ăn và dinh dưỡng
├── water/               # Theo dõi lượng nước uống
├── exercise/            # Quản lý tập luyện
├── nutrition-goal/      # Mục tiêu dinh dưỡng
├── dashboard/           # Dashboard và thống kê
├── email/               # Gửi email
└── common/              # Các thành phần chung
```

## Các chức năng chính

### 1. Quản lý xác thực và phân quyền (Authentication & Authorization)

#### Chức năng:
- **Đăng ký tài khoản**: Tạo tài khoản mới cho người dùng
- **Đăng nhập**: Xác thực người dùng và tạo JWT token
- **Đăng xuất**: Hủy token và đăng xuất
- **Quên mật khẩu**: Gửi email reset mật khẩu
- **Đặt lại mật khẩu**: Cập nhật mật khẩu mới
- **Refresh token**: Làm mới access token
- **Phân quyền**: Hệ thống role-based access control

#### API Endpoints:
- `POST /auth/register` - Đăng ký tài khoản
- `POST /auth/login` - Đăng nhập
- `POST /auth/logout` - Đăng xuất
- `POST /auth/forgot-password` - Quên mật khẩu
- `POST /auth/reset-password` - Đặt lại mật khẩu
- `POST /auth/refresh` - Làm mới token
- `GET /auth/profile` - Lấy thông tin profile

#### Phân quyền:
- **SystemAdmin**: Quyền cao nhất, có thể truy cập tất cả
- **Nutritionist**: Chuyên gia dinh dưỡng
- **Trainer**: Huấn luyện viên
- **User**: Người dùng thông thường

### 2. Quản lý người dùng (User Management)

#### Chức năng:
- **Tạo người dùng**: Thêm người dùng mới vào hệ thống
- **Cập nhật thông tin**: Chỉnh sửa thông tin người dùng
- **Xem danh sách**: Quản lý danh sách người dùng
- **Xem chi tiết**: Xem thông tin chi tiết người dùng
- **Xóa người dùng**: Xóa mềm người dùng

#### API Endpoints:
- `POST /users` - Tạo người dùng mới (Admin only)
- `GET /users` - Lấy danh sách người dùng (Admin only)
- `GET /users/:id` - Xem chi tiết người dùng
- `PATCH /users/:id` - Cập nhật người dùng
- `DELETE /users/:id` - Xóa người dùng (Admin only)

### 3. Hồ sơ cá nhân (Profile Management)

#### Chức năng:
- **Tạo hồ sơ**: Thêm thông tin cá nhân và sức khỏe
- **Cập nhật hồ sơ**: Chỉnh sửa thông tin cá nhân
- **Tính toán BMR/TDEE**: Tự động tính toán chỉ số chuyển hóa
- **Mục tiêu dinh dưỡng**: Thiết lập mục tiêu calo, protein, carb, fat

#### Thông tin hồ sơ:
- Thông tin cá nhân: tên, tuổi, giới tính, chiều cao, cân nặng
- Mức độ hoạt động: SEDENTARY, LIGHTLY_ACTIVE, MODERATELY_ACTIVE, VERY_ACTIVE, EXTREMELY_ACTIVE
- Mục tiêu: LOSE_WEIGHT, MAINTAIN_WEIGHT, GAIN_WEIGHT, BUILD_MUSCLE, IMPROVE_HEALTH
- Thông tin y tế: dị ứng, hạn chế ăn uống, tình trạng sức khỏe
- Chỉ số dinh dưỡng: BMR, TDEE, mục tiêu calo, protein, carb, fat, nước

#### API Endpoints:
- `POST /profiles` - Tạo hồ sơ mới
- `GET /profiles` - Lấy danh sách hồ sơ
- `GET /profiles/:id` - Xem chi tiết hồ sơ
- `PATCH /profiles/:id` - Cập nhật hồ sơ
- `DELETE /profiles/:id` - Xóa hồ sơ

### 4. Quản lý bữa ăn (Meal Management)

#### Chức năng:
- **Tạo bữa ăn**: Ghi lại bữa ăn với thông tin dinh dưỡng
- **Thêm thực phẩm**: Thêm thực phẩm vào bữa ăn
- **Tính toán dinh dưỡng**: Tự động tính toán calo, protein, carb, fat
- **Quét mã vạch**: Hỗ trợ quét mã vạch thực phẩm
- **Lịch sử bữa ăn**: Xem lịch sử bữa ăn theo ngày

#### Thông tin bữa ăn:
- Loại bữa ăn: BREAKFAST, LUNCH, DINNER, SNACK
- Thời gian: ngày, giờ
- Thực phẩm: tên, số lượng, dinh dưỡng
- Tổng dinh dưỡng: calo, protein, carb, fat, fiber, sugar, sodium

#### API Endpoints:
- `POST /meals` - Tạo bữa ăn mới
- `GET /meals` - Lấy danh sách bữa ăn
- `GET /meals/:id` - Xem chi tiết bữa ăn
- `PATCH /meals/:id` - Cập nhật bữa ăn
- `DELETE /meals/:id` - Xóa bữa ăn
- `POST /meals/:id/foods` - Thêm thực phẩm vào bữa ăn
- `DELETE /meals/:id/foods/:foodId` - Xóa thực phẩm khỏi bữa ăn

### 5. Theo dõi lượng nước (Water Tracking)

#### Chức năng:
- **Ghi lại lượng nước**: Ghi lại lượng nước uống theo thời gian
- **Mục tiêu nước**: Thiết lập và theo dõi mục tiêu nước hàng ngày
- **Thống kê nước**: Xem thống kê lượng nước theo ngày/tuần/tháng
- **Nhắc nhở**: Hệ thống nhắc nhở uống nước

#### API Endpoints:
- `POST /water` - Ghi lại lượng nước uống
- `GET /water` - Lấy danh sách lượng nước
- `GET /water/:id` - Xem chi tiết lượng nước
- `PATCH /water/:id` - Cập nhật lượng nước
- `DELETE /water/:id` - Xóa lượng nước
- `GET /water/stats` - Thống kê lượng nước

### 6. Quản lý tập luyện (Exercise Management)

#### Chức năng:
- **Ghi lại tập luyện**: Ghi lại các buổi tập luyện
- **Loại tập luyện**: CARDIO, STRENGTH, FLEXIBILITY, SPORTS, YOGA, PILATES
- **Thống kê tập luyện**: Xem thống kê tập luyện theo thời gian
- **Calo đốt cháy**: Tính toán calo đốt cháy
- **Nhịp tim**: Theo dõi nhịp tim trong tập luyện

#### Thông tin tập luyện:
- Tên bài tập
- Loại tập luyện
- Thời gian: ngày, giờ, thời lượng
- Calo đốt cháy
- Khoảng cách (cho cardio)
- Nhịp tim trung bình, tối đa
- Mô tả, ghi chú

#### API Endpoints:
- `POST /exercises` - Tạo bài tập mới
- `GET /exercises` - Lấy danh sách bài tập
- `GET /exercises/:id` - Xem chi tiết bài tập
- `PATCH /exercises/:id` - Cập nhật bài tập
- `DELETE /exercises/:id` - Xóa bài tập
- `GET /exercises/stats` - Thống kê tập luyện

### 7. Mục tiêu dinh dưỡng (Nutrition Goals)

#### Chức năng:
- **Tạo mục tiêu**: Thiết lập mục tiêu dinh dưỡng cá nhân
- **Theo dõi tiến độ**: Theo dõi tiến độ đạt mục tiêu
- **Điều chỉnh mục tiêu**: Cập nhật mục tiêu theo thời gian
- **Phân tích mục tiêu**: Phân tích hiệu quả mục tiêu

#### Thông tin mục tiêu:
- Loại mục tiêu: LOSE_WEIGHT, MAINTAIN_WEIGHT, GAIN_WEIGHT, BUILD_MUSCLE, IMPROVE_HEALTH
- Cân nặng hiện tại và mục tiêu
- Mục tiêu dinh dưỡng: calo, protein, carb, fat, nước
- Thời gian: ngày bắt đầu, ngày mục tiêu
- Trạng thái: active/inactive

#### API Endpoints:
- `POST /nutrition-goals` - Tạo mục tiêu mới
- `GET /nutrition-goals` - Lấy danh sách mục tiêu
- `GET /nutrition-goals/:id` - Xem chi tiết mục tiêu
- `PATCH /nutrition-goals/:id` - Cập nhật mục tiêu
- `DELETE /nutrition-goals/:id` - Xóa mục tiêu
- `GET /nutrition-goals/progress` - Theo dõi tiến độ

### 8. Dashboard và thống kê

#### Chức năng:
- **Thống kê tổng quan**: Tổng quan về sức khỏe và dinh dưỡng
- **Biểu đồ dinh dưỡng**: Biểu đồ calo, protein, carb, fat theo thời gian
- **Tiến độ mục tiêu**: Theo dõi tiến độ đạt mục tiêu
- **Báo cáo sức khỏe**: Báo cáo tổng hợp về sức khỏe

#### API Endpoints:
- `GET /dashboard` - Lấy dữ liệu dashboard
- `GET /dashboard/nutrition-stats` - Thống kê dinh dưỡng
- `GET /dashboard/exercise-stats` - Thống kê tập luyện
- `GET /dashboard/water-stats` - Thống kê nước
- `GET /dashboard/goal-progress` - Tiến độ mục tiêu

### 9. Gửi email

#### Chức năng:
- **Email chào mừng**: Email chào mừng người dùng mới
- **Email quên mật khẩu**: Gửi link reset mật khẩu
- **Email nhắc nhở**: Nhắc nhở uống nước, tập luyện
- **Email báo cáo**: Báo cáo tuần/tháng

## Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js (version 16 trở lên)
- PostgreSQL
- npm hoặc yarn

### Cài đặt

1. **Clone dự án**
```bash
git clone <repository-url>
cd NutriWise/nutriwise-backend
```

2. **Cài đặt dependencies**
```bash
npm install
# hoặc
yarn install
```

3. **Cấu hình môi trường**
Tạo file `.env` với các biến môi trường. Xem chi tiết tại [ENVIRONMENT.md](./ENVIRONMENT.md)

**Cấu hình cơ bản:**
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=nutriwise

# JWT
JWT_SECRET=nutriwise_jwt_secret_key_2024
JWT_REFRESH_SECRET=nutriwise_refresh_secret_key_2024

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Server
PORT=4001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. **Chạy migration**
```bash
npm run migration:run
```

5. **Seed dữ liệu (tùy chọn)**
```bash
npm run seed
```

6. **Chạy dự án**
```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

### Scripts có sẵn

- `npm run build` - Build dự án
- `npm run start` - Chạy dự án
- `npm run start:dev` - Chạy với chế độ watch
- `npm run start:debug` - Chạy với debug mode
- `npm run start:prod` - Chạy production
- `npm run test` - Chạy test
- `npm run test:e2e` - Chạy end-to-end test
- `npm run migration:run` - Chạy migration
- `npm run migration:revert` - Revert migration
- `npm run seed` - Seed dữ liệu

## API Documentation

Sau khi chạy dự án, truy cập Swagger UI tại:
```
http://localhost:4001/api/docs
```

## Bảo mật

- **JWT Authentication**: Sử dụng JWT token cho xác thực
- **Role-based Access Control**: Phân quyền theo vai trò
- **Password Hashing**: Mã hóa mật khẩu với bcrypt
- **CORS**: Cấu hình CORS cho frontend
- **Input Validation**: Validate input với class-validator
- **SQL Injection Protection**: Sử dụng TypeORM để tránh SQL injection

## Cấu trúc Database

Hệ thống sử dụng PostgreSQL với các bảng chính:
- `users` - Người dùng hệ thống
- `profiles` - Hồ sơ cá nhân và thông tin sức khỏe
- `meals` - Bữa ăn
- `meal_foods` - Thực phẩm trong bữa ăn
- `water_intakes` - Lượng nước uống
- `exercises` - Bài tập
- `nutrition_goals` - Mục tiêu dinh dưỡng

## Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## Cấu hình môi trường

Xem chi tiết cấu hình môi trường tại [ENVIRONMENT.md](./ENVIRONMENT.md)

### Biến môi trường chính:

- **Database**: Cấu hình PostgreSQL
- **JWT**: Secret keys cho authentication
- **Email**: Cấu hình SMTP cho gửi email
- **Server**: Port, environment, CORS
- **Security**: Bcrypt rounds, cookie secret
- **API**: Prefix, Swagger configuration

### Quick Start:

1. Tạo file `.env` từ template trong ENVIRONMENT.md
2. Cấu hình database PostgreSQL
3. Cấu hình email (Gmail App Password)
4. Chạy `npm run start:dev`
5. Truy cập Swagger UI tại `http://localhost:4001/api/docs`

## License

Dự án này được phát triển cho mục đích học tập và thương mại.
