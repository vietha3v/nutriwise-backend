# 🎯 7. Mục tiêu (Goals)

## Chức năng:
- **Quản lý mục tiêu**: Lưu trữ và quản lý các mục tiêu dinh dưỡng đã chọn
- **Đa mục tiêu**: Hỗ trợ nhiều mục tiêu cùng lúc (tăng cân + giảm mỡ + tăng cơ)
- **Theo dõi tiến độ**: Theo dõi tiến độ đạt mục tiêu
- **Điều chỉnh mục tiêu**: Cập nhật mục tiêu theo thời gian
- **Tính toán tổng hợp**: Kết hợp nhiều mục tiêu thành kế hoạch dinh dưỡng
- **Phân tích hiệu quả**: Đánh giá hiệu quả của mục tiêu

## Workflow tích hợp:
1. **Đo cân Inbody** → Lưu thông tin vào Profile
2. **AI phân tích và gợi ý** → AI Module phân tích profile và đề xuất mục tiêu
3. **Chọn mục tiêu** → Người dùng chọn từ gợi ý AI hoặc tự tạo mục tiêu
4. **Tạo Goal** → Lưu mục tiêu vào hệ thống
5. **Thực hiện và theo dõi** → Ghi lại bữa ăn, so sánh với mục tiêu
6. **Đo lại và đánh giá** → Tạo Profile mới, đánh giá tiến độ

## Thông tin mục tiêu:
- **Tên mục tiêu**: Mô tả cụ thể (ví dụ: "Tăng cân", "Giảm mỡ bụng")
- **Loại mục tiêu**: LOSE_WEIGHT, MAINTAIN_WEIGHT, GAIN_WEIGHT, BUILD_MUSCLE, IMPROVE_HEALTH
- **Mục tiêu cụ thể**: Cân nặng, tỷ lệ mỡ, khối lượng cơ
- **Mục tiêu dinh dưỡng**: calo, protein, carb, fat, nước
- **Thời gian**: ngày bắt đầu, ngày mục tiêu
- **Ưu tiên**: Thứ tự thực hiện mục tiêu (priority)
- **Trạng thái**: active/inactive/completed/paused/cancelled

## Đa mục tiêu:
### Ví dụ thực tế:
- **Mục tiêu 1**: Tăng cân (60kg → 65kg) - Priority: 1
- **Mục tiêu 2**: Giảm mỡ (20% → 15% body fat) - Priority: 2  
- **Mục tiêu 3**: Tăng cơ (25kg → 30kg muscle mass) - Priority: 3

### Tính toán tổng hợp:
- **Calo tổng hợp**: Kết hợp từ tất cả mục tiêu active
- **Protein tổng hợp**: Ưu tiên mục tiêu BUILD_MUSCLE
- **Carb/Fat tổng hợp**: Cân bằng theo tỷ lệ dinh dưỡng
- **Nước tổng hợp**: Dựa trên cân nặng và hoạt động
- **Kế hoạch tập luyện**: Kết hợp từ tất cả mục tiêu active

## API Endpoints:

### Goals Module:
- `POST /goals` - Tạo mục tiêu (từ gợi ý AI hoặc tùy chỉnh)
- `GET /goals` - Lấy danh sách mục tiêu
- `GET /goals/:id` - Xem chi tiết mục tiêu
- `PATCH /goals/:id` - Cập nhật mục tiêu
- `DELETE /goals/:id` - Xóa mục tiêu

### AI Module:
- `GET /ai/suggested-goals` - Lấy gợi ý mục tiêu

## Cấu trúc thư mục:
```
src/goals/
├── goals.controller.ts
├── goals.module.ts
├── goals.service.ts
├── dto/
│   ├── create-goal.dto.ts
│   ├── update-goal.dto.ts
│   └── update-priority.dto.ts
└── entities/
    └── goal.entity.ts
```

## Loại mục tiêu:
- **LOSE_WEIGHT**: Giảm cân với calo deficit 300-500 kcal/ngày
- **MAINTAIN_WEIGHT**: Duy trì cân nặng hiện tại
- **GAIN_WEIGHT**: Tăng cân với calo surplus 300-500 kcal/ngày
- **BUILD_MUSCLE**: Tăng cơ với protein cao (1.6-2.2g/kg)
- **IMPROVE_HEALTH**: Cải thiện sức khỏe tổng thể

## Tính toán mục tiêu:
- **Calo mục tiêu**: Dựa trên TDEE từ Profile và loại mục tiêu
- **Protein**: 1.2-2.2g/kg tùy theo mục tiêu
- **Carb**: 45-65% tổng calo
- **Fat**: 20-35% tổng calo
- **Nước**: 30ml/kg + điều chỉnh theo hoạt động
- **Tập luyện**: Tần suất, cường độ, loại bài tập theo mục tiêu

## Tích hợp với các module:

### Profile Module:
- **Input**: Sử dụng Profile mới nhất để tính toán mục tiêu
- **Output**: Cập nhật mục tiêu khi có Profile mới

### AI Module:
- **Input**: Gọi API AI để lấy gợi ý mục tiêu
- **Output**: Nhận gợi ý và tạo mục tiêu từ gợi ý AI

### Meal Module:
- **Input**: So sánh bữa ăn thực tế với mục tiêu
- **Output**: Đánh giá tiến độ đạt mục tiêu

### Dashboard Module:
- **Input**: Hiển thị tiến độ từng mục tiêu riêng biệt
- **Output**: Biểu đồ tiến độ, tỷ lệ hoàn thành

## Hướng dẫn sử dụng:

### 1. Tạo mục tiêu từ gợi ý AI:
- Gọi API `GET /ai/suggested-goals` để lấy gợi ý mục tiêu
- Chọn gợi ý phù hợp từ danh sách AI đề xuất
- Gọi API `POST /goals` với dữ liệu từ gợi ý AI

### 2. Tạo mục tiêu tùy chỉnh:
- Nhập thông tin mục tiêu theo ý muốn
- Hệ thống tính toán và đề xuất kế hoạch
- Lưu mục tiêu vào hệ thống

### 3. Quản lý đa mục tiêu:
- Tạo nhiều mục tiêu cùng lúc
- Thiết lập priority cho từng mục tiêu (thông qua PATCH)
- AI sẽ tự tính toán kế hoạch dinh dưỡng và tập luyện tối ưu cho tất cả mục tiêu

### 4. Theo dõi tiến độ:
- So sánh với Profile mới (đo lại)
- Đánh giá hiệu quả từng mục tiêu
- Điều chỉnh mục tiêu nếu cần

### 5. Tích hợp với bữa ăn:
- Ghi lại bữa ăn thực tế
- So sánh với mục tiêu
- Đánh giá tiến độ hàng ngày 