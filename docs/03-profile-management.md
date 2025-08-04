# 📊 3. Hồ sơ cá nhân (Profile Management)

## Chức năng:
- **Tạo hồ sơ**: Thêm thông tin cá nhân và sức khỏe
- **Tạo profile mới**: Tạo profile mới tại thời điểm hiện tại
- **Cập nhật hồ sơ**: Chỉnh sửa thông tin cá nhân và chỉ số Inbody
- **Tính toán BMR/TDEE**: Tự động tính toán chỉ số chuyển hóa (công thức chuẩn)
- **Mục tiêu dinh dưỡng**: Thiết lập mục tiêu calo, protein, carb, fat
- **Theo dõi chỉ số Inbody**: Lưu trữ và theo dõi các chỉ số từ cân Inbody
- **Quản lý profile theo thời gian**: Mỗi profile đại diện cho một thời điểm
- **So sánh profile**: So sánh 2 profile tại các thời điểm khác nhau
- **Phân tích xu hướng**: Phân tích thay đổi các chỉ số theo thời gian (AI xử lý)
- **Biểu đồ tiến độ**: Hiển thị biểu đồ thay đổi các chỉ số
- **Đánh giá sức khỏe**: Đánh giá tình trạng sức khỏe dựa trên các chỉ số (AI xử lý)
- **Tư vấn dinh dưỡng**: Đưa ra khuyến nghị dựa trên chỉ số cơ thể (AI xử lý)

## Thông tin hồ sơ:
- **Thông tin cá nhân**: tên, tuổi, giới tính, chiều cao, cân nặng
- **Mức độ hoạt động**: SEDENTARY, LIGHTLY_ACTIVE, MODERATELY_ACTIVE, VERY_ACTIVE, EXTREMELY_ACTIVE
- **Mục tiêu**: LOSE_WEIGHT, MAINTAIN_WEIGHT, GAIN_WEIGHT, BUILD_MUSCLE, IMPROVE_HEALTH
- **Mục tiêu cá nhân**: Các mục tiêu cụ thể do người dùng tự chọn (giảm mỡ bụng, tăng vòng ngực, etc.)
- **Thông tin y tế**: dị ứng, bệnh nền/bệnh lý, vấn đề sức khỏe hiện tại
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
- **Phân tích xu hướng**: Phân tích thay đổi qua các profile theo thời gian (AI xử lý)
- **Biểu đồ tiến độ**: Hiển thị biểu đồ thay đổi các chỉ số qua các profile
- **Báo cáo tiến độ**: Tạo báo cáo tổng hợp về sự thay đổi (AI xử lý)
- **Profile mới nhất**: Luôn có profile mới nhất để tham chiếu

## Hệ thống hình mẫu lý tưởng (AI xử lý):
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

## Phân chia trách nhiệm xử lý:

### Profile Module (Xử lý cơ bản - Công thức chuẩn):

#### 1. Tính toán BMI:
```
BMI = weight (kg) / (height (cm) / 100)²
Phân loại:
- Underweight: < 18.5
- Normal: 18.5 - 24.9
- Overweight: 25.0 - 29.9
- Obese: ≥ 30.0
```

#### 2. Tính toán BMR (Basal Metabolic Rate):
**Công thức Mifflin-St Jeor:**
```
Nam giới: BMR = 10 × weight (kg) + 6.25 × height (cm) - 5 × age + 5
Nữ giới: BMR = 10 × weight (kg) + 6.25 × height (cm) - 5 × age - 161
```

#### 3. Tính toán TDEE (Total Daily Energy Expenditure):
**TDEE = BMR × Activity Multiplier**
```
- Sedentary (ít vận động): BMR × 1.2
- Lightly Active (vận động nhẹ): BMR × 1.375
- Moderately Active (vận động vừa): BMR × 1.55
- Very Active (vận động nhiều): BMR × 1.725
- Extremely Active (vận động rất nhiều): BMR × 1.9
```

#### 4. Tính toán FFMI (Fat-Free Mass Index):
```
FFMI = (weight × (1 - bodyFatPercentage/100)) / (height/100)²
```

#### 5. So sánh profile:
```
Chênh lệch = Giá trị mới - Giá trị cũ
Phần trăm thay đổi = (Chênh lệch / Giá trị cũ) × 100
Thời gian = Ngày tạo profile mới - Ngày tạo profile cũ
```

### AI Module (Xử lý phức tạp):

#### 1. Tính toán chỉ số lý tưởng:
**Tham số đầu vào:**
```typescript
{
  age?: number;                    // Tuổi người dùng
  gender?: 'Male' | 'Female';      // Giới tính
  height?: number;                 // Chiều cao (cm)
  currentWeight?: number;          // Cân nặng hiện tại (kg)
  currentBodyFatPercentage?: number; // Tỷ lệ mỡ hiện tại (%)
  currentMuscleMass?: number;      // Khối lượng cơ hiện tại (kg)
  goalType?: GoalType;             // Loại mục tiêu
  personalGoals?: string[];        // Mục tiêu cá nhân cụ thể
  activityLevel?: ActivityLevel;   // Mức độ hoạt động
  medicalConditions?: string[];    // Bệnh nền, bệnh lý
  healthIssues?: string[];         // Vấn đề sức khỏe hiện tại
}
```

**Kết quả AI trả về:**
```typescript
{
  idealWeight?: number;            // Cân nặng lý tưởng (kg)
  idealBodyFatPercentage?: number; // Tỷ lệ mỡ lý tưởng (%)
  idealMuscleMass?: number;        // Khối lượng cơ lý tưởng (kg)
  targetCalories?: number;         // Mục tiêu calo hàng ngày
  recommendedMacros?: {
    protein: number;               // Protein (g)
    carbs: number;                 // Carbs (g)
    fats: number;                  // Fats (g)
  };
  personalizedRecommendations?: string[]; // Khuyến nghị dựa trên mục tiêu cá nhân
}
```

#### 2. Đánh giá sức khỏe:
**Tham số đầu vào:**
```typescript
{
  profile?: Profile;               // Profile hiện tại
  profileHistory?: Profile[];      // Lịch sử profile (nếu có)
  age?: number;                    // Tuổi
  gender?: 'Male' | 'Female';      // Giới tính
  goalType?: GoalType;             // Mục tiêu
  personalGoals?: string[];        // Mục tiêu cá nhân
  medicalConditions?: string[];    // Bệnh nền, bệnh lý
  healthIssues?: string[];         // Vấn đề sức khỏe hiện tại
}
```

**Kết quả AI trả về:**
```typescript
{
  healthAssessment?: string;       // Đánh giá tổng quan sức khỏe
  healthScore?: number;            // Điểm số sức khỏe (0-100)
  riskFactors?: string[];          // Các yếu tố nguy cơ
  recommendations?: string[];      // Khuyến nghị cải thiện
}
```

#### 3. Phân tích xu hướng:
**Tham số đầu vào:**
```typescript
{
  profiles?: Profile[];            // Danh sách tất cả profile theo thời gian
  period?: string;                 // Khoảng thời gian phân tích (week, month, year)
  targetMetrics?: string[];        // Các chỉ số cần phân tích
  userId?: number;                 // ID người dùng
}
```

**Kết quả AI trả về:**
```typescript
{
  trendAnalysis?: {
    weight?: string;               // Phân tích xu hướng cân nặng
    bodyFat?: string;              // Phân tích xu hướng mỡ
    muscleMass?: string;           // Phân tích xu hướng cơ
    water?: string;                // Phân tích xu hướng nước
  };
  prediction?: {
    nextMonth?: object;            // Dự đoán tháng tới
    nextQuarter?: object;          // Dự đoán quý tới
  };
  recommendations?: string[];      // Khuyến nghị dựa trên xu hướng
  progressReport?: {
    summary: string;               // Tóm tắt tiến độ
    achievements: string[];        // Thành tựu đạt được
    challenges: string[];          // Thách thức cần vượt qua
  };
}
```

#### 4. Tư vấn dinh dưỡng:
**Tham số đầu vào:**
```typescript
{
  profile?: Profile;               // Profile hiện tại
  nutritionGoals?: {
    targetCalories?: number;       // Mục tiêu calo
    targetProtein?: number;        // Mục tiêu protein
    targetCarbs?: number;          // Mục tiêu carbs
    targetFats?: number;           // Mục tiêu fats
  };
  mealHistory?: Meal[];            // Lịch sử ăn uống (nếu có)
  preferences?: {
    dietaryRestrictions?: string[]; // Hạn chế ăn uống
    foodPreferences?: string[];    // Sở thích ăn uống
    allergies?: string[];          // Dị ứng thực phẩm
  };
  personalGoals?: string[];        // Mục tiêu cá nhân
}
```

**Kết quả AI trả về:**
```typescript
{
  nutritionPlan?: {
    dailyMeals: object[];          // Kế hoạch bữa ăn hàng ngày
    weeklyPlan: object[];          // Kế hoạch tuần
    shoppingList: string[];        // Danh sách mua sắm
  };
  mealSuggestions?: object[];      // Gợi ý bữa ăn cụ thể
  supplementRecommendations?: string[]; // Khuyến nghị bổ sung
  lifestyleTips?: string[];        // Lời khuyên về lối sống
}
```

#### 5. Tạo kế hoạch cải thiện:
**Tham số đầu vào:**
```typescript
{
  profile?: Profile;               // Profile hiện tại
  targetGoals?: {
    targetWeight?: number;         // Cân nặng mục tiêu
    targetBodyFat?: number;        // Tỷ lệ mỡ mục tiêu
    targetMuscleMass?: number;     // Khối lượng cơ mục tiêu
    personalGoals?: string[];      // Mục tiêu cá nhân
  };
  timeline?: {
    targetDate?: Date;             // Ngày đạt mục tiêu
    milestones?: object[];         // Các mốc quan trọng
  };
  constraints?: {
    timeAvailability?: string;     // Thời gian có sẵn
    budget?: number;               // Ngân sách
    equipment?: string[];          // Thiết bị có sẵn
  };
}
```

**Kết quả AI trả về:**
```typescript
{
  improvementPlan?: {
    phases: object[];              // Các giai đoạn cải thiện
    exercises: object[];           // Bài tập cụ thể
    nutrition: object;             // Kế hoạch dinh dưỡng
    recovery: object;              // Kế hoạch phục hồi
  };
  milestones?: object[];           // Các mốc quan trọng
  estimatedTimeline?: {
    startDate: Date;               // Ngày bắt đầu
    endDate: Date;                 // Ngày kết thúc dự kiến
    phases: object[];              // Thời gian từng giai đoạn
  };
  successProbability?: number;     // Xác suất thành công (0-100)
}
```

## API Endpoints:

### CRUD cơ bản:
- `POST /profiles` - Tạo profile mới
- `GET /profiles` - Lấy danh sách profile của user (sắp xếp theo thời gian, mới nhất trước)
- `GET /profiles/:id` - Lấy chi tiết profile theo ID
- `PATCH /profiles/:id` - Cập nhật profile theo ID (bao gồm chỉ số Inbody)
- `DELETE /profiles/:id` - Xóa profile theo ID

### Chức năng đặc biệt:
- `GET /profiles/latest` - Lấy profile mới nhất của user
- `GET /profiles/compare/:profile1Id/:profile2Id` - So sánh 2 profile tại các thời điểm khác nhau
- `GET /profiles/trends` - Phân tích xu hướng thay đổi (AI xử lý)
- `GET /profiles/charts` - Dữ liệu lịch sử cho biểu đồ tiến độ theo thời gian

## Hướng dẫn sử dụng module Profile

### 1. Mục đích
Module Profile giúp người dùng lưu trữ, cập nhật, theo dõi và so sánh các chỉ số sức khỏe của bản thân theo từng thời điểm. Qua đó, người dùng có thể đặt mục tiêu, theo dõi tiến độ cải thiện và nhận tư vấn cá nhân hóa từ AI.

### 2. Các bước thao tác điển hình
- **Tạo profile mới**: Khi có chỉ số mới (sau khi đo Inbody hoặc cập nhật thông tin), người dùng tạo một profile mới để lưu lại trạng thái sức khỏe tại thời điểm đó.
- **Cập nhật profile**: Nếu cần chỉnh sửa thông tin cá nhân hoặc bổ sung chỉ số, có thể cập nhật profile hiện tại.
- **Xem danh sách profile**: Lấy toàn bộ lịch sử profile để xem lại quá trình thay đổi.
- **So sánh profile**: Chọn 2 profile bất kỳ để so sánh sự thay đổi các chỉ số sức khỏe.
- **Phân tích xu hướng**: Xem biểu đồ, báo cáo tiến độ cải thiện qua các profile (AI xử lý).

### 3. Ví dụ gọi API
- **Tạo profile mới**:
  - `POST /profiles`
  - Body mẫu:
    ```json
    {
      "firstName": "Nguyễn",
      "lastName": "Văn A",
      "age": 25,
      "height": 170,
      "weight": 65,
      "gender": "Male",
      "activityLevel": "ModeratelyActive",
      "goalType": "WeightLoss",
      "personalGoals": ["Giảm mỡ bụng", "Tăng cơ tay"],
      "bodyFatPercentage": 18.5,
      "skeletalMuscleMass": 32.0,
      "totalBodyWater": 45.2,
      "visceralFatLevel": 7,
      "medicalConditions": ["Cao huyết áp"],
      "notes": "Đo sau kỳ nghỉ Tết"
    }
    ```
- **Lấy danh sách profile**:
  - `GET /profiles`
- **Lấy profile mới nhất**:
  - `GET /profiles/latest`
- **Xem chi tiết profile**:
  - `GET /profiles/:id`
- **So sánh 2 profile**:
  - `GET /profiles/compare/:profile1Id/:profile2Id`
- **Lấy dữ liệu biểu đồ**:
  - `GET /profiles/charts`
- **Phân tích xu hướng**:
  - `GET /profiles/trends`

### 4. Gợi ý workflow thực tế
1. Người dùng đo chỉ số cơ thể định kỳ (ví dụ mỗi tháng 1 lần).
2. Sau mỗi lần đo, tạo profile mới để lưu lại trạng thái sức khỏe.
3. Định kỳ so sánh profile hiện tại với các mốc trước đó để đánh giá tiến độ.
4. Sử dụng chức năng phân tích xu hướng để xem biểu đồ thay đổi các chỉ số (cân nặng, mỡ, cơ, nước...).
5. Đặt mục tiêu mới dựa trên kết quả so sánh và nhận tư vấn từ AI nếu cần.

### 5. Tích hợp với AI Module
- **Tính toán chỉ số lý tưởng**: AI sẽ tính toán idealWeight, idealBodyFatPercentage, idealMuscleMass dựa trên profile và mục tiêu cá nhân
- **Đánh giá sức khỏe**: AI phân tích tổng hợp để đưa ra healthAssessment
- **Tư vấn dinh dưỡng**: AI đưa ra khuyến nghị cụ thể dựa trên chỉ số hiện tại và mục tiêu cá nhân
- **Phân tích xu hướng**: AI dự đoán và phân tích thay đổi theo thời gian
- **Tạo kế hoạch cải thiện**: AI tạo lộ trình cụ thể để đạt mục tiêu cá nhân

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