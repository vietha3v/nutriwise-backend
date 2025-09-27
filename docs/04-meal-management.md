# Module Meal Management

## **Tổng quan:**
Module Meal quản lý các bữa ăn của người dùng, bao gồm:
- Tạo bữa ăn với danh sách thực phẩm và khối lượng
- Tự động tính toán dinh dưỡng dựa trên thực phẩm được chọn
- Hỗ trợ nhiều đơn vị đo linh hoạt từ module Food
- Tìm kiếm bữa ăn theo thời gian
- Thống kê dinh dưỡng theo ngày/tuần/tháng

## **Cấu trúc Database:**

### **1. Bảng `meals`:**
- `id` (Primary Key)
- `userId` (Foreign Key -> users.id)
- `type` - Loại bữa ăn (Breakfast, Lunch, Dinner, Snack)
- `date` - Ngày ăn
- `time` - Thời gian ăn
- `notes` - Ghi chú
- `totalCalories` - Tổng calo (tự động tính)
- `totalProtein` - Tổng protein (tự động tính)
- `totalCarbs` - Tổng carbs (tự động tính)
- `totalFat` - Tổng chất béo (tự động tính)
- `totalFiber` - Tổng chất xơ (tự động tính)
- `totalSugar` - Tổng đường (tự động tính)
- `totalSodium` - Tổng natri (tự động tính)
- `isDeleted` - Trạng thái xóa
- `createdAt` - Thời gian tạo
- `updatedAt` - Thời gian cập nhật

### **2. Bảng `meal_foods`:**
- `id` (Primary Key)
- `mealId` (Foreign Key -> meals.id)
- `foodId` (Foreign Key -> foods.id)
- `quantity` - Số lượng thực phẩm
- `unit` - Đơn vị đo (g, ml, pieces, etc.)
- `calories` - Calo của thực phẩm này (tự động tính)
- `protein` - Protein của thực phẩm này (tự động tính)
- `carbs` - Carbs của thực phẩm này (tự động tính)
- `fat` - Chất béo của thực phẩm này (tự động tính)
- `fiber` - Chất xơ của thực phẩm này (tự động tính)
- `sugar` - Đường của thực phẩm này (tự động tính)
- `sodium` - Natri của thực phẩm này (tự động tính)

## **Tích hợp với Module Food:**

### **1. Multiple Serving Sizes:**
Module Meal tự động sử dụng thông tin serving sizes từ module Food:

```json
// Thông tin từ Food
{
  "servingSizes": [
    { "size": 100, "unit": "g", "description": "100g" },
    { "size": 1, "unit": "piece", "description": "1 quả" },
    { "size": 1, "unit": "kg", "description": "1kg" }
  ],
  "servingSize": 100,
  "servingUnit": "g"
}

// Khi tạo Meal
{
  "mealFoods": [
    {
      "foodId": 1,
      "quantity": 2,
      "unit": "piece"  // Sử dụng đơn vị từ servingSizes
    },
    {
      "foodId": 2,
      "quantity": 150,
      "unit": "g"      // Sử dụng đơn vị từ servingSizes
    }
  ]
}
```

### **2. Cách tính toán dinh dưỡng:**
1. **Tìm đơn vị trong servingSizes**: Nếu đơn vị có trong `servingSizes` của Food, tính ratio dựa trên đó
2. **Chuyển đổi đơn vị**: Nếu không tìm thấy, tự động chuyển đổi về đơn vị chuẩn
3. **Tính toán**: Nhân dinh dưỡng của Food với ratio để có dinh dưỡng thực tế

## **API Endpoints:**

### **Quản lý bữa ăn:**
- `POST /meals` - Tạo bữa ăn mới với danh sách thực phẩm
- `GET /meals` - Lấy danh sách bữa ăn
- `GET /meals/:id` - Lấy bữa ăn theo ID
- `PATCH /meals/:id` - Cập nhật bữa ăn
- `DELETE /meals/:id` - Xóa bữa ăn

### **Tìm kiếm bữa ăn theo thời gian:**
- `GET /meals/by-date/:date` - Lấy bữa ăn theo ngày
- `GET /meals/by-date-range?startDate=...&endDate=...` - Lấy bữa ăn theo khoảng thời gian

### **Thống kê dinh dưỡng:**
- `GET /meals/stats/daily/:date` - Thống kê dinh dưỡng theo ngày
- `GET /meals/stats/weekly?startDate=...` - Thống kê dinh dưỡng theo tuần
- `GET /meals/stats/monthly?year=...&month=...` - Thống kê dinh dưỡng theo tháng

## **Cách tạo bữa ăn:**

### **Request Body cho POST /meals:**
```json
{
  "type": "Breakfast",
  "date": "2024-01-15",
  "time": "08:30",
  "notes": "Bữa sáng lành mạnh",
  "mealFoods": [
    {
      "foodId": 1,
      "quantity": 2,
      "unit": "piece"
    },
    {
      "foodId": 2,
      "quantity": 100,
      "unit": "g"
    },
    {
      "foodId": 3,
      "quantity": 250,
      "unit": "ml"
    }
  ]
}
```

### **Response:**
```json
{
  "id": 1,
  "type": "Breakfast",
  "date": "2024-01-15T00:00:00.000Z",
  "time": "08:30",
  "notes": "Bữa sáng lành mạnh",
  "totalCalories": 450,
  "totalProtein": 25,
  "totalCarbs": 60,
  "totalFat": 15,
  "totalFiber": 8,
  "totalSugar": 12,
  "totalSodium": 300,
  "mealFoods": [
    {
      "id": 1,
      "foodId": 1,
      "quantity": 2,
      "unit": "piece",
      "calories": 200,
      "protein": 10,
      "carbs": 30,
      "fat": 5
    }
  ]
}
```

## **Tính năng chính:**

### **1. Tạo bữa ăn với thực phẩm:**
- Chọn loại bữa ăn (sáng, trưa, chiều, snack)
- Thêm danh sách thực phẩm với khối lượng cụ thể
- Hỗ trợ nhiều đơn vị đo từ module Food
- Tự động tính toán dinh dưỡng dựa trên thực phẩm và khối lượng
- Lưu trữ thông tin chi tiết về từng thực phẩm trong bữa ăn

### **2. Tự động tính toán dinh dưỡng:**
- Tính tổng calo, protein, carbs, fat, fiber, sugar, sodium
- Dựa trên thông tin dinh dưỡng của từng thực phẩm
- Sử dụng serving sizes từ module Food
- Tự động chuyển đổi đơn vị khi cần thiết
- Cập nhật tự động khi thay đổi thực phẩm hoặc khối lượng

### **3. Hỗ trợ đơn vị đo linh hoạt:**
- **Khối lượng**: kg, g, mg
- **Thể tích**: l, ml
- **Đơn vị đếm**: piece, slice, quả, cái, miếng
- **Tự động chuyển đổi**: Hệ thống tự động chuyển đổi giữa các đơn vị

### **4. Tìm kiếm và lọc:**
- Tìm kiếm bữa ăn theo ngày cụ thể
- Tìm kiếm bữa ăn theo khoảng thời gian
- Sắp xếp theo thời gian

### **5. Thống kê dinh dưỡng:**
- **Thống kê ngày**: Tổng calo, protein, carbs, fat và danh sách bữa ăn
- **Thống kê tuần**: Tổng dinh dưỡng, trung bình calo/ngày, thống kê từng ngày
- **Thống kê tháng**: Tổng dinh dưỡng, trung bình calo/ngày, số bữa ăn/ngày, số ngày có bữa ăn

### **6. Tích hợp với module Food:**
- Sử dụng dữ liệu thực phẩm từ module Food
- Tự động tính toán dinh dưỡng dựa trên thực phẩm và khối lượng
- Hỗ trợ multiple serving sizes từ Food
- Đảm bảo tính nhất quán của dữ liệu dinh dưỡng

## **Cấu trúc thư mục:**
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

## **Lưu ý:**
- **Khi tạo bữa ăn**: Phải cung cấp danh sách thực phẩm và khối lượng
- **Dinh dưỡng tự động**: Được tính dựa trên thực phẩm và khối lượng, không cần nhập thủ công
- **Thực phẩm**: Phải tồn tại trong module Food trước khi thêm vào bữa ăn
- **Khối lượng**: Hỗ trợ nhiều đơn vị đo từ servingSizes của Food
- **Tự động chuyển đổi**: Hệ thống tự động chuyển đổi đơn vị khi cần thiết
- **Phần gợi ý thực đơn**: Được xử lý bởi module AI riêng biệt
- **Phần quản lý dị ứng và sở thích**: Được xử lý trong module Food 