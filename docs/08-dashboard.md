# 📈 8. Dashboard và thống kê

## Chức năng:
- **Thống kê tổng quan**: Tổng quan về sức khỏe và dinh dưỡng
- **Biểu đồ dinh dưỡng**: Biểu đồ calo, protein, carb, fat theo thời gian
- **Tiến độ mục tiêu**: Theo dõi tiến độ đạt mục tiêu
- **Báo cáo sức khỏe**: Báo cáo tổng hợp về sức khỏe

## API Endpoints:
- `GET /dashboard` - Lấy dữ liệu dashboard
- `GET /dashboard/nutrition-stats` - Thống kê dinh dưỡng
- `GET /dashboard/exercise-stats` - Thống kê tập luyện
- `GET /dashboard/water-stats` - Thống kê nước
- `GET /dashboard/goal-progress` - Tiến độ mục tiêu

## Cấu trúc thư mục:
```
src/dashboard/
├── dashboard.controller.ts
├── dashboard.module.ts
└── dashboard.service.ts
```

## Dữ liệu dashboard:
- **Tổng quan ngày hôm nay**:
  - Calo đã nạp / mục tiêu
  - Protein, carb, fat đã nạp
  - Nước đã uống / mục tiêu
  - Calo đã đốt cháy
  - Số bước đi bộ

- **Thống kê tuần**:
  - Trung bình calo/ngày
  - Tổng calo đốt cháy
  - Số buổi tập luyện
  - Tiến độ mục tiêu

- **Thống kê tháng**:
  - Biểu đồ thay đổi cân nặng
  - Biểu đồ thay đổi các chỉ số Inbody
  - Báo cáo tổng hợp sức khỏe

## Biểu đồ và báo cáo:
- **Biểu đồ dinh dưỡng**: Line chart calo, protein, carb, fat theo thời gian
- **Biểu đồ tập luyện**: Bar chart số buổi tập, calo đốt cháy
- **Biểu đồ nước**: Line chart lượng nước uống hàng ngày
- **Biểu đồ tiến độ**: Progress chart so với mục tiêu
- **Báo cáo sức khỏe**: PDF report tổng hợp 