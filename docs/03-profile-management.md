# 📊 3. Hồ sơ cá nhân (Profile Management)

## Chức năng:
- **Tạo hồ sơ**: Thêm thông tin cá nhân và sức khỏe
- **Tạo profile mới**: Tạo profile mới tại thời điểm hiện tại
- **Cập nhật hồ sơ**: Chỉnh sửa thông tin cá nhân và chỉ số Inbody
- **Tính toán BMR/TDEE**: Tự động tính toán chỉ số chuyển hóa
- **Mục tiêu dinh dưỡng**: Thiết lập mục tiêu calo, protein, carb, fat
- **Theo dõi chỉ số Inbody**: Lưu trữ và theo dõi các chỉ số từ cân Inbody
- **Quản lý profile theo thời gian**: Mỗi profile đại diện cho một thời điểm
- **So sánh profile**: So sánh 2 profile tại các thời điểm khác nhau
- **Phân tích xu hướng**: Phân tích thay đổi các chỉ số theo thời gian
- **Biểu đồ tiến độ**: Hiển thị biểu đồ thay đổi các chỉ số
- **Đánh giá sức khỏe**: Đánh giá tình trạng sức khỏe dựa trên các chỉ số
- **Tư vấn dinh dưỡng**: Đưa ra khuyến nghị dựa trên chỉ số cơ thể

## Thông tin hồ sơ:
- **Thông tin cá nhân**: tên, tuổi, giới tính, chiều cao, cân nặng
- **Mức độ hoạt động**: SEDENTARY, LIGHTLY_ACTIVE, MODERATELY_ACTIVE, VERY_ACTIVE, EXTREMELY_ACTIVE
- **Mục tiêu**: LOSE_WEIGHT, MAINTAIN_WEIGHT, GAIN_WEIGHT, BUILD_MUSCLE, IMPROVE_HEALTH
- **Thông tin y tế**: dị ứng, hạn chế ăn uống, tình trạng sức khỏe
- **Chỉ số dinh dưỡng**: BMR, TDEE, mục tiêu calo, protein, carb, fat, nước

## Chỉ số sức khỏe từ cân Inbody:
- **Cân nặng (Weight)**: Tổng trọng lượng cơ thể (kg)
- **Chỉ số nước (Total Body Water - TBW)**: 
  - Tổng lượng nước trong cơ thể (L)
  - Nước nội bào (Intracellular Water - ICW): Nước trong tế bào
  - Nước ngoại bào (Extracellular Water - ECW): Nước ngoài tế bào
  - Tỷ lệ ICW/ECW: Chỉ số cân bằng nước trong cơ thể
- **Lượng mỡ dưới da (Subcutaneous Fat)**:
  - Tổng lượng mỡ dưới da (kg)
  - Tỷ lệ mỡ dưới da (%)
  - Phân bố mỡ dưới da theo vùng cơ thể
- **Lượng mỡ nội tạng (Visceral Fat)**:
  - Lượng mỡ nội tạng (kg)
  - Chỉ số mỡ nội tạng (Visceral Fat Level): 1-30
  - Diện tích mỡ nội tạng (cm²)
- **Chỉ số cơ bắp (Skeletal Muscle Mass)**:
  - Khối lượng cơ xương (kg)
  - Tỷ lệ cơ bắp (%)
  - Chỉ số cơ bắp (SMM): So sánh với chuẩn theo tuổi/giới tính
- **Chỉ số khối cơ thể (Body Mass Index - BMI)**:
  - BMI hiện tại
  - Phân loại BMI: Underweight, Normal, Overweight, Obese
- **Chỉ số khối không mỡ (Fat-Free Mass Index - FFMI)**:
  - FFMI hiện tại
  - So sánh với chuẩn theo tuổi/giới tính
- **Tỷ lệ cơ thể (Body Composition)**:
  - Tỷ lệ mỡ cơ thể (%)
  - Tỷ lệ cơ bắp (%)
  - Tỷ lệ xương (%)
- **Chỉ số trao đổi chất (Basal Metabolic Rate - BMR)**:
  - BMR hiện tại (kcal/ngày)
  - BMR dự đoán theo tuổi/giới tính/cân nặng
- **Tổng năng lượng tiêu thụ (Total Daily Energy Expenditure - TDEE)**:
  - TDEE dựa trên mức độ hoạt động
  - Mục tiêu calo theo mục tiêu dinh dưỡng

## Quản lý profile theo thời gian:
- **Profile theo thời điểm**: Mỗi profile đại diện cho một thời điểm cụ thể
- **Tạo profile mới**: Khi có chỉ số mới, tạo profile mới thay vì cập nhật
- **So sánh profile**: So sánh 2 profile tại các thời điểm khác nhau
- **Phân tích xu hướng**: Phân tích thay đổi qua các profile theo thời gian
- **Biểu đồ tiến độ**: Hiển thị biểu đồ thay đổi các chỉ số qua các profile
- **Báo cáo tiến độ**: Tạo báo cáo tổng hợp về sự thay đổi
- **Profile mới nhất**: Luôn có profile mới nhất để tham chiếu

## Hệ thống hình mẫu lý tưởng:
- **Phân loại nhóm tuổi**: 
  - Nhóm trẻ (15-25): Tập trung phát triển chiều cao, vóc dáng
  - Nhóm trưởng thành (26-40): Tối ưu hóa cơ thể, sức khỏe
  - Nhóm trung niên (41-60): Duy trì sức khỏe, ngăn ngừa lão hóa
  - Nhóm cao tuổi (60+): Tập trung sức khỏe, linh hoạt
- **Chỉ số lý tưởng theo giới tính**:
  - **Nam giới**: Tỷ lệ mỡ 10-20%, cơ bắp 40-50%, BMI 18.5-25
  - **Nữ giới**: Tỷ lệ mỡ 18-28%, cơ bắp 30-40%, BMI 18.5-24
- **Mức độ mục tiêu**:
  - **Hoàn hảo**: Chỉ số tối ưu cho sức khỏe và thẩm mỹ
  - **Tốt**: Chỉ số khỏe mạnh, có thể cải thiện thêm
  - **Trung bình**: Chỉ số bình thường, cần cải thiện
  - **Cần cải thiện**: Chỉ số dưới chuẩn, cần thay đổi
- **Gợi ý mục tiêu cụ thể**:
  - Tăng/giảm cân nặng bao nhiêu kg
  - Cải thiện tỷ lệ mỡ/cơ bắp
  - Tăng chiều cao (cho nhóm trẻ)
  - Cải thiện chỉ số nước, mỡ nội tạng

## API Endpoints:
- `POST /profiles` - Tạo hồ sơ mới
- `GET /profiles` - Lấy danh sách hồ sơ của user
- `GET /profiles/:id` - Xem chi tiết hồ sơ
- `PATCH /profiles/:id` - Cập nhật hồ sơ (bao gồm chỉ số Inbody)
- `DELETE /profiles/:id` - Xóa hồ sơ

## API Endpoints cho so sánh và phân tích:
- `GET /profiles/compare/:profile1Id/:profile2Id` - So sánh 2 profile
- `GET /profiles/trends` - Phân tích xu hướng thay đổi qua các profile
- `GET /profiles/charts` - Dữ liệu cho biểu đồ tiến độ
- `GET /profiles/latest` - Lấy profile mới nhất
- `GET /profiles/history` - Lấy tất cả profile theo thời gian

## Hướng dẫn sử dụng module Profile

### 1. Mục đích
Module Profile giúp người dùng lưu trữ, cập nhật, theo dõi và so sánh các chỉ số sức khỏe của bản thân theo từng thời điểm. Qua đó, người dùng có thể đặt mục tiêu, theo dõi tiến độ cải thiện và nhận tư vấn cá nhân hóa.

### 2. Các bước thao tác điển hình
- **Tạo profile mới**: Khi có chỉ số mới (sau khi đo Inbody hoặc cập nhật thông tin), người dùng tạo một profile mới để lưu lại trạng thái sức khỏe tại thời điểm đó.
- **Cập nhật profile**: Nếu cần chỉnh sửa thông tin cá nhân hoặc bổ sung chỉ số, có thể cập nhật profile hiện tại.
- **Xem danh sách profile**: Lấy toàn bộ lịch sử profile để xem lại quá trình thay đổi.
- **So sánh profile**: Chọn 2 profile bất kỳ để so sánh sự thay đổi các chỉ số sức khỏe.
- **Phân tích xu hướng**: Xem biểu đồ, báo cáo tiến độ cải thiện qua các profile.

### 3. Ví dụ gọi API
- **Tạo profile mới**:
  - `POST /profiles`
  - Body mẫu:
    ```json
    {
      "userId": 1,
      "height": 170,
      "weight": 65,
      "age": 25,
      "gender": "male",
      "bodyFat": 18.5,
      "muscleMass": 32.0,
      "water": 60.0,
      "visceralFat": 7,
      "bmr": 1600,
      "tdee": 2200,
      "note": "Đo sau kỳ nghỉ Tết"
    }
    ```
- **Lấy danh sách profile**:
  - `GET /profiles`
- **Xem chi tiết profile**:
  - `GET /profiles/:id`
- **So sánh 2 profile**:
  - `GET /profiles/compare/:profile1Id/:profile2Id`
- **Xem lịch sử profile**:
  - `GET /profiles/history`

### 4. Gợi ý workflow thực tế
1. Người dùng đo chỉ số cơ thể định kỳ (ví dụ mỗi tháng 1 lần).
2. Sau mỗi lần đo, tạo profile mới để lưu lại trạng thái sức khỏe.
3. Định kỳ so sánh profile hiện tại với các mốc trước đó để đánh giá tiến độ.
4. Sử dụng chức năng phân tích xu hướng để xem biểu đồ thay đổi các chỉ số (cân nặng, mỡ, cơ, nước...).
5. Đặt mục tiêu mới dựa trên kết quả so sánh và nhận tư vấn từ AI nếu cần.

## Cấu trúc thư mục:
```
src/profile/
├── profile.controller.ts
├── profile.module.ts
├── profile.service.ts
├── dto/
│   ├── create-profile.dto.ts
│   └── update-profile.dto.ts
└── entities/
    └── profile.entity.ts
``` 