# NutriWise Backend - Environment Configuration

## Cấu hình môi trường

### 1. Tạo file .env

Tạo file `.env` trong thư mục gốc của dự án với nội dung sau:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=nutriwise

# JWT Configuration
JWT_SECRET=nutriwise_jwt_secret_key_2024
JWT_REFRESH_SECRET=nutriwise_refresh_secret_key_2024
JWT_EXPIRATION_TIME=1h
JWT_REFRESH_EXPIRATION_TIME=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=NutriWise <your_email@gmail.com>

# Server Configuration
PORT=4001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true

# Logging Configuration
LOG_LEVEL=debug
LOG_FORMAT=combined

# Security Configuration
BCRYPT_ROUNDS=10
COOKIE_SECRET=nutriwise_cookie_secret_2024

# API Configuration
API_PREFIX=api
API_VERSION=v1
SWAGGER_TITLE=NutriWise API
SWAGGER_DESCRIPTION=API documentation for NutriWise nutrition and health management application
SWAGGER_VERSION=1.0

# Redis Configuration (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DEST=./uploads
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Health Check
HEALTH_CHECK_INTERVAL=30000
```

### 2. Cấu hình Database

#### PostgreSQL Setup

1. **Cài đặt PostgreSQL** (nếu chưa có)
2. **Tạo database:**
```sql
CREATE DATABASE nutriwise;
```

3. **Tạo user (tùy chọn):**
```sql
CREATE USER nutriwise_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE nutriwise TO nutriwise_user;
```

### 3. Cấu hình Email

#### Gmail Setup

1. **Bật 2-Factor Authentication** cho Gmail
2. **Tạo App Password:**
   - Vào Google Account Settings
   - Security > 2-Step Verification > App passwords
   - Tạo password cho "Mail"
3. **Sử dụng App Password** trong EMAIL_PASS

### 4. Cấu hình cho các môi trường khác nhau

#### Development
```env
NODE_ENV=development
PORT=4001
LOG_LEVEL=debug
```

#### Production
```env
NODE_ENV=production
PORT=4001
LOG_LEVEL=error
DATABASE_HOST=your_production_db_host
```

#### Testing
```env
NODE_ENV=test
PORT=4002
DATABASE_NAME=nutriwise_test
```

### 5. Biến môi trường bắt buộc

Các biến môi trường **bắt buộc** để chạy ứng dụng:

```env
# Database
DATABASE_HOST
DATABASE_PORT
DATABASE_USERNAME
DATABASE_PASSWORD
DATABASE_NAME

# JWT
JWT_SECRET
JWT_REFRESH_SECRET

# Server
PORT
NODE_ENV
```

### 6. Biến môi trường tùy chọn

Các biến môi trường **tùy chọn** (có giá trị mặc định):

```env
# JWT
JWT_EXPIRATION_TIME=1h
JWT_REFRESH_EXPIRATION_TIME=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_FROM=NutriWise <your_email@gmail.com>

# CORS
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true

# API
API_PREFIX=api
SWAGGER_TITLE=NutriWise API
SWAGGER_VERSION=1.0

# Security
BCRYPT_ROUNDS=10
COOKIE_SECRET=nutriwise_cookie_secret_2024
```

### 7. Kiểm tra cấu hình

Sau khi tạo file `.env`, chạy lệnh sau để kiểm tra:

```bash
npm run start:dev
```

Nếu cấu hình đúng, bạn sẽ thấy:
```
🚀 NutriWise Backend is running on port 4001
📚 Swagger documentation available at http://localhost:4001/api/docs
🌍 Environment: development
🔗 Frontend URL: http://localhost:3000
```

### 8. Troubleshooting

#### Lỗi Database Connection
- Kiểm tra PostgreSQL đang chạy
- Kiểm tra thông tin database trong .env
- Kiểm tra quyền truy cập database

#### Lỗi Email
- Kiểm tra EMAIL_USER và EMAIL_PASS
- Đảm bảo đã bật "Less secure app access" hoặc sử dụng App Password
- Kiểm tra firewall/antivirus

#### Lỗi JWT
- Đảm bảo JWT_SECRET và JWT_REFRESH_SECRET được set
- Kiểm tra format của JWT_EXPIRATION_TIME

### 9. Security Notes

⚠️ **Lưu ý bảo mật:**

1. **Không commit file .env** vào git
2. **Sử dụng strong secrets** cho JWT
3. **Thay đổi default passwords**
4. **Sử dụng HTTPS** trong production
5. **Giới hạn CORS origins** trong production

### 10. Production Checklist

Trước khi deploy production:

- [ ] Thay đổi tất cả default secrets
- [ ] Cấu hình HTTPS
- [ ] Set NODE_ENV=production
- [ ] Cấu hình database production
- [ ] Cấu hình email production
- [ ] Cấu hình CORS cho domain thực
- [ ] Tắt logging debug
- [ ] Cấu hình rate limiting
- [ ] Backup database 