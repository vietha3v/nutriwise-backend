# 🍽️ 4. Quản lý bữa ăn (Meal Management)

## Chức năng:
- **Tạo bữa ăn**: Ghi lại bữa ăn với thông tin dinh dưỡng
- **Thêm thực phẩm**: Thêm thực phẩm vào bữa ăn
- **Tính toán dinh dưỡng**: Tự động tính toán calo, protein, carb, fat
- **Quét mã vạch**: Hỗ trợ quét mã vạch thực phẩm
- **Lịch sử bữa ăn**: Xem lịch sử bữa ăn theo ngày

## Thông tin bữa ăn:
- Loại bữa ăn: BREAKFAST, LUNCH, DINNER, SNACK
- Thời gian: ngày, giờ
- Thực phẩm: tên, số lượng, dinh dưỡng
- Tổng dinh dưỡng: calo, protein, carb, fat, fiber, sugar, sodium

## API Endpoints:
- `POST /meals` - Tạo bữa ăn mới
- `GET /meals` - Lấy danh sách bữa ăn
- `GET /meals/:id` - Xem chi tiết bữa ăn
- `PATCH /meals/:id` - Cập nhật bữa ăn
- `DELETE /meals/:id` - Xóa bữa ăn
- `POST /meals/:id/foods` - Thêm thực phẩm vào bữa ăn
- `DELETE /meals/:id/foods/:foodId` - Xóa thực phẩm khỏi bữa ăn

## Cấu trúc thư mục:
```
src/meal/
├── meal.controller.ts
├── meal.module.ts
├── meal.service.ts
├── dto/
│   └── create-meal.dto.ts
└── entities/
    ├── meal.entity.ts
    └── meal-food.entity.ts
```

## Thông tin thực phẩm:
- **Tên thực phẩm**: Tên tiếng Việt và tiếng Anh
- **Thông tin dinh dưỡng**: Calo, protein, carb, fat, fiber, sugar, sodium
- **Đơn vị đo**: Gram, ml, piece, serving
- **Mã vạch**: Barcode để quét nhanh
- **Danh mục**: Thịt, cá, rau, trái cây, ngũ cốc, sữa, etc.
- **Dị ứng**: Thông tin về các chất gây dị ứng
- **Chế biến**: Raw, cooked, fried, grilled, steamed 