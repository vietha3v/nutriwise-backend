# 📚 Tài liệu dự án NutriWise Backend

## Giới thiệu

Đây là bộ tài liệu chi tiết cho hệ thống backend NutriWise, được chia nhỏ theo từng module để dễ dàng tham khảo và phát triển. Mỗi file tài liệu chứa thông tin chi tiết về chức năng, API endpoints, cấu trúc thư mục và database schema của từng module.

## 📋 Mục lục

### 🛠️ Cài đặt & Setup
- [Hướng dẫn cài đặt](./installation.md) - Cài đặt dự án, cấu hình, troubleshooting

### 🔐 Xác thực & Phân quyền
- [1. Quản lý xác thực và phân quyền](./01-authentication.md) - Hệ thống đăng nhập, đăng ký, JWT, phân quyền

### 👥 Quản lý người dùng
- [2. Quản lý người dùng](./02-user-management.md) - CRUD người dùng, thông tin cá nhân

### 📊 Hồ sơ & Sức khỏe
- [3. Hồ sơ cá nhân](./03-profile-management.md) - Quản lý profile, chỉ số Inbody, theo dõi tiến độ

### 🍽️ Dinh dưỡng & Bữa ăn
- [4. Quản lý bữa ăn](./04-meal-management.md) - Ghi lại bữa ăn, tính toán dinh dưỡng
- [5. Theo dõi lượng nước](./05-water-tracking.md) - Ghi lại lượng nước uống, mục tiêu nước
- [7. Mục tiêu](./07-goals.md) - Thiết lập và theo dõi mục tiêu

### 💪 Tập luyện & Sức khỏe
- [6. Quản lý tập luyện](./06-exercise-management.md) - Ghi lại bài tập, tính calo đốt cháy

### 📈 Dashboard & Thống kê
- [8. Dashboard và thống kê](./08-dashboard.md) - Tổng quan, biểu đồ, báo cáo

### 🤖 AI & Tư vấn
- [9. AI Personal Trainer & Nutritionist](./09-ai-personal-trainer.md) - AI phân tích profile và gợi ý mục tiêu
- [13. AI Assistant - Trợ lý ảo](./13-ai-assistant.md) - Chatbot tư vấn dinh dưỡng, hỗ trợ người dùng

### 📧 Thông báo
- [10. Gửi email](./10-email.md) - Hệ thống gửi email tự động

### 👨‍💼 Huấn luyện viên & Marketplace
- [11. Quản lý mối quan hệ Huấn luyện viên - Người dùng](./11-trainer-relationship.md) - Marketplace, kết nối, gợi ý

### 💰 Thanh toán & Ví điện tử
- [12. Hệ thống ví điện tử và thanh toán](./12-wallet-payment.md) - Ví điện tử, thanh toán, khuyến mại

## 🚀 Cách sử dụng

### Cho Developer:
1. **Đọc tài liệu tổng quan**: Bắt đầu với file README.md chính
2. **Chọn module cần phát triển**: Xem mục lục và chọn module phù hợp
3. **Đọc chi tiết module**: Mỗi file chứa thông tin đầy đủ về:
   - Chức năng và tính năng
   - API endpoints
   - Cấu trúc thư mục
   - Database schema
   - Workflow thực tế

### Cho Project Manager:
1. **Xem tổng quan**: Đọc file README.md chính để hiểu kiến trúc
2. **Lập kế hoạch**: Chọn module cần ưu tiên phát triển
3. **Phân công**: Dựa trên thông tin chi tiết trong từng file

### Cho QA/Testing:
1. **Hiểu chức năng**: Đọc mô tả chức năng trong từng module
2. **Test API**: Sử dụng danh sách API endpoints để test
3. **Kiểm tra workflow**: Theo dõi các workflow thực tế

## 📁 Cấu trúc thư mục

```
docs/
├── README.md                    # File này - Mục lục tổng quan
├── installation.md              # Hướng dẫn cài đặt chi tiết
├── 01-authentication.md         # Module 1: Xác thực & Phân quyền
├── 02-user-management.md        # Module 2: Quản lý người dùng
├── 03-profile-management.md     # Module 3: Hồ sơ cá nhân
├── 04-meal-management.md        # Module 4: Quản lý bữa ăn
├── 05-water-tracking.md         # Module 5: Theo dõi lượng nước
├── 06-exercise-management.md    # Module 6: Quản lý tập luyện
├── 07-goals.md                  # Module 7: Mục tiêu
├── 08-dashboard.md              # Module 8: Dashboard và thống kê
├── 09-ai-personal-trainer.md    # Module 9: AI Personal Trainer
├── 10-email.md                  # Module 10: Gửi email
├── 11-trainer-relationship.md   # Module 11: Trainer-User Relationship
├── 12-wallet-payment.md         # Module 12: Wallet & Payment
└── 13-ai-assistant.md           # Module 13: AI Assistant - Trợ lý ảo
```

## 🔗 Liên kết với code

Mỗi file tài liệu chứa thông tin về:
- **Cấu trúc thư mục**: Đường dẫn đến code thực tế
- **API Endpoints**: Danh sách đầy đủ các API
- **Database Schema**: Cấu trúc database
- **Workflow**: Quy trình thực tế

## 📝 Ghi chú

- Tài liệu được viết bằng tiếng Việt để dễ hiểu
- Mỗi module được mô tả độc lập nhưng có liên kết với nhau
- API endpoints được liệt kê đầy đủ với mô tả chức năng
- Database schema được mô tả chi tiết cho từng module
- Workflow thực tế giúp hiểu rõ quy trình sử dụng
