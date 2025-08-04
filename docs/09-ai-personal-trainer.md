# 🤖 9. AI Personal Trainer & Nutritionist

## Chức năng chi tiết:

### 1. Phân tích profile và mục tiêu:
- **Phân tích chỉ số hiện tại**: AI phân tích tất cả chỉ số Inbody (cân nặng, mỡ, cơ, nước, BMR, TDEE)
- **Đánh giá tình trạng sức khỏe**: Phân loại tình trạng sức khỏe dựa trên các chỉ số
- **Xác định loại hình cơ thể**: Phân tích và xác định người dùng thuộc nhóm Ectomorph, Mesomorph hay Endomorph
- **Tính toán khoảng cách mục tiêu**: So sánh chỉ số hiện tại với mục tiêu mong muốn
- **Đánh giá khả thi**: Đánh giá tính khả thi của mục tiêu trong thời gian đã định

### 2. Tạo kế hoạch dinh dưỡng cá nhân hóa:
- **Tính toán nhu cầu calo**: Dựa trên BMR, TDEE và mục tiêu (giảm/tăng/duy trì)
- **Phân bổ macro**: Tính toán tỷ lệ protein, carb, fat phù hợp với mục tiêu
- **Thiết kế thực đơn**: Tạo thực đơn hàng ngày/tuần với các món ăn cụ thể
- **Tính toán khẩu phần**: Định lượng chính xác từng món ăn theo nhu cầu
- **Gợi ý thực phẩm thay thế**: Đề xuất các thực phẩm tương đương khi cần
- **Lên lịch ăn uống**: Sắp xếp thời gian ăn uống tối ưu trong ngày
- **Xử lý ràng buộc**: Tự động loại trừ thực phẩm dị ứng, hạn chế ăn uống

### 3. Tạo kế hoạch tập luyện cá nhân hóa:
- **Phân tích mục tiêu tập luyện**: Xác định loại bài tập phù hợp với mục tiêu
- **Thiết kế lịch tập**: Tạo lịch tập theo tuần với các ngày cụ thể
- **Chọn bài tập phù hợp**: Đề xuất bài tập dựa trên mục tiêu và khả năng
- **Tính toán cường độ**: Định mức cường độ tập luyện phù hợp với trình độ
- **Lập kế hoạch tiến bộ**: Thiết kế lộ trình tăng dần độ khó và cường độ
- **Tính toán calo đốt cháy**: Ước tính calo tiêu hao cho từng buổi tập
- **Điều chỉnh theo thời gian**: Tối ưu hóa thời gian tập luyện trong ngày

### 4. Theo dõi và đánh giá tiến độ:
- **Thu thập dữ liệu tiến độ**: Tự động thu thập dữ liệu từ các module khác
- **Phân tích hiệu quả**: Đánh giá hiệu quả của kế hoạch đang thực hiện
- **So sánh với mục tiêu**: So sánh tiến độ thực tế với mục tiêu ban đầu
- **Phát hiện vấn đề**: Nhận diện các vấn đề trong quá trình thực hiện
- **Đưa ra cảnh báo**: Cảnh báo khi tiến độ không đạt như mong đợi

### 5. Điều chỉnh kế hoạch thông minh:
- **Phân tích nguyên nhân**: Tìm hiểu nguyên nhân khi tiến độ không đạt
- **Đề xuất điều chỉnh**: Đưa ra các đề xuất điều chỉnh kế hoạch
- **Tối ưu hóa liên tục**: Liên tục cải thiện kế hoạch dựa trên kết quả
- **Thích ứng với thay đổi**: Điều chỉnh khi có thay đổi về mục tiêu hoặc tình trạng

### 6. Tư vấn và gợi ý thông minh:
- **Gợi ý dinh dưỡng**: Đưa ra lời khuyên về dinh dưỡng dựa trên tình trạng
- **Gợi ý lối sống**: Khuyến nghị về giấc ngủ, stress management, thói quen
- **Cảnh báo sức khỏe**: Cảnh báo khi có dấu hiệu bất thường
- **Động viên và khuyến khích**: Đưa ra lời động viên phù hợp với tiến độ

## Tham số đầu vào chi tiết:

### 1. Thông tin profile hiện tại:
- **Thông tin cá nhân**: Tuổi, giới tính, chiều cao, cân nặng
- **Chỉ số Inbody đầy đủ**: 
  - Cân nặng, tỷ lệ mỡ cơ thể, khối lượng cơ bắp
  - Chỉ số nước (TBW, ICW, ECW), mỡ nội tạng
  - BMI, FFMI, BMR, TDEE
- **Mức độ hoạt động**: Từ SEDENTARY đến EXTREMELY_ACTIVE
- **Tình trạng sức khỏe**: Bệnh lý, dị ứng, hạn chế ăn uống

### 2. Mục tiêu và thời gian:
- **Loại mục tiêu**: LOSE_WEIGHT, GAIN_WEIGHT, BUILD_MUSCLE, MAINTAIN_WEIGHT, IMPROVE_HEALTH
- **Mục tiêu cụ thể**: Số kg muốn giảm/tăng, tỷ lệ mỡ mục tiêu
- **Thời gian mục tiêu**: Số tuần/tháng muốn đạt được mục tiêu
- **Mức độ ưu tiên**: Cao, trung bình, thấp cho từng mục tiêu

### 3. Ràng buộc và sở thích:
- **Dị ứng thực phẩm**: Danh sách thực phẩm cần tránh
- **Hạn chế ăn uống**: Chế độ ăn đặc biệt (vegetarian, vegan, keto, etc.)
- **Sở thích ăn uống**: Thực phẩm yêu thích và không thích
- **Ràng buộc thời gian**: Thời gian có thể dành cho tập luyện
- **Ràng buộc địa điểm**: Tập tại nhà, gym, ngoài trời

### 4. Thông tin bổ sung:
- **Lịch sử tập luyện**: Kinh nghiệm tập luyện trước đây
- **Thiết bị có sẵn**: Dụng cụ tập luyện tại nhà
- **Khả năng tài chính**: Ngân sách cho thực phẩm và tập luyện
- **Môi trường sống**: Thành thị, nông thôn, khí hậu

## Kế hoạch được sinh ra chi tiết:

### 1. Kế hoạch dinh dưỡng:
- **Thực đơn chi tiết**: 
  - Bữa sáng: Món ăn cụ thể, khẩu phần, calo
  - Bữa trưa: Món ăn cụ thể, khẩu phần, calo
  - Bữa tối: Món ăn cụ thể, khẩu phần, calo
  - Bữa phụ: Snack, smoothie, supplement
- **Tổng dinh dưỡng hàng ngày**:
  - Tổng calo: Chính xác số calo cần nạp
  - Protein: Gram và tỷ lệ phần trăm
  - Carbohydrate: Gram và tỷ lệ phần trăm
  - Fat: Gram và tỷ lệ phần trăm
  - Fiber, vitamin, khoáng chất
- **Lịch ăn uống**:
  - Thời gian cụ thể cho từng bữa
  - Khoảng cách giữa các bữa
  - Thời gian uống nước
- **Gợi ý thực phẩm thay thế**:
  - Danh sách thực phẩm tương đương
  - Cách chế biến thay thế
  - Lưu ý khi thay thế

### 2. Kế hoạch tập luyện:
- **Lịch tập theo tuần**:
  - Thứ 2: Cardio + Strength (45 phút)
  - Thứ 3: Rest day
  - Thứ 4: Strength training (60 phút)
  - Thứ 5: Cardio (30 phút)
  - Thứ 6: Strength + Flexibility (50 phút)
  - Thứ 7: Rest day
  - Chủ nhật: Light cardio (20 phút)
- **Chi tiết từng buổi tập**:
  - Tên bài tập cụ thể
  - Số set, số rep, thời gian nghỉ
  - Cường độ (RPE, % 1RM)
  - Thời gian thực hiện
- **Progression plan**:
  - Tuần 1-2: Tập làm quen
  - Tuần 3-4: Tăng cường độ
  - Tuần 5-6: Tăng khối lượng
  - Tuần 7-8: Peak performance
- **Tính toán calo đốt cháy**:
  - Ước tính calo tiêu hao cho từng buổi
  - Tổng calo đốt cháy hàng tuần
  - Điều chỉnh dinh dưỡng tương ứng

### 3. Kế hoạch theo dõi:
- **Lịch đo chỉ số định kỳ**:
  - Tuần 1: Đo chỉ số ban đầu
  - Tuần 4: Đo chỉ số giữa kỳ
  - Tuần 8: Đo chỉ số cuối kỳ
  - Tuần 12: Đo chỉ số đánh giá tổng kết
- **Điểm kiểm tra tiến độ**:
  - Kiểm tra cân nặng hàng tuần
  - Đo vòng eo, bắp tay hàng tháng
  - Chụp ảnh so sánh hàng tháng
  - Đánh giá cảm giác sức khỏe
- **Điều chỉnh kế hoạch**:
  - Điều chỉnh khi tiến độ chậm
  - Tăng cường độ khi tiến độ tốt
  - Thay đổi bài tập khi cần thiết
  - Điều chỉnh dinh dưỡng theo phản hồi

## Quy trình AI chi tiết:

### Bước 1: Phân tích đầu vào
- Thu thập và phân tích tất cả thông tin profile
- Xác định loại hình cơ thể (Ectomorph/Mesomorph/Endomorph)
- Tính toán BMR, TDEE và nhu cầu dinh dưỡng
- Đánh giá tình trạng sức khỏe hiện tại

### Bước 2: Tính toán khoảng cách mục tiêu
- So sánh chỉ số hiện tại với mục tiêu mong muốn
- Tính toán số kg cần giảm/tăng
- Xác định thời gian cần thiết để đạt mục tiêu
- Đánh giá tính khả thi của mục tiêu

### Bước 3: Tạo kế hoạch tổng thể
- Thiết kế kế hoạch dinh dưỡng chi tiết
- Tạo lịch tập luyện phù hợp
- Lập kế hoạch theo dõi và đánh giá
- Tính toán timeline cụ thể

### Bước 4: Tối ưu hóa kế hoạch
- Điều chỉnh theo ràng buộc và sở thích
- Tối ưu hóa thời gian và hiệu quả
- Cân bằng giữa dinh dưỡng và tập luyện
- Đảm bảo tính bền vững của kế hoạch

### Bước 5: Triển khai và theo dõi
- Triển khai kế hoạch cho người dùng
- Thu thập dữ liệu thực hiện hàng ngày
- Phân tích tiến độ và hiệu quả
- Điều chỉnh kế hoạch khi cần thiết

### Bước 6: Đánh giá và cải thiện
- Đánh giá tổng thể sau mỗi giai đoạn
- Phân tích thành công và thất bại
- Cải thiện thuật toán dựa trên kết quả
- Tối ưu hóa cho các trường hợp tương tự

## API Endpoints chi tiết:

### Phân tích và tạo kế hoạch:
- `POST /ai/analyze-profile` - Phân tích profile và tạo kế hoạch mới
- `POST /ai/analyze-profile/quick` - Phân tích nhanh profile hiện tại
- `POST /ai/analyze-profile/detailed` - Phân tích chi tiết với nhiều tham số

### Quản lý kế hoạch:
- `GET /ai/plan/:planId` - Lấy kế hoạch chi tiết
- `GET /ai/plan/:planId/summary` - Lấy tóm tắt kế hoạch
- `PATCH /ai/plan/:planId` - Cập nhật kế hoạch
- `DELETE /ai/plan/:planId` - Xóa kế hoạch
- `POST /ai/plan/:planId/duplicate` - Tạo bản sao kế hoạch

### Theo dõi tiến độ:
- `GET /ai/plan/:planId/progress` - Theo dõi tiến độ kế hoạch
- `GET /ai/plan/:planId/progress/detailed` - Tiến độ chi tiết
- `GET /ai/plan/:planId/progress/charts` - Dữ liệu cho biểu đồ tiến độ
- `POST /ai/plan/:planId/progress/update` - Cập nhật tiến độ thủ công

### Điều chỉnh kế hoạch:
- `POST /ai/plan/:planId/adjust` - Điều chỉnh kế hoạch dựa trên tiến độ
- `POST /ai/plan/:planId/adjust/auto` - Tự động điều chỉnh kế hoạch
- `POST /ai/plan/:planId/adjust/manual` - Điều chỉnh thủ công
- `GET /ai/plan/:planId/adjust/history` - Lịch sử điều chỉnh

### Gợi ý và tư vấn:
- `GET /ai/recommendations` - Gợi ý dinh dưỡng và tập luyện
- `GET /ai/recommendations/nutrition` - Gợi ý dinh dưỡng
- `GET /ai/recommendations/exercise` - Gợi ý bài tập
- `GET /ai/recommendations/lifestyle` - Gợi ý lối sống
- `POST /ai/recommendations/feedback` - Phản hồi về gợi ý

### Báo cáo và phân tích:
- `GET /ai/plan/:planId/report` - Báo cáo tổng hợp kế hoạch
- `GET /ai/plan/:planId/report/weekly` - Báo cáo hàng tuần
- `GET /ai/plan/:planId/report/monthly` - Báo cáo hàng tháng
- `GET /ai/plan/:planId/analysis` - Phân tích hiệu quả kế hoạch

## Cấu trúc thư mục:
```
src/ai/
├── ai.controller.ts
├── ai.module.ts
├── ai.service.ts
└── entities/
    └── ai-cache.entity.ts
```

## Database Schema:
- **ai_plans**: Lưu trữ kế hoạch được tạo bởi AI
- **ai_plan_details**: Chi tiết kế hoạch (dinh dưỡng, tập luyện)
- **ai_progress**: Tiến độ thực hiện kế hoạch
- **ai_cache**: Cache kết quả phân tích để tối ưu hiệu suất 