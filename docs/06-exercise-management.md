# 💪 6. Quản lý tập luyện (Exercise Management)

## Chức năng:
- **Ghi lại tập luyện**: Ghi lại các buổi tập luyện
- **Loại tập luyện**: CARDIO, STRENGTH, FLEXIBILITY, SPORTS, YOGA, PILATES
- **Thống kê tập luyện**: Xem thống kê tập luyện theo thời gian
- **Calo đốt cháy**: Tính toán calo đốt cháy
- **Nhịp tim**: Theo dõi nhịp tim trong tập luyện

## Thông tin tập luyện:
- Tên bài tập
- Loại tập luyện
- Thời gian: ngày, giờ, thời lượng
- Calo đốt cháy
- Khoảng cách (cho cardio)
- Nhịp tim trung bình, tối đa
- Mô tả, ghi chú

## API Endpoints:
- `POST /exercises` - Tạo bài tập mới
- `GET /exercises` - Lấy danh sách bài tập
- `GET /exercises/:id` - Xem chi tiết bài tập
- `PATCH /exercises/:id` - Cập nhật bài tập
- `DELETE /exercises/:id` - Xóa bài tập
- `GET /exercises/stats` - Thống kê tập luyện

## Cấu trúc thư mục:
```
src/exercise/
├── exercise.controller.ts
├── exercise.module.ts
├── exercise.service.ts
├── dto/
│   └── create-exercise.dto.ts
└── entities/
    └── exercise.entity.ts
```

## Loại tập luyện:
- **CARDIO**: Chạy, đi bộ, đạp xe, bơi lội, nhảy dây
- **STRENGTH**: Tập tạ, bodyweight, resistance training
- **FLEXIBILITY**: Stretching, yoga, pilates
- **SPORTS**: Bóng đá, bóng rổ, tennis, cầu lông
- **YOGA**: Hatha, Vinyasa, Ashtanga, Yin
- **PILATES**: Mat pilates, reformer pilates

## Tính toán calo đốt cháy:
- **Công thức cơ bản**: MET × Cân nặng (kg) × Thời gian (giờ)
- **MET (Metabolic Equivalent)**: 
  - Chạy: 8-12 MET
  - Đi bộ: 3-5 MET
  - Đạp xe: 4-8 MET
  - Tập tạ: 3-6 MET
  - Yoga: 2-4 MET
- **Điều chỉnh theo cường độ**: Nhịp tim, tốc độ, khối lượng tạ 