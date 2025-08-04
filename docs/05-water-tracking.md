# 💧 5. Theo dõi lượng nước (Water Tracking)

## Chức năng:
- **Ghi lại lượng nước**: Ghi lại lượng nước uống theo thời gian
- **Mục tiêu nước**: Thiết lập và theo dõi mục tiêu nước hàng ngày
- **Thống kê nước**: Xem thống kê lượng nước theo ngày/tuần/tháng
- **Nhắc nhở**: Hệ thống nhắc nhở uống nước

## API Endpoints:
- `POST /water` - Ghi lại lượng nước uống
- `GET /water` - Lấy danh sách lượng nước
- `GET /water/:id` - Xem chi tiết lượng nước
- `PATCH /water/:id` - Cập nhật lượng nước
- `DELETE /water/:id` - Xóa lượng nước
- `GET /water/stats` - Thống kê lượng nước

## Cấu trúc thư mục:
```
src/water/
├── water.controller.ts
├── water.module.ts
├── water.service.ts
├── dto/
│   └── create-water-intake.dto.ts
└── entities/
    └── water-intake.entity.ts
```

## Thông tin lượng nước:
- **Số lượng**: Lượng nước uống (ml)
- **Thời gian**: Ngày và giờ uống nước
- **Loại nước**: Nước lọc, nước trái cây, trà, cà phê
- **Ghi chú**: Ghi chú về loại nước hoặc hoạt động
- **Mục tiêu**: Mục tiêu nước hàng ngày dựa trên cân nặng và hoạt động

## Tính toán mục tiêu nước:
- **Công thức cơ bản**: 30ml/kg cân nặng
- **Điều chỉnh theo hoạt động**: +500ml cho mỗi giờ tập luyện
- **Điều chỉnh theo khí hậu**: +200-500ml trong thời tiết nóng
- **Điều chỉnh theo chế độ ăn**: +300ml cho chế độ ăn nhiều protein 