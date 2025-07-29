-- NutriWise Database Setup Script
-- Chạy script này trong PostgreSQL để tạo database

-- Tạo database (chạy với quyền superuser)
CREATE DATABASE nutriwise;

-- Kết nối vào database nutriwise
\c nutriwise;

-- Tạo user cho ứng dụng (tùy chọn)
-- CREATE USER nutriwise_user WITH PASSWORD 'your_password';
-- GRANT ALL PRIVILEGES ON DATABASE nutriwise TO nutriwise_user;

-- Kiểm tra database đã được tạo
SELECT current_database();

-- Hiển thị danh sách database
\l 