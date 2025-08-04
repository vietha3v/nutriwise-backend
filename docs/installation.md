# 🛠️ Hướng dẫn cài đặt NutriWise Backend

## 📋 Yêu cầu hệ thống

### Phần mềm cần thiết
- **Node.js**: >= 18.0.0
- **PostgreSQL**: >= 13.0
- **Redis**: >= 6.0 (cho caching và session)
- **Git**: >= 2.0.0

### Kiểm tra phiên bản
```bash
node --version
npm --version
psql --version
redis-server --version
git --version
```

## 🚀 Cài đặt dự án

### 1. Clone repository
```bash
# Clone repository
git clone <repository-url>
cd nutriwise-backend

# Hoặc nếu đã có repository local
git pull origin main
```

### 2. Cài đặt dependencies
```bash
# Cài đặt tất cả dependencies
npm install

# Hoặc sử dụng yarn
yarn install
```

### 3. Cấu hình environment
```bash
# Copy file environment mẫu
cp env.example .env

# Chỉnh sửa file .env với thông tin thực tế
nano .env
# hoặc
code .env
```

#### Cấu hình file .env
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=nutriwise_db

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# AI Service Configuration
AI_SERVICE_URL=https://api.openai.com/v1
AI_SERVICE_KEY=your_openai_api_key

# Payment Gateway Configuration
PAYMENT_GATEWAY_URL=https://api.payment-gateway.com
PAYMENT_GATEWAY_KEY=your_payment_gateway_key

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 4. Cài đặt và cấu hình Database

#### PostgreSQL Setup
```bash
# Tạo database
psql -U postgres
CREATE DATABASE nutriwise_db;
CREATE USER nutriwise_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE nutriwise_db TO nutriwise_user;
\q

# Hoặc sử dụng command line
createdb nutriwise_db
```

#### Redis Setup
```bash
# Khởi động Redis server
redis-server

# Kiểm tra kết nối
redis-cli ping
# Kết quả: PONG
```

### 5. Chạy Database Migrations
```bash
# Tạo migration đầu tiên (nếu chưa có)
npm run migration:generate -- src/database/migrations/InitialMigration

# Chạy tất cả migrations
npm run migration:run

# Kiểm tra trạng thái migrations
npm run migration:show
```

### 6. Seed dữ liệu mẫu (tùy chọn)
```bash
# Chạy seeder để tạo dữ liệu mẫu
npm run seed:run

# Hoặc chạy từng seeder riêng lẻ
npm run seed:run -- --seed=UserSeeder
npm run seed:run -- --seed=RoleSeeder
```

## 🔧 Scripts Development

### Khởi động server
```bash
# Development mode (với hot reload)
npm run start:dev

# Debug mode
npm run start:debug

# Production mode
npm run start:prod

# Build trước khi chạy production
npm run build
npm run start:prod
```

### Testing
```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Tests với coverage
npm run test:cov

# Watch mode cho tests
npm run test:watch
```

### Database Management
```bash
# Tạo migration mới
npm run migration:generate -- src/database/migrations/MigrationName

# Chạy migrations
npm run migration:run

# Revert migration cuối cùng
npm run migration:revert

# Xem danh sách migrations
npm run migration:show

# Tạo seeder mới
npm run seed:generate -- src/database/seeds/SeederName

# Chạy seeders
npm run seed:run
```

### Build & Deploy
```bash
# Build project
npm run build

# Build cho production
npm run build:prod

# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

## 🐳 Docker Setup (Tùy chọn)

### Docker Compose
```bash
# Tạo file docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: nutriwise_db
      POSTGRES_USER: nutriwise_user
      POSTGRES_PASSWORD: your_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Chạy với Docker
```bash
# Build và chạy với Docker Compose
docker-compose up -d

# Xem logs
docker-compose logs -f app

# Dừng services
docker-compose down
```

## 🔍 Kiểm tra cài đặt

### 1. Kiểm tra server
```bash
# Khởi động server
npm run start:dev

# Kiểm tra endpoint health
curl http://localhost:3000/health
# Kết quả mong đợi: {"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}
```

### 2. Kiểm tra database
```bash
# Kết nối database
psql -h localhost -U nutriwise_user -d nutriwise_db

# Kiểm tra bảng đã được tạo
\dt

# Thoát
\q
```

### 3. Kiểm tra Redis
```bash
# Kết nối Redis
redis-cli

# Test set/get
SET test "Hello NutriWise"
GET test

# Thoát
exit
```

## 🚨 Troubleshooting

### Lỗi thường gặp

#### 1. Lỗi kết nối database
```bash
# Kiểm tra PostgreSQL service
sudo systemctl status postgresql

# Khởi động PostgreSQL
sudo systemctl start postgresql

# Kiểm tra kết nối
psql -h localhost -U postgres -c "\l"
```

#### 2. Lỗi Redis connection
```bash
# Kiểm tra Redis service
redis-cli ping

# Khởi động Redis
redis-server

# Kiểm tra port
netstat -an | grep 6379
```

#### 3. Lỗi dependencies
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install

# Hoặc sử dụng yarn
rm -rf node_modules yarn.lock
yarn install
```

#### 4. Lỗi migration
```bash
# Xóa database và tạo lại
dropdb nutriwise_db
createdb nutriwise_db

# Chạy lại migrations
npm run migration:run
```

#### 5. Lỗi port đã được sử dụng
```bash
# Tìm process đang sử dụng port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Hoặc thay đổi port trong .env
PORT=3001
```

## 📚 Tài liệu tham khảo

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)

## 🤝 Hỗ trợ

Nếu gặp vấn đề trong quá trình cài đặt, vui lòng:

1. Kiểm tra [Troubleshooting](#-troubleshooting) ở trên
2. Xem [Issues](https://github.com/your-username/nutriwise-backend/issues) trên GitHub
3. Tạo issue mới với thông tin chi tiết về lỗi
4. Liên hệ team development qua email hoặc Slack

---

✅ **Chúc mừng!** Bạn đã cài đặt thành công NutriWise Backend. Bây giờ có thể bắt đầu phát triển các tính năng mới! 