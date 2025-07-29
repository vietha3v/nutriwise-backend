# NutriWise Database Setup

## Cách 1: Sử dụng pgAdmin (GUI)

1. **Mở pgAdmin**
2. **Kết nối đến PostgreSQL server**
3. **Tạo database mới:**
   - Right-click trên "Databases"
   - Chọn "Create" > "Database"
   - Đặt tên: `nutriwise`
   - Click "Save"

## Cách 2: Sử dụng psql command line

### Windows (nếu đã cài PostgreSQL):
```bash
# Mở Command Prompt hoặc PowerShell
psql -U postgres
# Nhập password khi được hỏi

# Trong psql, chạy:
CREATE DATABASE nutriwise;
\q
```

### macOS/Linux:
```bash
# Kết nối PostgreSQL
sudo -u postgres psql

# Tạo database
CREATE DATABASE nutriwise;

# Thoát
\q
```

## Cách 3: Sử dụng script SQL

```bash
# Chạy script setup
psql -U postgres -f setup-database.sql
```

## Kiểm tra database

```bash
# Kết nối và kiểm tra
psql -U postgres -d nutriwise -c "SELECT current_database();"
```

## Cập nhật .env file

Đảm bảo file `.env` có thông tin database đúng:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=nutriwise
```

## Chạy ứng dụng

Sau khi tạo database:

```bash
npm run start:dev
```

Ứng dụng sẽ tự động tạo các bảng khi chạy lần đầu (do `synchronize: true` trong development).

## Troubleshooting

### Lỗi "database does not exist"
- Kiểm tra database đã được tạo chưa
- Kiểm tra thông tin kết nối trong .env

### Lỗi "password authentication failed"
- Kiểm tra password PostgreSQL
- Cập nhật DATABASE_PASSWORD trong .env

### Lỗi "connection refused"
- Kiểm tra PostgreSQL service đang chạy
- Kiểm tra DATABASE_HOST và DATABASE_PORT 