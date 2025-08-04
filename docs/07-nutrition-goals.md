# 🎯 7. Mục tiêu dinh dưỡng (Nutrition Goals)

## Chức năng:
- **Tạo mục tiêu**: Thiết lập mục tiêu dinh dưỡng cá nhân
- **Theo dõi tiến độ**: Theo dõi tiến độ đạt mục tiêu
- **Điều chỉnh mục tiêu**: Cập nhật mục tiêu theo thời gian
- **Phân tích mục tiêu**: Phân tích hiệu quả mục tiêu

## Thông tin mục tiêu:
- Loại mục tiêu: LOSE_WEIGHT, MAINTAIN_WEIGHT, GAIN_WEIGHT, BUILD_MUSCLE, IMPROVE_HEALTH
- Cân nặng hiện tại và mục tiêu
- Mục tiêu dinh dưỡng: calo, protein, carb, fat, nước
- Thời gian: ngày bắt đầu, ngày mục tiêu
- Trạng thái: active/inactive

## API Endpoints:
- `POST /nutrition-goals` - Tạo mục tiêu mới
- `GET /nutrition-goals` - Lấy danh sách mục tiêu
- `GET /nutrition-goals/:id` - Xem chi tiết mục tiêu
- `PATCH /nutrition-goals/:id` - Cập nhật mục tiêu
- `DELETE /nutrition-goals/:id` - Xóa mục tiêu
- `GET /nutrition-goals/progress` - Theo dõi tiến độ

## Cấu trúc thư mục:
```
src/nutrition-goal/
├── nutrition-goal.controller.ts
├── nutrition-goal.module.ts
├── nutrition-goal.service.ts
├── dto/
│   └── create-nutrition-goal.dto.ts
└── entities/
    └── nutrition-goal.entity.ts
```

## Loại mục tiêu:
- **LOSE_WEIGHT**: Giảm cân với calo deficit 300-500 kcal/ngày
- **MAINTAIN_WEIGHT**: Duy trì cân nặng hiện tại
- **GAIN_WEIGHT**: Tăng cân với calo surplus 300-500 kcal/ngày
- **BUILD_MUSCLE**: Tăng cơ với protein cao (1.6-2.2g/kg)
- **IMPROVE_HEALTH**: Cải thiện sức khỏe tổng thể

## Tính toán mục tiêu:
- **Calo mục tiêu**: Dựa trên TDEE và loại mục tiêu
- **Protein**: 1.2-2.2g/kg tùy theo mục tiêu
- **Carb**: 45-65% tổng calo
- **Fat**: 20-35% tổng calo
- **Nước**: 30ml/kg + điều chỉnh theo hoạt động 