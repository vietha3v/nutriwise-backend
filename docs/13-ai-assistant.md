# AI Assistant Module

## Tổng quan

Module AI Assistant là trợ lý thông minh tích hợp trong hệ thống NutriWise, giúp người dùng tương tác tự nhiên với ứng dụng thông qua ngôn ngữ tự nhiên. Module này hỗ trợ hai chế độ hoạt động linh hoạt để đáp ứng các nhu cầu khác nhau của người dùng.

## Mục tiêu kinh doanh

### Giá trị cốt lõi
- **Tăng trải nghiệm người dùng**: Giao diện chat tự nhiên, dễ sử dụng
- **Giảm thời gian thao tác**: Thực hiện tác vụ nhanh chóng qua lệnh thoại
- **Tăng tỷ lệ sử dụng**: Khuyến khích người dùng tương tác thường xuyên
- **Hỗ trợ cá nhân hóa**: Tư vấn dinh dưỡng và sức khỏe theo nhu cầu cá nhân

### Đối tượng sử dụng
- **Người dùng cá nhân**: Theo dõi dinh dưỡng, tập luyện, sức khỏe
- **Người mới bắt đầu**: Cần hướng dẫn và tư vấn
- **Người bận rộn**: Muốn thao tác nhanh qua chat
- **Người quan tâm sức khỏe**: Tìm kiếm lời khuyên chuyên môn

## Chức năng chính

### 1. Chế độ Direct Chat (Mặc định)
**Mục đích**: Hỗ trợ tương tác tự nhiên và tư vấn dinh dưỡng

**Tính năng**:
- Chat trực tiếp với AI về các chủ đề dinh dưỡng, sức khỏe
- Nhận tư vấn cá nhân hóa dựa trên thông tin profile
- Hỏi đáp về thực phẩm, chế độ ăn, tập luyện
- Nhận lời khuyên sức khỏe theo tình trạng cá nhân

**Lợi ích**:
- Phản hồi nhanh chóng và tự nhiên
- Tiết kiệm tài nguyên hệ thống
- Phù hợp cho người dùng mới làm quen

### 2. Chế độ AI Agent
**Mục đích**: Thực hiện tác vụ tự động thông qua lệnh thoại

**Tính năng**:
- Ghi nhận bữa ăn, bài tập, lượng nước uống
- Tạo và quản lý mục tiêu dinh dưỡng
- Xem báo cáo và thống kê
- Tìm kiếm thực phẩm và gợi ý bữa ăn

**Lợi ích**:
- Tự động hóa cao, giảm thao tác thủ công
- Thu thập dữ liệu chính xác và đầy đủ
- Tăng hiệu quả sử dụng ứng dụng

## Danh mục chức năng chi tiết

### Quản lý thông tin cá nhân
**Chức năng**: Cập nhật thông tin cá nhân và thể chất
**Công dụng**: 
- Duy trì thông tin profile chính xác
- Cung cấp cơ sở cho tư vấn cá nhân hóa
- Theo dõi tiến độ thay đổi cơ thể

**Thông tin quản lý**:
- Thông tin cơ bản: tên, tuổi, giới tính, email, số điện thoại
- Chỉ số thể chất: chiều cao, cân nặng, cân nặng mục tiêu
- Thông tin sức khỏe: tình trạng bệnh, dị ứng, hạn chế ăn uống
- Mức độ hoạt động và lối sống

### Quản lý dinh dưỡng
**Chức năng**: Ghi nhận và quản lý thông tin bữa ăn
**Công dụng**:
- Theo dõi lượng calo và dinh dưỡng hàng ngày
- Phân tích xu hướng ăn uống
- Đánh giá mức độ đạt mục tiêu dinh dưỡng

**Thông tin ghi nhận**:
- Loại bữa ăn (sáng, trưa, tối, ăn nhẹ)
- Danh sách thực phẩm và lượng ăn
- Thông tin dinh dưỡng chi tiết (protein, carbs, fat, vitamin)
- Thời gian, địa điểm và tâm trạng khi ăn

### Quản lý mục tiêu
**Chức năng**: Thiết lập và theo dõi mục tiêu dinh dưỡng, sức khỏe
**Công dụng**:
- Định hướng hành trình cải thiện sức khỏe
- Đo lường tiến độ và thành công
- Tạo động lực duy trì lối sống lành mạnh

**Loại mục tiêu**:
- Mục tiêu cân nặng: giảm cân, tăng cân, duy trì
- Mục tiêu dinh dưỡng: calo, protein, nước
- Mục tiêu tập luyện: tần suất, cường độ
- Mục tiêu sức khỏe: cải thiện chỉ số sức khỏe

### Theo dõi nước uống
**Chức năng**: Ghi nhận lượng nước uống hàng ngày
**Công dụng**:
- Đảm bảo đủ nước cho cơ thể
- Phòng ngừa mất nước
- Hỗ trợ quá trình trao đổi chất

**Thông tin theo dõi**:
- Lượng nước uống (ml)
- Loại nước (tinh khiết, khoáng, lọc)
- Thời gian và địa điểm uống
- Nhiệt độ và loại bình chứa

### Quản lý tập luyện
**Chức năng**: Ghi nhận hoạt động thể dục, thể thao
**Công dụng**:
- Theo dõi lượng calo tiêu thụ
- Đánh giá hiệu quả tập luyện
- Cân bằng dinh dưỡng và vận động

**Thông tin ghi nhận**:
- Loại bài tập và thời gian thực hiện
- Cường độ và calo tiêu thụ
- Thiết bị sử dụng và địa điểm tập
- Tâm trạng và ghi chú cá nhân

### Tìm kiếm và gợi ý
**Chức năng**: Tìm kiếm thực phẩm và gợi ý bữa ăn
**Công dụng**:
- Hỗ trợ lựa chọn thực phẩm phù hợp
- Đa dạng hóa bữa ăn
- Tiết kiệm thời gian lập kế hoạch

**Tính năng tìm kiếm**:
- Tìm kiếm theo tên, danh mục thực phẩm
- Lọc theo giá trị dinh dưỡng
- Loại trừ thực phẩm dị ứng
- Sắp xếp theo độ phổ biến

**Gợi ý bữa ăn**:
- Dựa trên sở thích và hạn chế ăn uống
- Phù hợp với mục tiêu calo và dinh dưỡng
- Cân nhắc thời gian nấu và độ khó
- Gợi ý theo mùa và ngân sách

### Tư vấn và lời khuyên
**Chức năng**: Cung cấp tư vấn dinh dưỡng và lời khuyên sức khỏe
**Công dụng**:
- Nâng cao kiến thức dinh dưỡng
- Hỗ trợ quyết định lối sống lành mạnh
- Phòng ngừa các vấn đề sức khỏe

**Nội dung tư vấn**:
- Tư vấn dinh dưỡng theo độ tuổi, giới tính
- Lời khuyên phù hợp với tình trạng sức khỏe
- Hướng dẫn chế độ ăn cho mục tiêu cụ thể
- Lời khuyên theo mùa và thời tiết

### Báo cáo và thống kê
**Chức năng**: Hiển thị thông tin tổng quan và báo cáo
**Công dụng**:
- Đánh giá tổng quan tình trạng sức khỏe
- Theo dõi tiến độ đạt mục tiêu
- Phân tích xu hướng thay đổi

**Loại báo cáo**:
- Dashboard tổng quan hàng ngày
- Báo cáo tuần với phân tích chi tiết
- Thống kê dinh dưỡng và tập luyện
- So sánh với mục tiêu đã đặt

## Cấu hình hệ thống

### Biến môi trường cần thiết
```env
# Chế độ hoạt động AI Assistant
AI_AGENT_MODE_ENABLED=false  # true = AI Agent Mode, false = Direct Chat Mode

# Cấu hình OpenAI
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=1000
OPENAI_TEMPERATURE=0.7

# Cấu hình cache
AI_CACHE_ENABLED=true
AI_CACHE_EXPIRY_HOURS=24
```

### Chuyển đổi chế độ hoạt động
1. **Kích hoạt AI Agent Mode**: Đặt `AI_AGENT_MODE_ENABLED=true`
2. **Kích hoạt Direct Chat Mode**: Đặt `AI_AGENT_MODE_ENABLED=false`
3. **Khởi động lại server** sau khi thay đổi cấu hình

## API Endpoints

### POST /ai-assistant/chat
**Mục đích**: Gửi tin nhắn đến AI Assistant
**Headers**: Authorization (JWT token), Content-Type: application/json
**Body**: JSON chứa nội dung tin nhắn
**Response**: Phản hồi từ AI với thông tin intent và context

### GET /ai-assistant/history
**Mục đích**: Lấy lịch sử chat của người dùng
**Headers**: Authorization (JWT token)
**Query Parameters**: limit (số lượng tin nhắn, mặc định: 50)
**Response**: Danh sách tin nhắn đã trao đổi

## Lưu ý triển khai

### Yêu cầu hệ thống
- AI Agent Mode cần cấu hình đầy đủ các action trong file cấu hình
- Direct Chat Mode phù hợp cho môi trường có tài nguyên hạn chế
- Lịch sử chat được lưu trữ trong database cho cả hai chế độ

### Khuyến nghị sử dụng
- Sử dụng Direct Chat Mode cho người dùng mới và tư vấn chung
- Chuyển sang AI Agent Mode khi người dùng đã quen thuộc
- Kết hợp cả hai chế độ để tối ưu trải nghiệm người dùng

### Tài liệu kỹ thuật
Chi tiết kỹ thuật và API documentation được cung cấp trong Swagger tại `/api-docs`
