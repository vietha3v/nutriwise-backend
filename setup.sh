#!/bin/bash

echo "🚀 NutriWise Backend Setup Script"
echo "=================================="

# Kiểm tra PostgreSQL
echo "📋 Checking PostgreSQL installation..."

if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL is installed"
    psql --version
else
    echo "❌ PostgreSQL is not installed or not in PATH"
    echo "Please install PostgreSQL first:"
    echo "  - Windows: Download from https://www.postgresql.org/download/windows/"
    echo "  - macOS: brew install postgresql"
    echo "  - Ubuntu: sudo apt-get install postgresql postgresql-contrib"
    exit 1
fi

# Kiểm tra file .env
echo ""
echo "📋 Checking .env file..."
if [ -f ".env" ]; then
    echo "✅ .env file exists"
else
    echo "❌ .env file not found"
    echo "Please create .env file with the configuration from ENVIRONMENT.md"
    exit 1
fi

# Kiểm tra database
echo ""
echo "📋 Checking database connection..."
if psql -h localhost -U postgres -d nutriwise -c "SELECT 1;" &> /dev/null; then
    echo "✅ Database 'nutriwise' exists and is accessible"
else
    echo "❌ Database 'nutriwise' not found or not accessible"
    echo ""
    echo "🔧 Creating database..."
    echo "Please run the following commands:"
    echo ""
    echo "1. Connect to PostgreSQL as superuser:"
    echo "   psql -U postgres"
    echo ""
    echo "2. Create database:"
    echo "   CREATE DATABASE nutriwise;"
    echo ""
    echo "3. Or run the SQL script:"
    echo "   psql -U postgres -f setup-database.sql"
    echo ""
    echo "4. Update .env file with correct database credentials"
    exit 1
fi

# Cài đặt dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Chạy migration (nếu có)
echo ""
echo "🗄️ Running database migrations..."
if [ -f "src/database/migrations" ]; then
    npm run migration:run
else
    echo "ℹ️ No migrations found, TypeORM will create tables automatically"
fi

# Chạy dự án
echo ""
echo "🚀 Starting NutriWise Backend..."
echo "Swagger UI will be available at: http://localhost:4001/api/docs"
echo "Press Ctrl+C to stop"
echo ""

npm run start:dev 