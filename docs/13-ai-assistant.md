# AI Assistant Module

## Tổng quan

Module AI Assistant cung cấp khả năng tương tác thông minh với người dùng thông qua AI để hiểu ý định và thực hiện các hành động trong hệ thống NutriWise.

## Workflow AI-based

### Quy trình xử lý:
1. **User gửi tin nhắn** → AI nhận message + context
2. **AI phân tích** → Trả về JSON structured response
3. **System xử lý** → Dựa trên AI response để thực hiện hành động
4. **Response** → Trả về phản hồi tự nhiên cho user

### JSON Response Structure từ AI:
```json
{
  "intent": "add_meal",
  "confidence": 0.95,
  "userIntent": "Người dùng muốn ghi nhận bữa ăn",
  "requiredInfo": {
    "action": "ADD_MEAL",
    "requiredParams": ["mealType", "foods"],
    "providedParams": {"mealType": "lunch", "foods": ["cơm", "thịt kho"]},
    "missingParams": ["amount", "time"],
    "smartQuestions": ["Bạn ăn bao nhiêu?", "Ăn lúc mấy giờ?"]
  },
  "contextualResponse": "Tôi đã ghi nhận bữa trưa với cơm và thịt kho. Bạn ăn bao nhiêu và lúc mấy giờ vậy?",
  "nextActions": ["collect_info", "confirm_action"]
}
```

## Danh sách các action AI có thể thực hiện

### Cấu trúc định nghĩa action:
```typescript
interface ActionDefinition {
  action: string;                    // Tên action
  description: string;               // Mô tả chức năng
  requiredParams: ParamDefinition[]; // Thông tin cần thu thập
  optionalParams: ParamDefinition[]; // Thông tin tùy chọn
  confirmationRequired: boolean;     // Cần xác nhận trước khi thực hiện
}

interface ParamDefinition {
  name: string;                      // Tên tham số
  type: 'string' | 'number' | 'enum' | 'date';
  description: string;               // Mô tả tham số
  required: boolean;                 // Bắt buộc hay không
  validation?: ValidationRule[];     // Quy tắc kiểm tra
}
```

### Danh sách các action:

#### 1. UPDATE_PROFILE
**Mô tả:** Cập nhật thông tin cá nhân và thể chất

**Thông tin cần thu thập:**
- `name` (string, optional): Tên người dùng
- `age` (number, optional): Tuổi (1-120)
- `gender` (enum: "male"|"female", optional): Giới tính
- `height` (number, optional): Chiều cao (cm, 50-300)
- `weight` (number, optional): Cân nặng (kg, 20-500)
- `activityLevel` (enum: "sedentary"|"light"|"moderate"|"active"|"very_active", optional): Mức độ hoạt động
- `email` (string, optional): Email
- `phone` (string, optional): Số điện thoại
- `birthDate` (date, optional): Ngày sinh
- `targetWeight` (number, optional): Cân nặng mục tiêu
- `medicalConditions` (string[], optional): Tình trạng sức khỏe
- `allergies` (string[], optional): Dị ứng thực phẩm
- `dietaryRestrictions` (string[], optional): Hạn chế ăn uống

**Cần xác nhận:** Có

#### 2. ADD_MEAL
**Mô tả:** Ghi nhận thông tin về bữa ăn đã ăn

**Thông tin cần thu thập:**
- `mealType` (enum: "breakfast"|"lunch"|"dinner"|"snack", required): Loại bữa ăn
- `foods` (string[], required): Danh sách thực phẩm
- `amount` (string, optional): Lượng ăn
- `time` (date, optional): Thời gian ăn
- `calories` (number, optional): Tổng calo
- `protein` (number, optional): Protein (g)
- `carbs` (number, optional): Carbohydrate (g)
- `fat` (number, optional): Chất béo (g)
- `fiber` (number, optional): Chất xơ (g)
- `sugar` (number, optional): Đường (g)
- `sodium` (number, optional): Natri (mg)
- `location` (string, optional): Địa điểm ăn
- `mood` (enum: "great"|"good"|"okay"|"bad", optional): Tâm trạng khi ăn
- `notes` (string, optional): Ghi chú

**Cần xác nhận:** Không

#### 3. UPDATE_MEAL
**Mô tả:** Cập nhật thông tin bữa ăn

**Thông tin cần thu thập:**
- `mealId` (number, required): ID bữa ăn
- `mealType` (enum: "breakfast"|"lunch"|"dinner"|"snack", optional): Loại bữa ăn
- `foods` (string[], optional): Danh sách thực phẩm
- `amount` (string, optional): Lượng ăn
- `time` (date, optional): Thời gian ăn

**Cần xác nhận:** Có

#### 4. DELETE_MEAL
**Mô tả:** Xóa bữa ăn

**Thông tin cần thu thập:**
- `mealId` (number, required): ID bữa ăn

**Cần xác nhận:** Có

#### 5. VIEW_MEALS
**Mô tả:** Xem danh sách bữa ăn

**Thông tin cần thu thập:**
- `date` (date, optional): Ngày cụ thể
- `mealType` (enum: "breakfast"|"lunch"|"dinner"|"snack", optional): Loại bữa ăn
- `limit` (number, optional): Số lượng (mặc định: 10)

**Cần xác nhận:** Không

#### 6. CREATE_GOAL
**Mô tả:** Tạo mục tiêu về cân nặng, dinh dưỡng hoặc tập luyện

**Thông tin cần thu thập:**
- `goalType` (enum: "weight_loss"|"weight_gain"|"maintain"|"muscle_gain"|"calorie_target"|"protein_target"|"water_target"|"exercise_frequency", required): Loại mục tiêu
- `targetValue` (number, required): Giá trị mục tiêu
- `timeframe` (string, optional): Thời gian thực hiện
- `description` (string, optional): Mô tả chi tiết
- `startDate` (date, optional): Ngày bắt đầu
- `endDate` (date, optional): Ngày kết thúc
- `priority` (enum: "low"|"medium"|"high", optional): Mức độ ưu tiên
- `reminderFrequency` (enum: "daily"|"weekly"|"monthly", optional): Tần suất nhắc nhở
- `milestones` (object[], optional): Các cột mốc quan trọng

**Cần xác nhận:** Có

#### 7. UPDATE_GOAL
**Mô tả:** Cập nhật mục tiêu

**Thông tin cần thu thập:**
- `goalId` (number, required): ID mục tiêu
- `targetValue` (number, optional): Giá trị mục tiêu
- `timeframe` (string, optional): Thời gian thực hiện
- `description` (string, optional): Mô tả chi tiết

**Cần xác nhận:** Có

#### 8. DELETE_GOAL
**Mô tả:** Xóa mục tiêu

**Thông tin cần thu thập:**
- `goalId` (number, required): ID mục tiêu

**Cần xác nhận:** Có

#### 9. VIEW_GOALS
**Mô tả:** Xem danh sách mục tiêu

**Thông tin cần thu thập:**
- `status` (enum: "active"|"completed"|"paused", optional): Trạng thái mục tiêu
- `goalType` (enum: "weight_loss"|"weight_gain"|"maintain"|"muscle_gain", optional): Loại mục tiêu

**Cần xác nhận:** Không

#### 10. ADD_WATER
**Mô tả:** Ghi nhận lượng nước đã uống trong ngày

**Thông tin cần thu thập:**
- `amount` (number, required): Lượng nước (ml)
- `time` (date, optional): Thời gian uống
- `waterType` (enum: "plain"|"mineral"|"filtered"|"bottled", optional): Loại nước
- `temperature` (enum: "cold"|"room"|"warm", optional): Nhiệt độ nước
- `container` (string, optional): Loại bình/chai
- `location` (string, optional): Địa điểm uống
- `notes` (string, optional): Ghi chú

**Cần xác nhận:** Không

#### 11. UPDATE_WATER
**Mô tả:** Cập nhật lượng nước

**Thông tin cần thu thập:**
- `waterId` (number, required): ID ghi nhận nước
- `amount` (number, optional): Lượng nước (ml)
- `time` (date, optional): Thời gian uống

**Cần xác nhận:** Có

#### 12. DELETE_WATER
**Mô tả:** Xóa ghi nhận nước

**Thông tin cần thu thập:**
- `waterId` (number, required): ID ghi nhận nước

**Cần xác nhận:** Có

#### 13. VIEW_WATER_HISTORY
**Mô tả:** Xem lịch sử uống nước

**Thông tin cần thu thập:**
- `date` (date, optional): Ngày cụ thể
- `limit` (number, optional): Số lượng (mặc định: 10)

**Cần xác nhận:** Không

#### 14. ADD_EXERCISE
**Mô tả:** Ghi nhận hoạt động thể dục, thể thao đã thực hiện

**Thông tin cần thu thập:**
- `exerciseType` (string, required): Loại bài tập
- `duration` (number, required): Thời gian (phút)
- `intensity` (enum: "low"|"medium"|"high", optional): Cường độ
- `calories` (number, optional): Calo tiêu thụ
- `distance` (number, optional): Khoảng cách (km)
- `steps` (number, optional): Số bước chân
- `heartRate` (number, optional): Nhịp tim (bpm)
- `location` (string, optional): Địa điểm tập
- `equipment` (string[], optional): Thiết bị sử dụng
- `workoutPlan` (string, optional): Kế hoạch tập luyện
- `mood` (enum: "great"|"good"|"okay"|"bad", optional): Tâm trạng khi tập
- `notes` (string, optional): Ghi chú
- `startTime` (date, optional): Thời gian bắt đầu
- `endTime` (date, optional): Thời gian kết thúc

**Cần xác nhận:** Không

#### 15. UPDATE_EXERCISE
**Mô tả:** Cập nhật bài tập

**Thông tin cần thu thập:**
- `exerciseId` (number, required): ID bài tập
- `exerciseType` (string, optional): Loại bài tập
- `duration` (number, optional): Thời gian (phút)
- `intensity` (enum: "low"|"medium"|"high", optional): Cường độ
- `calories` (number, optional): Calo tiêu thụ

**Cần xác nhận:** Có

#### 16. DELETE_EXERCISE
**Mô tả:** Xóa bài tập

**Thông tin cần thu thập:**
- `exerciseId` (number, required): ID bài tập

**Cần xác nhận:** Có

#### 17. VIEW_EXERCISES
**Mô tả:** Xem danh sách bài tập

**Thông tin cần thu thập:**
- `date` (date, optional): Ngày cụ thể
- `exerciseType` (string, optional): Loại bài tập
- `limit` (number, optional): Số lượng (mặc định: 10)

**Cần xác nhận:** Không

#### 18. VIEW_DASHBOARD
**Mô tả:** Hiển thị thông tin tổng quan về tình trạng dinh dưỡng và sức khỏe

**Thông tin cần thu thập:** Không cần

**Cần xác nhận:** Không

#### 19. VIEW_WEEKLY_REPORT
**Mô tả:** Xem báo cáo tuần

**Thông tin cần thu thập:**
- `weekStart` (date, optional): Ngày bắt đầu tuần

**Cần xác nhận:** Không

#### 20. SEARCH_FOOD
**Mô tả:** Tìm kiếm thực phẩm

**Thông tin cần thu thập:**
- `query` (string, required): Từ khóa tìm kiếm
- `limit` (number, optional): Số lượng kết quả (mặc định: 10)
- `category` (enum: "fruits"|"vegetables"|"meat"|"dairy"|"grains"|"nuts"|"beverages", optional): Danh mục thực phẩm
- `calorieRange` (object, optional): Khoảng calo {min, max}
- `proteinRange` (object, optional): Khoảng protein {min, max}
- `allergenFree` (string[], optional): Loại trừ dị ứng
- `dietaryRestrictions` (string[], optional): Hạn chế ăn uống
- `sortBy` (enum: "name"|"calories"|"protein"|"popularity", optional): Sắp xếp theo

**Cần xác nhận:** Không

#### 21. GET_MEAL_SUGGESTIONS
**Mô tả:** Lấy gợi ý bữa ăn thông minh

**Thông tin cần thu thập:**
- `mealType` (enum: "breakfast"|"lunch"|"dinner"|"snack", optional): Loại bữa ăn
- `preferences` (string[], optional): Sở thích thực phẩm
- `restrictions` (string[], optional): Hạn chế ăn uống
- `calorieTarget` (number, optional): Mục tiêu calo
- `proteinTarget` (number, optional): Mục tiêu protein
- `cookingTime` (enum: "quick"|"medium"|"long", optional): Thời gian nấu
- `difficulty` (enum: "easy"|"medium"|"hard", optional): Độ khó
- `cuisine` (string[], optional): Loại ẩm thực
- `ingredients` (string[], optional): Nguyên liệu có sẵn
- `budget` (enum: "low"|"medium"|"high", optional): Ngân sách
- `servings` (number, optional): Số người ăn
- `seasonal` (boolean, optional): Thực phẩm theo mùa

**Cần xác nhận:** Không

#### 22. GET_NUTRITION_ADVICE
**Mô tả:** Tư vấn dinh dưỡng

**Thông tin cần thu thập:**
- `topic` (string, optional): Chủ đề tư vấn
- `goal` (string, optional): Mục tiêu dinh dưỡng
- `age` (number, optional): Tuổi
- `gender` (enum: "male"|"female", optional): Giới tính
- `activityLevel` (enum: "sedentary"|"light"|"moderate"|"active"|"very_active", optional): Mức độ hoạt động
- `healthConditions` (string[], optional): Tình trạng sức khỏe
- `allergies` (string[], optional): Dị ứng
- `dietaryRestrictions` (string[], optional): Hạn chế ăn uống
- `currentWeight` (number, optional): Cân nặng hiện tại
- `targetWeight` (number, optional): Cân nặng mục tiêu
- `lifestyle` (enum: "busy"|"moderate"|"relaxed", optional): Lối sống
- `cookingSkill` (enum: "beginner"|"intermediate"|"advanced", optional): Kỹ năng nấu ăn

**Cần xác nhận:** Không

#### 23. GET_HEALTH_TIPS
**Mô tả:** Lời khuyên sức khỏe

**Thông tin cần thu thập:**
- `category` (string, optional): Danh mục lời khuyên
- `age` (number, optional): Tuổi
- `gender` (enum: "male"|"female", optional): Giới tính
- `healthGoals` (string[], optional): Mục tiêu sức khỏe
- `currentHealthStatus` (string[], optional): Tình trạng sức khỏe hiện tại
- `lifestyle` (enum: "sedentary"|"active"|"very_active", optional): Lối sống
- `stressLevel` (enum: "low"|"medium"|"high", optional): Mức độ căng thẳng
- `sleepQuality` (enum: "poor"|"fair"|"good"|"excellent", optional): Chất lượng giấc ngủ
- `dietType` (enum: "omnivore"|"vegetarian"|"vegan"|"keto"|"paleo", optional): Chế độ ăn
- `season` (enum: "spring"|"summer"|"autumn"|"winter", optional): Mùa trong năm
- `weather` (enum: "hot"|"warm"|"cool"|"cold", optional): Thời tiết

**Cần xác nhận:** Không

#### 24. HELP
**Mô tả:** Hiển thị hướng dẫn sử dụng và các chức năng có sẵn

**Thông tin cần thu thập:** Không cần

**Cần xác nhận:** Không

### Quy trình AI check action:

1. **Nhận tin nhắn** từ user
2. **AI phân tích** xem tin nhắn có liên quan đến action nào trong danh sách không
3. **Nếu có action:**
   - Xác định action cụ thể
   - Trích xuất thông tin có sẵn từ tin nhắn
   - Xác định thông tin còn thiếu
   - Trả về JSON response với action và requiredInfo
4. **Nếu không có action:**
   - Xử lý như chat bình thường
   - Trả về phản hồi tự nhiên, không có action

## Quy trình AI check action:

1. **Nhận tin nhắn** từ user
2. **AI phân tích** xem tin nhắn có liên quan đến action nào trong danh sách không
3. **Nếu có action:**
   - Xác định action cụ thể
   - Trích xuất thông tin có sẵn từ tin nhắn
   - Xác định thông tin còn thiếu
   - Trả về JSON response với action và requiredInfo
4. **Nếu không có action:**
   - Xử lý như chat bình thường
   - Trả về phản hồi tự nhiên, không có action

## Cấu hình

### Environment Variables
Sử dụng các biến môi trường có sẵn trong `.env`:
- `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_MAX_TOKENS`, `OPENAI_TEMPERATURE`
- `AI_CACHE_ENABLED`, `AI_CACHE_EXPIRY_HOURS`

### Developer Documentation
Chi tiết kỹ thuật được cung cấp trong Swagger documentation tại `/api-docs`
