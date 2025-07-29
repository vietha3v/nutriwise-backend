# NutriWise - Hệ thống Quản lý Dinh dưỡng Thông minh

## Mô tả dự án

NutriWise là một ứng dụng quản lý dinh dưỡng và sức khỏe toàn diện, giúp người dùng theo dõi chế độ ăn uống, tập luyện và đạt được mục tiêu sức khỏe cá nhân. Hệ thống tích hợp AI để đưa ra các gợi ý dinh dưỡng và tập luyện cá nhân hóa.

## Tính năng chính

### 1. Đăng ký và Đăng nhập
- Đăng ký tài khoản với thông tin cá nhân
- Đăng nhập bằng email/username và mật khẩu
- Đăng nhập bằng Google và Facebook OAuth
- Quên mật khẩu và đặt lại mật khẩu qua email
- Xác thực email

### 2. Hồ sơ Cá nhân
- Tạo và cập nhật thông tin cá nhân
- Thông tin cơ bản: tên, tuổi, giới tính, chiều cao, cân nặng
- Mục tiêu cân nặng và mức độ hoạt động
- Hạn chế ăn uống và dị ứng
- Sở thích ăn uống và thực phẩm yêu thích

### 3. Quản lý Bữa ăn
- Ghi lại các bữa ăn hàng ngày
- Theo dõi lượng calo, protein, carbs, chất béo
- Phân loại bữa ăn (sáng, trưa, tối, ăn nhẹ)
- Lưu trữ thông tin chi tiết về thực phẩm trong bữa ăn

### 4. Theo dõi Calo
- Tính toán tổng calo tiêu thụ hàng ngày
- So sánh với mục tiêu calo cá nhân
- Biểu đồ và thống kê theo thời gian
- Cảnh báo khi vượt quá hoặc thiếu hụt calo

### 5. Phân tích Dinh dưỡng
- Phân tích thành phần dinh dưỡng chi tiết
- Theo dõi tỷ lệ protein, carbs, chất béo
- Đánh giá chất lượng dinh dưỡng
- Gợi ý cải thiện chế độ ăn

### 6. Tùy chỉnh Chế độ Ăn
- Tạo chế độ ăn phù hợp với mục tiêu
- Điều chỉnh theo hạn chế ăn uống
- Tư vấn dinh dưỡng cá nhân hóa
- Kế hoạch ăn uống theo tuần/tháng

### 7. Gợi ý Bữa ăn Dựa trên Mục tiêu
- Gợi ý bữa ăn phù hợp với mục tiêu (giảm cân, tăng cơ, duy trì)
- Tính toán calo và dinh dưỡng tự động
- Đa dạng hóa thực đơn
- Cân bằng dinh dưỡng

### 8. Mục tiêu Kiểm soát Bữa ăn
- Đặt mục tiêu calo hàng ngày
- Theo dõi tiến độ đạt mục tiêu
- Cảnh báo và nhắc nhở
- Điều chỉnh mục tiêu linh hoạt

### 9. Mục tiêu Dinh dưỡng Cá nhân hóa
- Tính toán nhu cầu dinh dưỡng cá nhân
- Đặt mục tiêu protein, carbs, chất béo
- Theo dõi việc đạt mục tiêu
- Gợi ý điều chỉnh

### 10. Tư vấn và Hỗ trợ
- Chat với chuyên gia dinh dưỡng
- Hỏi đáp về dinh dưỡng
- Tư vấn chế độ ăn
- Hỗ trợ khách hàng

### 11. Kiểm soát Uống nước
- Theo dõi lượng nước uống hàng ngày
- Nhắc nhở uống nước
- Tính toán nhu cầu nước cá nhân
- Thống kê thói quen uống nước

### 12. Kiểm soát Tập luyện
- Ghi lại các buổi tập luyện
- Theo dõi thời gian và cường độ tập
- Tính toán calo đốt cháy
- Gợi ý bài tập phù hợp

### 13. Hệ thống Thực phẩm Thông minh
- **Cơ sở dữ liệu thực phẩm**: Lưu trữ thông tin chi tiết về các loại thực phẩm, thành phần dinh dưỡng, calo, cách chế biến
- **Sở thích người dùng**: Ghi nhận và học hỏi sở thích ăn uống của từng người dùng
- **Khảo sát hàng ngày**: Hỏi người dùng về thực phẩm có sẵn trong ngày
- **Gợi ý thông minh**: AI phân tích dữ liệu để đưa ra gợi ý bữa ăn phù hợp
- **Hướng dẫn chế biến**: Cung cấp công thức và cách chế biến món ăn
- **Kết hợp thực phẩm**: Gợi ý cách kết hợp các thực phẩm có sẵn thành bữa ăn hoàn chỉnh
- **Tối ưu dinh dưỡng**: Đảm bảo bữa ăn đáp ứng nhu cầu dinh dưỡng cá nhân

### 14. Tích hợp AI và Cache
- **GPT Integration**: Sử dụng OpenAI GPT để phân tích và đưa ra gợi ý thông minh
- **Cache System**: Lưu trữ kết quả AI để tiết kiệm chi phí và tăng tốc độ
- **Fallback System**: Hệ thống tính toán dự phòng khi GPT không khả dụng
- **Refresh Cache**: Cho phép làm mới cache để có dữ liệu mới nhất
- **Cache Statistics**: Theo dõi hiệu suất cache và chi phí AI

## Công nghệ sử dụng

### Backend
- **NestJS**: Framework Node.js cho API
- **PostgreSQL**: Cơ sở dữ liệu chính
- **TypeORM**: ORM cho quản lý database
- **JWT**: Xác thực và phân quyền
- **Passport.js**: OAuth với Google và Facebook
- **OpenAI GPT**: AI cho gợi ý thông minh
- **Nodemailer**: Gửi email
- **Swagger**: Tài liệu API

### Frontend (dự kiến)
- **Next.js**: Framework React
- **TypeScript**: Ngôn ngữ lập trình
- **Tailwind CSS**: Styling
- **Chart.js**: Biểu đồ và thống kê

## Cấu trúc Database

### Bảng chính
- **users**: Thông tin người dùng
- **profiles**: Hồ sơ cá nhân và mục tiêu
- **meals**: Bữa ăn hàng ngày
- **meal_foods**: Chi tiết thực phẩm trong bữa ăn
- **water_intakes**: Theo dõi uống nước
- **exercises**: Tập luyện
- **nutrition_goals**: Mục tiêu dinh dưỡng
- **ai_cache**: Cache cho kết quả AI

### Bảng mới cho hệ thống thực phẩm thông minh
- **foods**: Cơ sở dữ liệu thực phẩm
- **food_categories**: Phân loại thực phẩm
- **food_nutrition**: Thành phần dinh dưỡng của thực phẩm
- **recipes**: Công thức nấu ăn
- **user_food_preferences**: Sở thích thực phẩm của người dùng
- **daily_food_availability**: Thực phẩm có sẵn hàng ngày
- **meal_suggestions**: Gợi ý bữa ăn từ AI

## API Endpoints

### Authentication
- `POST /auth/register` - Đăng ký
- `POST /auth/login` - Đăng nhập
- `POST /auth/forgot-password` - Quên mật khẩu
- `POST /auth/reset-password` - Đặt lại mật khẩu
- `GET /auth/google` - Đăng nhập Google
- `GET /auth/facebook` - Đăng nhập Facebook

### Profile
- `GET /profile/my-profile` - Lấy hồ sơ cá nhân
- `PUT /profile/my-profile/update` - Cập nhật hồ sơ

### Meals
- `GET /meals` - Lấy danh sách bữa ăn
- `POST /meals` - Tạo bữa ăn mới
- `GET /meals/:id` - Lấy chi tiết bữa ăn
- `PUT /meals/:id` - Cập nhật bữa ăn
- `DELETE /meals/:id` - Xóa bữa ăn

### Water Intake
- `GET /water` - Lấy lịch sử uống nước
- `POST /water` - Ghi lại lượng nước uống
- `GET /water/:id` - Lấy chi tiết
- `PUT /water/:id` - Cập nhật
- `DELETE /water/:id` - Xóa

### Exercise
- `GET /exercise` - Lấy lịch sử tập luyện
- `POST /exercise` - Ghi lại buổi tập
- `GET /exercise/:id` - Lấy chi tiết
- `PUT /exercise/:id` - Cập nhật
- `DELETE /exercise/:id` - Xóa

### Nutrition Goals
- `GET /nutrition-goals` - Lấy mục tiêu dinh dưỡng
- `POST /nutrition-goals` - Tạo mục tiêu mới
- `GET /nutrition-goals/:id` - Lấy chi tiết
- `PUT /nutrition-goals/:id` - Cập nhật
- `DELETE /nutrition-goals/:id` - Xóa

### Dashboard
- `GET /dashboard` - Dữ liệu tổng quan

### AI Services
- `GET /ai/exercise-goals` - Mục tiêu tập luyện AI
- `GET /ai/nutrition-goals` - Mục tiêu dinh dưỡng AI
- `GET /ai/progress-analysis` - Phân tích tiến độ AI
- `GET /ai/weekly-meal-plan` - Kế hoạch ăn uống AI
- `POST /ai/refresh-cache` - Làm mới cache AI
- `GET /ai/cache-stats` - Thống kê cache
- `GET /ai/gpt-status` - Trạng thái GPT

### Food System (mới)
- `GET /foods` - Lấy danh sách thực phẩm
- `POST /foods` - Thêm thực phẩm mới
- `GET /foods/categories` - Lấy danh mục thực phẩm
- `GET /foods/search` - Tìm kiếm thực phẩm
- `GET /recipes` - Lấy công thức nấu ăn
- `POST /recipes` - Thêm công thức mới
- `GET /user-preferences` - Lấy sở thích người dùng
- `POST /user-preferences` - Cập nhật sở thích
- `GET /daily-availability` - Lấy thực phẩm có sẵn
- `POST /daily-availability` - Cập nhật thực phẩm có sẵn
- `GET /meal-suggestions` - Lấy gợi ý bữa ăn
- `POST /meal-suggestions/generate` - Tạo gợi ý mới

## Cài đặt và Chạy

### Yêu cầu hệ thống
- Node.js 18+
- PostgreSQL 12+
- npm hoặc yarn

### Cài đặt
1. Clone repository
2. Cài đặt dependencies: `npm install`
3. Tạo file `.env` từ `env.example`
4. Cấu hình database PostgreSQL
5. Chạy migration: `npm run migration:run`
6. Khởi động server: `npm run start:dev`

### Cấu hình môi trường
Xem file `env.example` để biết các biến môi trường cần thiết.

## Tài liệu API
Truy cập Swagger UI tại: `http://localhost:4001/api`

## Đóng góp
Hướng dẫn đóng góp và quy tắc phát triển sẽ được cập nhật sau.