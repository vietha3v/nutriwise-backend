# Module Food Management

## **Tổng quan:**
Module Food quản lý thông tin thực phẩm, bao gồm:
- Thông tin dinh dưỡng chi tiết
- Hỗ trợ nhiều đơn vị đo linh hoạt
- Tìm kiếm thông minh với AI
- Quản lý sở thích và thực phẩm có sẵn
- Quét mã vạch

## **Cấu trúc Database:**

### **Bảng `foods`:**
- `id` (Primary Key)
- `name` - Tên thực phẩm
- `nameEn` - Tên tiếng Anh
- `categories` - Danh mục thực phẩm (array)
- `barcode` - Mã vạch (unique)
- `brand` - Thương hiệu
- `servingSizes` - Danh sách các đơn vị đo khác nhau (JSONB)
- `servingSize` - Kích thước khẩu phần chuẩn
- `servingUnit` - Đơn vị khẩu phần chuẩn
- `calories` - Calo
- `protein` - Protein (g)
- `carbs` - Carbohydrates (g)
- `fat` - Chất béo (g)
- `fiber` - Chất xơ (g)
- `sugar` - Đường (g)
- `sodium` - Natri (mg)
- `vitaminA` - Vitamin A (mcg)
- `vitaminC` - Vitamin C (mg)
- `vitaminD` - Vitamin D (mcg)
- `vitaminE` - Vitamin E (mg)
- `vitaminK` - Vitamin K (mcg)
- `vitaminB1` - Vitamin B1 (mg)
- `vitaminB2` - Vitamin B2 (mg)
- `vitaminB3` - Vitamin B3 (mg)
- `vitaminB6` - Vitamin B6 (mg)
- `vitaminB12` - Vitamin B12 (mcg)
- `folate` - Folate (mcg)
- `calcium` - Canxi (mg)
- `iron` - Sắt (mg)
- `magnesium` - Magie (mg)
- `phosphorus` - Photpho (mg)
- `potassium` - Kali (mg)
- `zinc` - Kẽm (mg)
- `copper` - Đồng (mg)
- `manganese` - Mangan (mg)
- `selenium` - Selen (mcg)
- `allergens` - Danh sách chất gây dị ứng (array)
- `cookingMethods` - Phương pháp nấu ăn (array)
- `description` - Mô tả
- `imageUrl` - URL hình ảnh
- `keywords` - Từ khóa tìm kiếm (array)
- `isVerified` - Đã xác minh
- `isDeleted` - Trạng thái xóa
- `createdAt` - Thời gian tạo
- `updatedAt` - Thời gian cập nhật

### **Bảng `user_food_preferences`:**
- `id` (Primary Key)
- `userId` (Foreign Key -> users.id)
- `foodId` (Foreign Key -> foods.id)
- `type` - Loại sở thích (Liked, Disliked, Available)
- `notes` - Ghi chú
- `isActive` - Trạng thái hoạt động
- `createdAt` - Thời gian tạo
- `updatedAt` - Thời gian cập nhật

### **Bảng `available_foods` (Tủ lạnh cá nhân):**
- `id` (Primary Key)
- `userId` (Foreign Key -> users.id) - Mỗi user có 1 tủ lạnh riêng
- `foodId` (Foreign Key -> foods.id)
- `quantity` - Số lượng có sẵn
- `unit` - Đơn vị đo
- `notes` - Ghi chú
- `createdAt` - Thời gian tạo
- `updatedAt` - Thời gian cập nhật

## **Hỗ trợ đơn vị đo linh hoạt:**

### **1. Multiple Serving Sizes:**
Mỗi thực phẩm có thể có nhiều đơn vị đo khác nhau:

```json
{
  "servingSizes": [
    { "size": 100, "unit": "g", "description": "100g" },
    { "size": 1, "unit": "kg", "description": "1kg" },
    { "size": 1, "unit": "piece", "description": "1 quả" },
    { "size": 1, "unit": "slice", "description": "1 miếng" },
    { "size": 250, "unit": "ml", "description": "1 ly" }
  ],
  "servingSize": 100,
  "servingUnit": "g"
}
```

### **2. Các loại đơn vị đo được hỗ trợ:**

#### **Khối lượng:**
- `kg` - Kilogram
- `g` - Gram
- `mg` - Milligram

#### **Thể tích:**
- `l` - Liter
- `ml` - Milliliter

#### **Đơn vị đếm:**
- `piece` - Cái, quả, miếng
- `slice` - Miếng, lát
- `quả` - Quả (tiếng Việt)
- `cái` - Cái (tiếng Việt)
- `miếng` - Miếng (tiếng Việt)

### **3. Cách tính toán dinh dưỡng:**
- **Nếu đơn vị có trong servingSizes**: Tính ratio dựa trên serving size tương ứng
- **Nếu đơn vị không có**: Chuyển đổi về đơn vị chuẩn và tính ratio

## **API Endpoints:**

### **Quản lý thực phẩm:**
- `POST /foods` - Tạo thực phẩm mới (Admin only)
- `GET /foods` - Lấy danh sách thực phẩm
- `GET /foods/:id` - Lấy thực phẩm theo ID
- `PATCH /foods/:id` - Cập nhật thực phẩm (Admin only)
- `DELETE /foods/:id` - Xóa thực phẩm (Admin only)

### **Tìm kiếm thực phẩm:**
- `GET /foods/search` - Tìm kiếm thực phẩm với filters
- `GET /foods/category/:category` - Lấy thực phẩm theo danh mục



### **Quản lý sở thích thực phẩm:**
- `POST /foods/preferences` - Tạo sở thích thực phẩm
- `GET /foods/preferences` - Lấy danh sách sở thích của user
- `GET /foods/preferences/foods?type=...` - Lấy thực phẩm theo loại sở thích (favorites/disliked/allergic)
- `GET /foods/preferences/:foodId` - Lấy sở thích cho thực phẩm cụ thể
- `PATCH /foods/preferences/:foodId` - Cập nhật sở thích
- `DELETE /foods/preferences/:foodId` - Xóa sở thích

### **Quản lý tủ lạnh cá nhân:**
- `POST /foods/available` - Thêm thực phẩm vào tủ lạnh
- `GET /foods/available` - Lấy danh sách thực phẩm trong tủ lạnh
- `GET /foods/available/:id` - Lấy chi tiết thực phẩm trong tủ lạnh
- `PATCH /foods/available/:id` - Cập nhật thực phẩm trong tủ lạnh
- `DELETE /foods/available/:id` - Xóa thực phẩm khỏi tủ lạnh

## **Cấu trúc dữ liệu dinh dưỡng:**

### **1. Thành phần cơ bản (Basic Nutrition):**
Các thành phần dinh dưỡng chính được lưu dưới dạng cột riêng:
- `calories` - Calo
- `protein` - Protein (g)
- `carbs` - Carbohydrate (g)
- `fat` - Chất béo (g)
- `fiber` - Chất xơ (g)
- `sugar` - Đường (g)
- `sodium` - Natri (mg)

### **2. Thành phần vi lượng (Micronutrients):**
Các vitamin và khoáng chất được lưu trong object JSON `micronutrients`:
```json
{
  "micronutrients": {
    "vitaminA": 3,        // mcg
    "vitaminC": 4.6,      // mg
    "vitaminD": 0,        // mcg
    "vitaminE": 0.18,     // mg
    "vitaminK": 2.2,      // mcg
    "vitaminB1": 0.017,   // mg
    "vitaminB2": 0.026,   // mg
    "vitaminB3": 0.091,   // mg
    "vitaminB6": 0.041,   // mg
    "vitaminB12": 0,      // mcg
    "folate": 3,          // mcg
    "calcium": 6,         // mg
    "iron": 0.12,         // mg
    "magnesium": 5,       // mg
    "phosphorus": 11,     // mg
    "potassium": 107,     // mg
    "zinc": 0.04,         // mg
    "copper": 0.027,      // mg
    "manganese": 0.035,   // mg
    "selenium": 0         // mcg
  }
}
```

## **Cách tạo thực phẩm:**

### **Request Body cho POST /foods:**
```json
{
  "name": "Táo",
  "nameEn": "Apple",
  "categories": ["Fruits"],
  "servingSizes": [
    { "size": 100, "unit": "g", "description": "100g" },
    { "size": 1, "unit": "piece", "description": "1 quả" },
    { "size": 1, "unit": "kg", "description": "1kg" }
  ],
  "servingSize": 100,
  "servingUnit": "g",
  "calories": 52,
  "protein": 0.3,
  "carbs": 14,
  "fat": 0.2,
  "fiber": 2.4,
  "sugar": 10,
  "sodium": 1,
  "micronutrients": {
    "vitaminA": 3,
    "vitaminC": 4.6,
    "vitaminD": 0,
    "vitaminE": 0.18,
    "vitaminK": 2.2,
    "vitaminB1": 0.017,
    "vitaminB2": 0.026,
    "vitaminB3": 0.091,
    "vitaminB6": 0.041,
    "vitaminB12": 0,
    "folate": 3,
    "calcium": 6,
    "iron": 0.12,
    "magnesium": 5,
    "phosphorus": 11,
    "potassium": 107,
    "zinc": 0.04,
    "copper": 0.027,
    "manganese": 0.035,
    "selenium": 0
  },
  "keywords": ["táo", "apple", "trái cây", "fruit"]
}
```

## **Cách tạo sở thích thực phẩm:**

### **Request Body cho POST /foods/preferences:**
```json
{
  "foodId": 1,
  "type": "Liked",
  "notes": "Táo ngọt, giòn"
}
```

### **Các loại sở thích:**
- `Liked` - Thực phẩm ưa thích
- `Disliked` - Thực phẩm không ưa thích
- `Allergic` - Thực phẩm gây dị ứng

## **Cách thêm thực phẩm vào tủ lạnh:**

### **Request Body cho POST /foods/available:**
```json
{
  "foodId": 1,
  "quantity": 5,
  "unit": "piece",
  "notes": "Táo đỏ, mua hôm qua"
}
```

## **Tính năng chính:**

### **1. Quản lý thực phẩm:**
- Thông tin dinh dưỡng chi tiết (calories, protein, carbs, fat, vitamins, minerals)
- Hỗ trợ nhiều đơn vị đo linh hoạt (servingSizes)
- Phân loại theo danh mục (categories)
- Từ khóa tìm kiếm (keywords)

### **2. Tìm kiếm và phân tích:**
- Tìm kiếm theo tên và từ khóa
- Tìm kiếm theo danh mục
- Tìm kiếm theo mã vạch
- Thống kê thực phẩm phổ biến
- Thực phẩm gần đây của user

### **3. Quản lý sở thích cá nhân:**
- Thực phẩm ưa thích (Liked)
- Thực phẩm không ưa thích (Disliked)
- Thực phẩm gây dị ứng (Allergic)
- Ghi chú cho từng sở thích

### **4. Quản lý tủ lạnh cá nhân:**
- Mỗi user có 1 tủ lạnh riêng (key theo userId)
- Thêm/xóa/cập nhật thực phẩm trong tủ lạnh
- Theo dõi số lượng thực phẩm có sẵn
- Ghi chú cho từng thực phẩm

### **5. Tích hợp với module Meal:**
- Cung cấp dữ liệu dinh dưỡng cho bữa ăn
- Tính toán dinh dưỡng dựa trên khối lượng
- Hỗ trợ nhiều đơn vị đo linh hoạt
- Tự động chuyển đổi đơn vị

## **Lưu ý:**
- **Serving size chuẩn**: Là đơn vị đo cơ bản để tính toán dinh dưỡng
- **Multiple serving sizes**: Cho phép người dùng chọn đơn vị đo phù hợp
- **Tự động chuyển đổi**: Hệ thống tự động chuyển đổi đơn vị khi cần thiết
- **Quyền Admin**: Chỉ admin mới có thể tạo/sửa/xóa thực phẩm
- **Sở thích cá nhân**: Mỗi user có thể có sở thích khác nhau cho cùng một thực phẩm
- **Tủ lạnh cá nhân**: Mỗi user có 1 tủ lạnh riêng để lưu thực phẩm có sẵn
- **Barcode scanning**: Hỗ trợ quét mã vạch để tìm kiếm nhanh
- **Tích hợp Meal**: Cung cấp dữ liệu dinh dưỡng cho module Meal
