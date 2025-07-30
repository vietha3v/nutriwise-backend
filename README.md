# NutriWise Backend

## Giới thiệu

NutriWise Backend là hệ thống backend cho ứng dụng quản lý dinh dưỡng và sức khỏe NutriWise, được xây dựng bằng NestJS. Hệ thống cung cấp các API để quản lý thông tin người dùng, theo dõi bữa ăn, lượng nước uống, tập luyện và mục tiêu dinh dưỡng.

## Công nghệ sử dụng

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL với TypeORM
- **Authentication**: JWT với Passport
- **Documentation**: Swagger/OpenAPI
- **Email**: Nodemailer
- **Validation**: Class-validator, Class-transformer
- **Security**: bcrypt cho mã hóa mật khẩu

## Cấu trúc dự án

```
src/
├── auth/                 # Xác thực và phân quyền
├── user/                # Quản lý người dùng
├── profile/             # Hồ sơ cá nhân và thông tin sức khỏe
├── meal/                # Quản lý bữa ăn và dinh dưỡng
├── water/               # Theo dõi lượng nước uống
├── exercise/            # Quản lý tập luyện
├── nutrition-goal/      # Mục tiêu dinh dưỡng
├── dashboard/           # Dashboard và thống kê
├── ai/                  # AI Personal Trainer & Nutritionist
├── email/               # Gửi email
├── trainer-relationship/ # Quản lý mối quan hệ Huấn luyện viên - Người dùng
├── wallet/              # Hệ thống ví điện tử và thanh toán
└── common/              # Các thành phần chung
```

## 📋 Mục lục

### 🔐 Xác thực & Phân quyền
- [1. Quản lý xác thực và phân quyền](#1-quản-lý-xác-thực-và-phân-quyền-authentication--authorization)

### 👥 Quản lý người dùng
- [2. Quản lý người dùng](#2-quản-lý-người-dùng-user-management)

### 📊 Hồ sơ & Sức khỏe
- [3. Hồ sơ cá nhân](#3-hồ-sơ-cá-nhân-profile-management)

### 🍽️ Dinh dưỡng & Bữa ăn
- [4. Quản lý bữa ăn](#4-quản-lý-bữa-ăn-meal-management)
- [5. Theo dõi lượng nước](#5-theo-dõi-lượng-nước-water-tracking)
- [7. Mục tiêu dinh dưỡng](#7-mục-tiêu-dinh-dưỡng-nutrition-goals)

### 💪 Tập luyện & Sức khỏe
- [6. Quản lý tập luyện](#6-quản-lý-tập-luyện-exercise-management)

### 📈 Dashboard & Thống kê
- [8. Dashboard và thống kê](#8-dashboard-và-thống-kê)

### 🤖 AI & Tư vấn
- [9. AI Personal Trainer & Nutritionist](#9-ai-personal-trainer--nutritionist)

### 📧 Thông báo
- [10. Gửi email](#10-gửi-email)

### 👨‍💼 Huấn luyện viên & Marketplace
- [11. Quản lý mối quan hệ Huấn luyện viên - Người dùng](#11-quản-lý-mối-quan-hệ-huấn-luyện-viên---người-dùng-trainer-user-relationship)

### 💰 Thanh toán & Ví điện tử
- [12. Hệ thống ví điện tử và thanh toán](#12-hệ-thống-ví-điện-tử-và-thanh-toán-wallet--payment-system)

---

## Các chức năng chính

<details>
<summary>🔐 1. Quản lý xác thực và phân quyền (Authentication & Authorization)</summary>

#### Chức năng:
- **Đăng ký tài khoản**: Tạo tài khoản mới cho người dùng
- **Đăng nhập**: Xác thực người dùng và tạo JWT token
- **Đăng xuất**: Hủy token và đăng xuất
- **Quên mật khẩu**: Gửi email reset mật khẩu
- **Đặt lại mật khẩu**: Cập nhật mật khẩu mới
- **Refresh token**: Làm mới access token
- **Phân quyền**: Hệ thống role-based access control

#### API Endpoints:
- `POST /auth/register` - Đăng ký tài khoản
- `POST /auth/login` - Đăng nhập
- `POST /auth/logout` - Đăng xuất
- `POST /auth/forgot-password` - Quên mật khẩu
- `POST /auth/reset-password` - Đặt lại mật khẩu
- `POST /auth/refresh` - Làm mới token
- `GET /auth/profile` - Lấy thông tin profile

#### Phân quyền:
- **SystemAdmin**: Quyền cao nhất, có thể truy cập tất cả
- **Nutritionist**: Chuyên gia dinh dưỡng
- **Trainer**: Huấn luyện viên
- **User**: Người dùng thông thường

</details>

<details>
<summary>👥 2. Quản lý người dùng (User Management)</summary>

#### Chức năng:
- **Tạo người dùng**: Thêm người dùng mới vào hệ thống
- **Cập nhật thông tin**: Chỉnh sửa thông tin người dùng
- **Xem danh sách**: Quản lý danh sách người dùng
- **Xem chi tiết**: Xem thông tin chi tiết người dùng
- **Xóa người dùng**: Xóa mềm người dùng

#### API Endpoints:
- `POST /users` - Tạo người dùng mới (Admin only)
- `GET /users` - Lấy danh sách người dùng (Admin only)
- `GET /users/:id` - Xem chi tiết người dùng
- `PATCH /users/:id` - Cập nhật người dùng
- `DELETE /users/:id` - Xóa người dùng (Admin only)

</details>

<details>
<summary>📊 3. Hồ sơ cá nhân (Profile Management)</summary>

### 3. Hồ sơ cá nhân (Profile Management)

#### Chức năng:
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

#### Thông tin hồ sơ:
- **Thông tin cá nhân**: tên, tuổi, giới tính, chiều cao, cân nặng
- **Mức độ hoạt động**: SEDENTARY, LIGHTLY_ACTIVE, MODERATELY_ACTIVE, VERY_ACTIVE, EXTREMELY_ACTIVE
- **Mục tiêu**: LOSE_WEIGHT, MAINTAIN_WEIGHT, GAIN_WEIGHT, BUILD_MUSCLE, IMPROVE_HEALTH
- **Thông tin y tế**: dị ứng, hạn chế ăn uống, tình trạng sức khỏe
- **Chỉ số dinh dưỡng**: BMR, TDEE, mục tiêu calo, protein, carb, fat, nước

#### Chỉ số sức khỏe từ cân Inbody:
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

#### Quản lý profile theo thời gian:
- **Profile theo thời điểm**: Mỗi profile đại diện cho một thời điểm cụ thể
- **Tạo profile mới**: Khi có chỉ số mới, tạo profile mới thay vì cập nhật
- **So sánh profile**: So sánh 2 profile tại các thời điểm khác nhau
- **Phân tích xu hướng**: Phân tích thay đổi qua các profile theo thời gian
- **Biểu đồ tiến độ**: Hiển thị biểu đồ thay đổi các chỉ số qua các profile
- **Báo cáo tiến độ**: Tạo báo cáo tổng hợp về sự thay đổi
- **Profile mới nhất**: Luôn có profile mới nhất để tham chiếu

#### Hệ thống hình mẫu lý tưởng:
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

#### API Endpoints:
- `POST /profiles` - Tạo hồ sơ mới
- `GET /profiles` - Lấy danh sách hồ sơ của user
- `GET /profiles/:id` - Xem chi tiết hồ sơ
- `PATCH /profiles/:id` - Cập nhật hồ sơ (bao gồm chỉ số Inbody)
- `DELETE /profiles/:id` - Xóa hồ sơ

#### API Endpoints cho so sánh và phân tích:
- `GET /profiles/compare/:profile1Id/:profile2Id` - So sánh 2 profile
- `GET /profiles/trends` - Phân tích xu hướng thay đổi qua các profile
- `GET /profiles/charts` - Dữ liệu cho biểu đồ tiến độ
- `GET /profiles/latest` - Lấy profile mới nhất
- `GET /profiles/history` - Lấy tất cả profile theo thời gian

### Hướng dẫn sử dụng module Profile

#
</details>
### 1. Mục đích
Module Profile giúp người dùng lưu trữ, cập nhật, theo dõi và so sánh các chỉ số sức khỏe của bản thân theo từng thời điểm. Qua đó, người dùng có thể đặt mục tiêu, theo dõi tiến độ cải thiện và nhận tư vấn cá nhân hóa.

#### 2. Các bước thao tác điển hình
- **Tạo profile mới**: Khi có chỉ số mới (sau khi đo Inbody hoặc cập nhật thông tin), người dùng tạo một profile mới để lưu lại trạng thái sức khỏe tại thời điểm đó.
- **Cập nhật profile**: Nếu cần chỉnh sửa thông tin cá nhân hoặc bổ sung chỉ số, có thể cập nhật profile hiện tại.
- **Xem danh sách profile**: Lấy toàn bộ lịch sử profile để xem lại quá trình thay đổi.
- **So sánh profile**: Chọn 2 profile bất kỳ để so sánh sự thay đổi các chỉ số sức khỏe.
- **Phân tích xu hướng**: Xem biểu đồ, báo cáo tiến độ cải thiện qua các profile.

#### 3. Ví dụ gọi API
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

#### 4. Gợi ý workflow thực tế
1. Người dùng đo chỉ số cơ thể định kỳ (ví dụ mỗi tháng 1 lần).
2. Sau mỗi lần đo, tạo profile mới để lưu lại trạng thái sức khỏe.
3. Định kỳ so sánh profile hiện tại với các mốc trước đó để đánh giá tiến độ.
4. Sử dụng chức năng phân tích xu hướng để xem biểu đồ thay đổi các chỉ số (cân nặng, mỡ, cơ, nước...).
5. Đặt mục tiêu mới dựa trên kết quả so sánh và nhận tư vấn từ AI nếu cần.

<details>
<summary>🍽️ 4. Quản lý bữa ăn (Meal Management)</summary>

### 4. Quản lý bữa ăn (Meal Management)

#### Chức năng:
- **Tạo bữa ăn**: Ghi lại bữa ăn với thông tin dinh dưỡng
- **Thêm thực phẩm**: Thêm thực phẩm vào bữa ăn
- **Tính toán dinh dưỡng**: Tự động tính toán calo, protein, carb, fat
- **Quét mã vạch**: Hỗ trợ quét mã vạch thực phẩm
- **Lịch sử bữa ăn**: Xem lịch sử bữa ăn theo ngày

#### Thông tin bữa ăn:
- Loại bữa ăn: BREAKFAST, LUNCH, DINNER, SNACK
- Thời gian: ngày, giờ
- Thực phẩm: tên, số lượng, dinh dưỡng
- Tổng dinh dưỡng: calo, protein, carb, fat, fiber, sugar, sodium

#### API Endpoints:
- `POST /meals` - Tạo bữa ăn mới
- `GET /meals` - Lấy danh sách bữa ăn
- `GET /meals/:id` - Xem chi tiết bữa ăn
- `PATCH /meals/:id` - Cập nhật bữa ăn
- `DELETE /meals/:id` - Xóa bữa ăn
- `POST /meals/:id/foods` - Thêm thực phẩm vào bữa ăn
- `DELETE /meals/:id/foods/:foodId` - Xóa thực phẩm khỏi bữa ăn


</details>
<details>
<summary>💧 5. Theo dõi lượng nước (Water Tracking)</summary>

### 5. Theo dõi lượng nước (Water Tracking)

#### Chức năng:
- **Ghi lại lượng nước**: Ghi lại lượng nước uống theo thời gian
- **Mục tiêu nước**: Thiết lập và theo dõi mục tiêu nước hàng ngày
- **Thống kê nước**: Xem thống kê lượng nước theo ngày/tuần/tháng
- **Nhắc nhở**: Hệ thống nhắc nhở uống nước

#### API Endpoints:
- `POST /water` - Ghi lại lượng nước uống
- `GET /water` - Lấy danh sách lượng nước
- `GET /water/:id` - Xem chi tiết lượng nước
- `PATCH /water/:id` - Cập nhật lượng nước
- `DELETE /water/:id` - Xóa lượng nước
- `GET /water/stats` - Thống kê lượng nước


</details>
<details>
<summary>💪 6. Quản lý tập luyện (Exercise Management)</summary>

### 6. Quản lý tập luyện (Exercise Management)

#### Chức năng:
- **Ghi lại tập luyện**: Ghi lại các buổi tập luyện
- **Loại tập luyện**: CARDIO, STRENGTH, FLEXIBILITY, SPORTS, YOGA, PILATES
- **Thống kê tập luyện**: Xem thống kê tập luyện theo thời gian
- **Calo đốt cháy**: Tính toán calo đốt cháy
- **Nhịp tim**: Theo dõi nhịp tim trong tập luyện

#### Thông tin tập luyện:
- Tên bài tập
- Loại tập luyện
- Thời gian: ngày, giờ, thời lượng
- Calo đốt cháy
- Khoảng cách (cho cardio)
- Nhịp tim trung bình, tối đa
- Mô tả, ghi chú

#### API Endpoints:
- `POST /exercises` - Tạo bài tập mới
- `GET /exercises` - Lấy danh sách bài tập
- `GET /exercises/:id` - Xem chi tiết bài tập
- `PATCH /exercises/:id` - Cập nhật bài tập
- `DELETE /exercises/:id` - Xóa bài tập
- `GET /exercises/stats` - Thống kê tập luyện


</details>
<details>
<summary>🎯 7. Mục tiêu dinh dưỡng (Nutrition Goals)</summary>

### 7. Mục tiêu dinh dưỡng (Nutrition Goals)

#### Chức năng:
- **Tạo mục tiêu**: Thiết lập mục tiêu dinh dưỡng cá nhân
- **Theo dõi tiến độ**: Theo dõi tiến độ đạt mục tiêu
- **Điều chỉnh mục tiêu**: Cập nhật mục tiêu theo thời gian
- **Phân tích mục tiêu**: Phân tích hiệu quả mục tiêu

#### Thông tin mục tiêu:
- Loại mục tiêu: LOSE_WEIGHT, MAINTAIN_WEIGHT, GAIN_WEIGHT, BUILD_MUSCLE, IMPROVE_HEALTH
- Cân nặng hiện tại và mục tiêu
- Mục tiêu dinh dưỡng: calo, protein, carb, fat, nước
- Thời gian: ngày bắt đầu, ngày mục tiêu
- Trạng thái: active/inactive

#### API Endpoints:
- `POST /nutrition-goals` - Tạo mục tiêu mới
- `GET /nutrition-goals` - Lấy danh sách mục tiêu
- `GET /nutrition-goals/:id` - Xem chi tiết mục tiêu
- `PATCH /nutrition-goals/:id` - Cập nhật mục tiêu
- `DELETE /nutrition-goals/:id` - Xóa mục tiêu
- `GET /nutrition-goals/progress` - Theo dõi tiến độ


</details>
<details>
<summary>📈 8. Dashboard và thống kê</summary>

### 8. Dashboard và thống kê

#### Chức năng:
- **Thống kê tổng quan**: Tổng quan về sức khỏe và dinh dưỡng
- **Biểu đồ dinh dưỡng**: Biểu đồ calo, protein, carb, fat theo thời gian
- **Tiến độ mục tiêu**: Theo dõi tiến độ đạt mục tiêu
- **Báo cáo sức khỏe**: Báo cáo tổng hợp về sức khỏe

#### API Endpoints:
- `GET /dashboard` - Lấy dữ liệu dashboard
- `GET /dashboard/nutrition-stats` - Thống kê dinh dưỡng
- `GET /dashboard/exercise-stats` - Thống kê tập luyện
- `GET /dashboard/water-stats` - Thống kê nước
- `GET /dashboard/goal-progress` - Tiến độ mục tiêu


</details>
<details>
<summary>🤖 9. AI Personal Trainer & Nutritionist</summary>

### 9. AI Personal Trainer & Nutritionist

#### Chức năng chi tiết:

**1. Phân tích profile và mục tiêu:**
- **Phân tích chỉ số hiện tại**: AI phân tích tất cả chỉ số Inbody (cân nặng, mỡ, cơ, nước, BMR, TDEE)
- **Đánh giá tình trạng sức khỏe**: Phân loại tình trạng sức khỏe dựa trên các chỉ số
- **Xác định loại hình cơ thể**: Phân tích và xác định người dùng thuộc nhóm Ectomorph, Mesomorph hay Endomorph
- **Tính toán khoảng cách mục tiêu**: So sánh chỉ số hiện tại với mục tiêu mong muốn
- **Đánh giá khả thi**: Đánh giá tính khả thi của mục tiêu trong thời gian đã định

**2. Tạo kế hoạch dinh dưỡng cá nhân hóa:**
- **Tính toán nhu cầu calo**: Dựa trên BMR, TDEE và mục tiêu (giảm/tăng/duy trì)
- **Phân bổ macro**: Tính toán tỷ lệ protein, carb, fat phù hợp với mục tiêu
- **Thiết kế thực đơn**: Tạo thực đơn hàng ngày/tuần với các món ăn cụ thể
- **Tính toán khẩu phần**: Định lượng chính xác từng món ăn theo nhu cầu
- **Gợi ý thực phẩm thay thế**: Đề xuất các thực phẩm tương đương khi cần
- **Lên lịch ăn uống**: Sắp xếp thời gian ăn uống tối ưu trong ngày
- **Xử lý ràng buộc**: Tự động loại trừ thực phẩm dị ứng, hạn chế ăn uống

**3. Tạo kế hoạch tập luyện cá nhân hóa:**
- **Phân tích mục tiêu tập luyện**: Xác định loại bài tập phù hợp với mục tiêu
- **Thiết kế lịch tập**: Tạo lịch tập theo tuần với các ngày cụ thể
- **Chọn bài tập phù hợp**: Đề xuất bài tập dựa trên mục tiêu và khả năng
- **Tính toán cường độ**: Định mức cường độ tập luyện phù hợp với trình độ
- **Lập kế hoạch tiến bộ**: Thiết kế lộ trình tăng dần độ khó và cường độ
- **Tính toán calo đốt cháy**: Ước tính calo tiêu hao cho từng buổi tập
- **Điều chỉnh theo thời gian**: Tối ưu hóa thời gian tập luyện trong ngày

**4. Theo dõi và đánh giá tiến độ:**
- **Thu thập dữ liệu tiến độ**: Tự động thu thập dữ liệu từ các module khác
- **Phân tích hiệu quả**: Đánh giá hiệu quả của kế hoạch đang thực hiện
- **So sánh với mục tiêu**: So sánh tiến độ thực tế với mục tiêu ban đầu
- **Phát hiện vấn đề**: Nhận diện các vấn đề trong quá trình thực hiện
- **Đưa ra cảnh báo**: Cảnh báo khi tiến độ không đạt như mong đợi

**5. Điều chỉnh kế hoạch thông minh:**
- **Phân tích nguyên nhân**: Tìm hiểu nguyên nhân khi tiến độ không đạt
- **Đề xuất điều chỉnh**: Đưa ra các đề xuất điều chỉnh kế hoạch
- **Tối ưu hóa liên tục**: Liên tục cải thiện kế hoạch dựa trên kết quả
- **Thích ứng với thay đổi**: Điều chỉnh khi có thay đổi về mục tiêu hoặc tình trạng

**6. Tư vấn và gợi ý thông minh:**
- **Gợi ý dinh dưỡng**: Đưa ra lời khuyên về dinh dưỡng dựa trên tình trạng
- **Gợi ý lối sống**: Khuyến nghị về giấc ngủ, stress management, thói quen
- **Cảnh báo sức khỏe**: Cảnh báo khi có dấu hiệu bất thường
- **Động viên và khuyến khích**: Đưa ra lời động viên phù hợp với tiến độ

#### Tham số đầu vào chi tiết:

**1. Thông tin profile hiện tại:**
- **Thông tin cá nhân**: Tuổi, giới tính, chiều cao, cân nặng
- **Chỉ số Inbody đầy đủ**: 
  - Cân nặng, tỷ lệ mỡ cơ thể, khối lượng cơ bắp
  - Chỉ số nước (TBW, ICW, ECW), mỡ nội tạng
  - BMI, FFMI, BMR, TDEE
- **Mức độ hoạt động**: Từ SEDENTARY đến EXTREMELY_ACTIVE
- **Tình trạng sức khỏe**: Bệnh lý, dị ứng, hạn chế ăn uống

**2. Mục tiêu và thời gian:**
- **Loại mục tiêu**: LOSE_WEIGHT, GAIN_WEIGHT, BUILD_MUSCLE, MAINTAIN_WEIGHT, IMPROVE_HEALTH
- **Mục tiêu cụ thể**: Số kg muốn giảm/tăng, tỷ lệ mỡ mục tiêu
- **Thời gian mục tiêu**: Số tuần/tháng muốn đạt được mục tiêu
- **Mức độ ưu tiên**: Cao, trung bình, thấp cho từng mục tiêu

**3. Ràng buộc và sở thích:**
- **Dị ứng thực phẩm**: Danh sách thực phẩm cần tránh
- **Hạn chế ăn uống**: Chế độ ăn đặc biệt (vegetarian, vegan, keto, etc.)
- **Sở thích ăn uống**: Thực phẩm yêu thích và không thích
- **Ràng buộc thời gian**: Thời gian có thể dành cho tập luyện
- **Ràng buộc địa điểm**: Tập tại nhà, gym, ngoài trời

**4. Thông tin bổ sung:**
- **Lịch sử tập luyện**: Kinh nghiệm tập luyện trước đây
- **Thiết bị có sẵn**: Dụng cụ tập luyện tại nhà
- **Khả năng tài chính**: Ngân sách cho thực phẩm và tập luyện
- **Môi trường sống**: Thành thị, nông thôn, khí hậu

#### Kế hoạch được sinh ra chi tiết:

**1. Kế hoạch dinh dưỡng:**
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

**2. Kế hoạch tập luyện:**
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

**3. Kế hoạch theo dõi:**
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

#### Quy trình AI chi tiết:

**Bước 1: Phân tích đầu vào**
- Thu thập và phân tích tất cả thông tin profile
- Xác định loại hình cơ thể (Ectomorph/Mesomorph/Endomorph)
- Tính toán BMR, TDEE và nhu cầu dinh dưỡng
- Đánh giá tình trạng sức khỏe hiện tại

**Bước 2: Tính toán khoảng cách mục tiêu**
- So sánh chỉ số hiện tại với mục tiêu mong muốn
- Tính toán số kg cần giảm/tăng
- Xác định thời gian cần thiết để đạt mục tiêu
- Đánh giá tính khả thi của mục tiêu

**Bước 3: Tạo kế hoạch tổng thể**
- Thiết kế kế hoạch dinh dưỡng chi tiết
- Tạo lịch tập luyện phù hợp
- Lập kế hoạch theo dõi và đánh giá
- Tính toán timeline cụ thể

**Bước 4: Tối ưu hóa kế hoạch**
- Điều chỉnh theo ràng buộc và sở thích
- Tối ưu hóa thời gian và hiệu quả
- Cân bằng giữa dinh dưỡng và tập luyện
- Đảm bảo tính bền vững của kế hoạch

**Bước 5: Triển khai và theo dõi**
- Triển khai kế hoạch cho người dùng
- Thu thập dữ liệu thực hiện hàng ngày
- Phân tích tiến độ và hiệu quả
- Điều chỉnh kế hoạch khi cần thiết

**Bước 6: Đánh giá và cải thiện**
- Đánh giá tổng thể sau mỗi giai đoạn
- Phân tích thành công và thất bại
- Cải thiện thuật toán dựa trên kết quả
- Tối ưu hóa cho các trường hợp tương tự

#### API Endpoints chi tiết:

**Phân tích và tạo kế hoạch:**
- `POST /ai/analyze-profile` - Phân tích profile và tạo kế hoạch mới
- `POST /ai/analyze-profile/quick` - Phân tích nhanh profile hiện tại
- `POST /ai/analyze-profile/detailed` - Phân tích chi tiết với nhiều tham số

**Quản lý kế hoạch:**
- `GET /ai/plan/:planId` - Lấy kế hoạch chi tiết
- `GET /ai/plan/:planId/summary` - Lấy tóm tắt kế hoạch
- `PATCH /ai/plan/:planId` - Cập nhật kế hoạch
- `DELETE /ai/plan/:planId` - Xóa kế hoạch
- `POST /ai/plan/:planId/duplicate` - Tạo bản sao kế hoạch

**Theo dõi tiến độ:**
- `GET /ai/plan/:planId/progress` - Theo dõi tiến độ kế hoạch
- `GET /ai/plan/:planId/progress/detailed` - Tiến độ chi tiết
- `GET /ai/plan/:planId/progress/charts` - Dữ liệu cho biểu đồ tiến độ
- `POST /ai/plan/:planId/progress/update` - Cập nhật tiến độ thủ công

**Điều chỉnh kế hoạch:**
- `POST /ai/plan/:planId/adjust` - Điều chỉnh kế hoạch dựa trên tiến độ
- `POST /ai/plan/:planId/adjust/auto` - Tự động điều chỉnh kế hoạch
- `POST /ai/plan/:planId/adjust/manual` - Điều chỉnh thủ công
- `GET /ai/plan/:planId/adjust/history` - Lịch sử điều chỉnh

**Gợi ý và tư vấn:**
- `GET /ai/recommendations` - Gợi ý dinh dưỡng và tập luyện
- `GET /ai/recommendations/nutrition` - Gợi ý dinh dưỡng
- `GET /ai/recommendations/exercise` - Gợi ý bài tập
- `GET /ai/recommendations/lifestyle` - Gợi ý lối sống
- `POST /ai/recommendations/feedback` - Phản hồi về gợi ý

**Báo cáo và phân tích:**
- `GET /ai/plan/:planId/report` - Báo cáo tổng hợp kế hoạch
- `GET /ai/plan/:planId/report/weekly` - Báo cáo hàng tuần
- `GET /ai/plan/:planId/report/monthly` - Báo cáo hàng tháng
- `GET /ai/plan/:planId/analysis` - Phân tích hiệu quả kế hoạch


</details>
<details>
<summary>📧 10. Gửi email</summary>

### 10. Gửi email

#### Chức năng:
- **Email chào mừng**: Email chào mừng người dùng mới
- **Email quên mật khẩu**: Gửi link reset mật khẩu
- **Email nhắc nhở**: Nhắc nhở uống nước, tập luyện
- **Email báo cáo**: Báo cáo tuần/tháng


</details>
<details>
<summary>👨‍💼 11. Quản lý mối quan hệ Huấn luyện viên - Người dùng</summary>

### 11. Quản lý mối quan hệ Huấn luyện viên - Người dùng (Trainer-User Relationship)

#### Chức năng:
- **Chế độ tìm kiếm huấn luyện viên**: Người dùng có thể bật chế độ "đang tìm huấn luyện viên"
- **Marketplace huấn luyện viên**: Chợ huấn luyện viên với khu vực, đặc điểm, profile sức khỏe
- **Hệ thống đăng ký huấn luyện viên**: Quy trình đăng ký và kiểm duyệt huấn luyện viên
- **Quảng cáo và khuyến mại**: Huấn luyện viên có thể tạo quảng cáo và kế hoạch khuyến mại
- **Tìm kiếm và kết nối**: Người dùng tìm kiếm và kết nối với huấn luyện viên
- **Hệ thống matching**: AI gợi ý huấn luyện viên phù hợp dựa trên mục tiêu, vị trí, ngân sách
- **Theo dõi tiến độ**: Huấn luyện viên theo dõi tiến độ của người dùng
- **Gửi gợi ý**: Huấn luyện viên gửi gợi ý dinh dưỡng và tập luyện
- **Quản lý danh sách**: Người dùng quản lý danh sách huấn luyện viên
- **Thu hồi quyền**: Người dùng có thể thu hồi quyền truy cập của huấn luyện viên
- **Đánh giá và review**: Hệ thống đánh giá huấn luyện viên

#### Chế độ tìm kiếm huấn luyện viên:
- **Bật/tắt chế độ**: Người dùng có thể bật chế độ "đang tìm huấn luyện viên"
- **Thông tin hiển thị**: Profile sức khỏe, thông tin cá nhân, mục tiêu, khu vực
- **Đặc điểm cần thiết**: Yêu cầu về chuyên môn, giá cả, thời gian, phương pháp
- **Khu vực tìm kiếm**: Địa chỉ, bán kính tìm kiếm, hỗ trợ online/offline
- **Thời gian hiển thị**: Thời gian muốn hiển thị trong marketplace
- **Trạng thái**: ACTIVE, INACTIVE, PAUSED

#### Marketplace huấn luyện viên:
- **Danh sách người dùng tìm kiếm**: Hiển thị người dùng đang tìm huấn luyện viên
- **Bộ lọc thông minh**: Lọc theo khu vực, đặc điểm, mục tiêu, ngân sách
- **Xem profile chi tiết**: Huấn luyện viên có thể xem profile sức khỏe và thông tin cá nhân
- **Gửi đề xuất**: Huấn luyện viên gửi đề xuất và giới thiệu dịch vụ
- **Chat trực tiếp**: Hệ thống chat để trao đổi trước khi kết nối
- **Đặt lịch tư vấn**: Sắp xếp buổi tư vấn miễn phí hoặc có phí

#### Hệ thống đăng ký huấn luyện viên:
- **Đăng ký cơ bản**: Thông tin cá nhân, chuyên môn, kinh nghiệm
- **Tải chứng chỉ**: Upload các chứng chỉ chuyên môn và bằng cấp
- **Kiểm duyệt hồ sơ**: Admin kiểm duyệt thông tin và chứng chỉ
- **Phỏng vấn**: Buổi phỏng vấn online/offline để đánh giá năng lực
- **Chứng nhận**: Cấp chứng nhận huấn luyện viên chính thức
- **Đào tạo**: Khóa đào tạo về sử dụng hệ thống và quy trình làm việc
- **Trạng thái**: PENDING, APPROVED, REJECTED, SUSPENDED

#### Quảng cáo và khuyến mại:
- **Tạo quảng cáo**: Huấn luyện viên tạo quảng cáo để nổi bật
- **Kế hoạch khuyến mại**: Giảm giá, gói dịch vụ, ưu đãi đặc biệt
- **Targeting**: Nhắm đối tượng theo khu vực, mục tiêu, ngân sách
- **Budget và bidding**: Thiết lập ngân sách quảng cáo và giá thầu
- **Thống kê hiệu quả**: Theo dõi lượt xem, click, chuyển đổi
- **A/B testing**: Thử nghiệm các nội dung quảng cáo khác nhau
- **Trạng thái quảng cáo**: ACTIVE, PAUSED, COMPLETED, REJECTED

#### Hệ thống thanh toán nội bộ:
- **Ví điện tử**: Tích hợp ví điện tử cho người dùng và huấn luyện viên
- **Nạp tiền**: Nạp tiền qua ngân hàng, ví điện tử, thẻ tín dụng
- **Rút tiền**: Rút tiền về tài khoản ngân hàng
- **Thanh toán dịch vụ**: Thanh toán phí huấn luyện viên
- **Thanh toán quảng cáo**: Thanh toán phí quảng cáo và khuyến mại
- **Hoa hồng hệ thống**: Thu phí hoa hồng từ các giao dịch
- **Lịch sử giao dịch**: Theo dõi tất cả giao dịch thanh toán
- **Báo cáo tài chính**: Báo cáo thu chi cho người dùng và huấn luyện viên

#### Phân quyền:
- **Trainer (Huấn luyện viên)**:
  - Xem profile và tiến độ của người dùng được kết nối
  - Gửi gợi ý dinh dưỡng và tập luyện
  - Theo dõi hoạt động ăn uống và tập luyện
  - Không thể xem danh sách huấn luyện viên khác của người dùng
  - Không thể xem thông tin cá nhân nhạy cảm
  - Tạo quảng cáo và khuyến mại
  - Xem marketplace người dùng tìm kiếm
  - Gửi đề xuất cho người dùng
- **User (Người dùng)**:
  - Tìm kiếm và kết nối với nhiều huấn luyện viên
  - Quản lý danh sách huấn luyện viên
  - Thu hồi quyền truy cập của huấn luyện viên
  - Đánh giá và review huấn luyện viên
  - Nhận gợi ý từ các huấn luyện viên
  - Bật/tắt chế độ tìm kiếm huấn luyện viên
- **Admin (Quản trị viên)**:
  - Kiểm duyệt đăng ký huấn luyện viên
  - Quản lý quảng cáo và khuyến mại
  - Xử lý khiếu nại và tranh chấp

#### Thông tin mối quan hệ:
- **Trạng thái kết nối**: PENDING, ACTIVE, INACTIVE, BLOCKED
- **Quyền truy cập**: PROFILE_VIEW, MEAL_VIEW, EXERCISE_VIEW, GOAL_VIEW
- **Ghi chú**: Ghi chú của huấn luyện viên về người dùng
- **Đánh giá**: Rating và review của người dùng
- **Thời gian kết nối**: Ngày bắt đầu và kết thúc
- **Phí dịch vụ**: Chi phí dịch vụ và phương thức thanh toán

#### Thông tin huấn luyện viên:
- **Chuyên môn**: Dinh dưỡng, tập luyện, giảm cân, tăng cơ, yoga, pilates
- **Chứng chỉ**: Các chứng chỉ chuyên môn và kinh nghiệm
- **Kinh nghiệm**: Số năm kinh nghiệm, số khách hàng đã hỗ trợ
- **Vị trí**: Địa chỉ, khoảng cách, hỗ trợ online/offline
- **Đánh giá**: Rating trung bình, số lượng review
- **Giá cả**: Phí dịch vụ theo tháng/buổi
- **Giờ làm việc**: Lịch làm việc và thời gian có sẵn
- **Phương pháp**: Cách tiếp cận và phương pháp huấn luyện
- **Đối tượng mục tiêu**: Nhóm người dùng phù hợp
- **Trạng thái kiểm duyệt**: PENDING, APPROVED, REJECTED, SUSPENDED
- **Quảng cáo**: Danh sách quảng cáo và khuyến mại đang chạy

#### Loại gợi ý:
- **Gợi ý dinh dưỡng**: Thực đơn, thực phẩm, bữa ăn
- **Gợi ý tập luyện**: Bài tập, lịch tập, cường độ
- **Gợi ý lối sống**: Thói quen, giấc ngủ, stress management
- **Gợi ý mục tiêu**: Điều chỉnh mục tiêu dinh dưỡng
- **Đề xuất dịch vụ**: Giới thiệu gói dịch vụ và khuyến mại

#### Tiêu chí matching:
- **Mục tiêu**: Phù hợp với mục tiêu của người dùng (giảm cân, tăng cơ, cải thiện sức khỏe)
- **Vị trí**: Khoảng cách địa lý và khả năng hỗ trợ online/offline
- **Ngân sách**: Phù hợp với khả năng tài chính của người dùng
- **Chuyên môn**: Chuyên môn phù hợp với nhu cầu cụ thể
- **Đánh giá**: Rating và review từ người dùng khác
- **Tính khả dụng**: Thời gian làm việc phù hợp với lịch của người dùng
- **Phương pháp**: Cách tiếp cận phù hợp với sở thích và khả năng
- **Quảng cáo**: Ưu tiên huấn luyện viên có quảng cáo phù hợp

#### API Endpoints:

**Quản lý mối quan hệ:**
- `POST /trainer-relationships` - Tạo mối quan hệ mới
- `GET /trainer-relationships` - Lấy danh sách mối quan hệ
- `GET /trainer-relationships/:id` - Xem chi tiết mối quan hệ
- `PATCH /trainer-relationships/:id` - Cập nhật mối quan hệ
- `DELETE /trainer-relationships/:id` - Xóa mối quan hệ

**API cho huấn luyện viên:**
- `GET /trainer-relationships/my-clients` - Danh sách khách hàng
- `GET /trainer-relationships/:id/client-progress` - Tiến độ khách hàng
- `POST /trainer-relationships/:id/suggestions` - Gửi gợi ý
- `GET /trainer-relationships/:id/suggestions` - Lịch sử gợi ý

**API cho người dùng:**
- `GET /trainer-relationships/my-trainers` - Danh sách huấn luyện viên
- `GET /trainer-relationships/:id/trainer-suggestions` - Gợi ý từ huấn luyện viên
- `POST /trainer-relationships/:id/review` - Đánh giá huấn luyện viên

**Marketplace và tìm kiếm:**
- `GET /marketplace/users` - Danh sách người dùng đang tìm huấn luyện viên
- `GET /marketplace/trainers` - Danh sách huấn luyện viên có sẵn
- `POST /marketplace/search-mode` - Bật/tắt chế độ tìm kiếm
- `GET /marketplace/search-mode` - Xem trạng thái chế độ tìm kiếm
- `POST /marketplace/proposals` - Gửi đề xuất cho người dùng
- `GET /marketplace/proposals` - Xem đề xuất đã gửi

**Tìm kiếm và matching:**
- `GET /trainers/search` - Tìm kiếm huấn luyện viên
- `GET /trainers/matching` - Gợi ý huấn luyện viên phù hợp
- `GET /trainers/:id` - Chi tiết huấn luyện viên
- `GET /trainers/:id/reviews` - Đánh giá huấn luyện viên
- `POST /trainers/:id/request-connection` - Yêu cầu kết nối

**Đăng ký huấn luyện viên:**
- `POST /trainer-registration` - Đăng ký làm huấn luyện viên
- `GET /trainer-registration/status` - Xem trạng thái đăng ký
- `POST /trainer-registration/documents` - Upload chứng chỉ
- `GET /trainer-registration/documents` - Xem danh sách chứng chỉ
- `POST /trainer-registration/interview` - Đặt lịch phỏng vấn

**Quảng cáo và khuyến mại:**
- `POST /advertisements` - Tạo quảng cáo mới
- `GET /advertisements` - Danh sách quảng cáo
- `GET /advertisements/:id` - Chi tiết quảng cáo
- `PATCH /advertisements/:id` - Cập nhật quảng cáo
- `DELETE /advertisements/:id` - Xóa quảng cáo
- `POST /promotions` - Tạo khuyến mại mới
- `GET /promotions` - Danh sách khuyến mại
- `GET /promotions/:id` - Chi tiết khuyến mại
- `PATCH /promotions/:id` - Cập nhật khuyến mại
- `DELETE /promotions/:id` - Xóa khuyến mại

#### Workflow thực tế:

**Cho người dùng tìm huấn luyện viên:**
1. **Bật chế độ tìm kiếm**: Người dùng bật chế độ "đang tìm huấn luyện viên"
2. **Cập nhật thông tin**: Điền đầy đủ thông tin cá nhân, mục tiêu, khu vực
3. **Hiển thị trong marketplace**: Profile xuất hiện trong chợ huấn luyện viên
4. **Nhận đề xuất**: Huấn luyện viên gửi đề xuất và giới thiệu
5. **Chat và tư vấn**: Trao đổi trực tiếp với huấn luyện viên
6. **Lựa chọn và kết nối**: Chọn huấn luyện viên phù hợp và kết nối
7. **Thanh toán**: Thanh toán phí dịch vụ qua hệ thống wallet
8. **Bắt đầu dịch vụ**: Huấn luyện viên bắt đầu theo dõi và tư vấn

**Cho huấn luyện viên:**
1. **Đăng ký**: Điền thông tin và upload chứng chỉ
2. **Kiểm duyệt**: Admin kiểm duyệt hồ sơ và phỏng vấn
3. **Chứng nhận**: Nhận chứng nhận huấn luyện viên chính thức
4. **Tạo quảng cáo**: Tạo quảng cáo và khuyến mại để nổi bật
5. **Xem marketplace**: Xem danh sách người dùng đang tìm kiếm
6. **Gửi đề xuất**: Gửi đề xuất cho người dùng phù hợp
7. **Chat và tư vấn**: Trao đổi với người dùng tiềm năng
8. **Kết nối và thanh toán**: Kết nối và nhận thanh toán qua hệ thống wallet
9. **Cung cấp dịch vụ**: Theo dõi tiến độ và gửi gợi ý cho khách hàng


</details>
<details>
<summary>💰 12. Hệ thống ví điện tử và thanh toán</summary>

### 12. Hệ thống ví điện tử và thanh toán (Wallet & Payment System)

#### Chức năng:
- **Ví điện tử tích hợp**: Quản lý tiền nội bộ cho người dùng và huấn luyện viên
- **Nạp tiền**: Nạp tiền qua ngân hàng, ví điện tử, thẻ tín dụng
- **Rút tiền**: Rút tiền về tài khoản ngân hàng
- **Thanh toán dịch vụ**: Thanh toán phí huấn luyện viên, thuê bao, dịch vụ
- **Thanh toán quảng cáo**: Thanh toán phí quảng cáo và khuyến mại
- **Hoa hồng hệ thống**: Thu phí hoa hồng từ các giao dịch
- **Lịch sử giao dịch**: Theo dõi tất cả giao dịch thanh toán
- **Báo cáo tài chính**: Báo cáo thu chi cho người dùng và huấn luyện viên
- **Khuyến mại và thưởng**: Hệ thống khuyến mại, thưởng, cashback
- **Lưu trữ dữ liệu**: Thanh toán cho dịch vụ lưu trữ và backup
- **Thuê bao premium**: Thanh toán cho các gói thuê bao cao cấp

#### Loại giao dịch:
- **Nạp tiền**: Người dùng nạp tiền vào ví
- **Rút tiền**: Rút tiền về tài khoản ngân hàng
- **Thanh toán dịch vụ**: Phí huấn luyện viên, thuê bao, dịch vụ premium
- **Thanh toán quảng cáo**: Phí quảng cáo và khuyến mại
- **Hoa hồng**: Hệ thống thu hoa hồng từ giao dịch
- **Khuyến mại**: Thưởng, cashback, giảm giá
- **Phí lưu trữ**: Thanh toán cho dịch vụ lưu trữ dữ liệu
- **Chuyển khoản**: Chuyển tiền giữa các tài khoản

#### Phân quyền:
- **User (Người dùng)**:
  - Nạp/rút tiền từ ví
  - Thanh toán các dịch vụ
  - Xem lịch sử giao dịch
  - Quản lý thông tin thanh toán
  - Nhận khuyến mại và thưởng
- **Trainer (Huấn luyện viên)**:
  - Nhận thanh toán từ khách hàng
  - Thanh toán phí quảng cáo
  - Rút tiền về tài khoản
  - Xem báo cáo thu nhập
- **Admin (Quản trị viên)**:
  - Quản lý toàn bộ hệ thống thanh toán
  - Xử lý khiếu nại giao dịch
  - Quản lý khuyến mại và thưởng
  - Báo cáo tài chính tổng hợp

#### Thông tin ví:
- **Số dư hiện tại**: Số tiền có trong ví
- **Số dư khả dụng**: Số tiền có thể sử dụng
- **Số dư đang xử lý**: Số tiền đang trong quá trình xử lý
- **Lịch sử giao dịch**: Tất cả giao dịch nạp, rút, thanh toán
- **Thông tin ngân hàng**: Thông tin tài khoản ngân hàng liên kết
- **Cài đặt bảo mật**: 2FA, PIN, giới hạn giao dịch

#### Loại dịch vụ thanh toán:
- **Thuê bao premium**: Gói thuê bao cao cấp với tính năng nâng cao
- **Dịch vụ huấn luyện viên**: Thanh toán phí dịch vụ PT
- **Quảng cáo**: Phí quảng cáo và khuyến mại
- **Lưu trữ dữ liệu**: Phí lưu trữ và backup dữ liệu
- **Dịch vụ AI nâng cao**: Các tính năng AI premium
- **Tư vấn chuyên gia**: Dịch vụ tư vấn từ chuyên gia dinh dưỡng
- **Báo cáo chi tiết**: Báo cáo sức khỏe và dinh dưỡng chi tiết

#### Khuyến mại và thưởng:
- **Khuyến mại đăng ký**: Thưởng cho người dùng mới
- **Cashback**: Hoàn tiền theo tỷ lệ giao dịch
- **Thưởng giới thiệu**: Thưởng khi giới thiệu người dùng mới
- **Khuyến mại theo mùa**: Giảm giá theo thời điểm
- **Loyalty program**: Chương trình khách hàng thân thiết
- **Điểm tích lũy**: Tích điểm và đổi quà

#### API Endpoints:

**Quản lý ví:**
- `POST /wallet/deposit` - Nạp tiền vào ví
- `POST /wallet/withdraw` - Rút tiền từ ví
- `GET /wallet/balance` - Xem số dư ví
- `GET /wallet/transactions` - Lịch sử giao dịch
- `GET /wallet/transactions/:id` - Chi tiết giao dịch
- `POST /wallet/transfer` - Chuyển tiền giữa các tài khoản

**Thanh toán dịch vụ:**
- `POST /payments/trainer-fee` - Thanh toán phí huấn luyện viên
- `POST /payments/subscription` - Thanh toán thuê bao
- `POST /payments/advertisement-fee` - Thanh toán phí quảng cáo
- `POST /payments/storage-fee` - Thanh toán phí lưu trữ
- `POST /payments/ai-premium` - Thanh toán dịch vụ AI nâng cao
- `POST /payments/consultation` - Thanh toán tư vấn chuyên gia

**Hóa đơn và báo cáo:**
- `GET /payments/invoices` - Danh sách hóa đơn
- `GET /payments/invoices/:id` - Chi tiết hóa đơn
- `GET /payments/reports` - Báo cáo tài chính
- `GET /payments/reports/income` - Báo cáo thu nhập
- `GET /payments/reports/expenses` - Báo cáo chi tiêu

**Khuyến mại và thưởng:**
- `GET /promotions/available` - Danh sách khuyến mại có sẵn
- `POST /promotions/claim` - Nhận khuyến mại
- `GET /promotions/my-promotions` - Khuyến mại đã nhận
- `GET /loyalty/points` - Điểm tích lũy
- `POST /loyalty/redeem` - Đổi điểm lấy quà

**Bảo mật và cài đặt:**
- `POST /wallet/setup-security` - Thiết lập bảo mật
- `POST /wallet/update-bank-info` - Cập nhật thông tin ngân hàng
- `GET /wallet/security-settings` - Cài đặt bảo mật
- `POST /wallet/verify-transaction` - Xác minh giao dịch

#### Workflow thực tế:

**Nạp tiền:**
1. **Chọn phương thức**: Chọn ngân hàng, ví điện tử, thẻ tín dụng
2. **Nhập số tiền**: Nhập số tiền muốn nạp
3. **Xác minh**: Xác minh thông tin và OTP
4. **Xử lý**: Hệ thống xử lý giao dịch
5. **Cập nhật**: Cập nhật số dư ví
6. **Thông báo**: Gửi thông báo xác nhận

**Thanh toán dịch vụ:**
1. **Chọn dịch vụ**: Chọn dịch vụ cần thanh toán
2. **Xem chi tiết**: Xem thông tin và giá dịch vụ
3. **Xác nhận**: Xác nhận thông tin thanh toán
4. **Thanh toán**: Trừ tiền từ ví và thanh toán
5. **Kích hoạt**: Kích hoạt dịch vụ cho người dùng
6. **Thông báo**: Gửi thông báo xác nhận

**Rút tiền:**
1. **Nhập thông tin**: Nhập số tiền và thông tin ngân hàng
2. **Xác minh**: Xác minh thông tin và bảo mật
3. **Gửi yêu cầu**: Gửi yêu cầu rút tiền
4. **Xử lý**: Hệ thống xử lý trong 1-3 ngày làm việc
5. **Chuyển tiền**: Chuyển tiền về tài khoản ngân hàng
6. **Thông báo**: Gửi thông báo xác nhận

## Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js (version 16 trở lên)
- PostgreSQL
- npm hoặc yarn

### Cài đặt

1. **Clone dự án**
```bash
git clone <repository-url>
cd NutriWise/nutriwise-backend
```

2. **Cài đặt dependencies**
```bash
npm install
# hoặc
yarn install
```

3. **Cấu hình môi trường**
Tạo file `.env` với các biến môi trường. Xem chi tiết tại [ENVIRONMENT.md](./ENVIRONMENT.md)

**Cấu hình cơ bản:**
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=nutriwise

# JWT
JWT_SECRET=nutriwise_jwt_secret_key_2024
JWT_REFRESH_SECRET=nutriwise_refresh_secret_key_2024

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Server
PORT=4001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. **Chạy migration**
```bash
npm run migration:run
```

5. **Seed dữ liệu (tùy chọn)**
```bash
npm run seed
```

6. **Chạy dự án**
```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

### Scripts có sẵn

- `npm run build` - Build dự án
- `npm run start` - Chạy dự án
- `npm run start:dev` - Chạy với chế độ watch
- `npm run start:debug` - Chạy với debug mode
- `npm run start:prod` - Chạy production
- `npm run test` - Chạy test
- `npm run test:e2e` - Chạy end-to-end test
- `npm run migration:run` - Chạy migration
- `npm run migration:revert` - Revert migration
- `npm run seed` - Seed dữ liệu

## API Documentation

Sau khi chạy dự án, truy cập Swagger UI tại:
```
http://localhost:4001/api/docs
```

## Bảo mật

- **JWT Authentication**: Sử dụng JWT token cho xác thực
- **Role-based Access Control**: Phân quyền theo vai trò
- **Password Hashing**: Mã hóa mật khẩu với bcrypt
- **CORS**: Cấu hình CORS cho frontend
- **Input Validation**: Validate input với class-validator
- **SQL Injection Protection**: Sử dụng TypeORM để tránh SQL injection

## Cấu trúc Database

Hệ thống sử dụng PostgreSQL với các bảng chính:
- `users` - Người dùng hệ thống
- `profiles` - Hồ sơ cá nhân và thông tin sức khỏe (theo thời gian)
- `ai_plans` - Kế hoạch được sinh bởi AI
- `ai_plan_details` - Chi tiết kế hoạch (dinh dưỡng, tập luyện)
- `ai_progress` - Tiến độ thực hiện kế hoạch
- `meals` - Bữa ăn
- `meal_foods` - Thực phẩm trong bữa ăn
- `water_intakes` - Lượng nước uống
- `exercises` - Bài tập
- `nutrition_goals` - Mục tiêu dinh dưỡng

## Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## Cấu hình môi trường

Xem chi tiết cấu hình môi trường tại [ENVIRONMENT.md](./ENVIRONMENT.md)

### Biến môi trường chính:

- **Database**: Cấu hình PostgreSQL
- **JWT**: Secret keys cho authentication
- **Email**: Cấu hình SMTP cho gửi email
- **Server**: Port, environment, CORS
- **Security**: Bcrypt rounds, cookie secret
- **API**: Prefix, Swagger configuration

### Quick Start:

1. Tạo file `.env` từ template trong ENVIRONMENT.md
2. Cấu hình database PostgreSQL
3. Cấu hình email (Gmail App Password)
4. Chạy `npm run start:dev`
5. Truy cập Swagger UI tại `http://localhost:4001/api/docs`

## License

Dự án này được phát triển cho mục đích học tập và thương mại.

</details>
