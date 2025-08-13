# 🤖 9. AI Personal Trainer & Nutritionist

## Chức năng chính:

### 1. Phân tích profile và đánh giá sức khỏe:
- **Phân tích chỉ số Inbody**: Đánh giá tất cả chỉ số từ cân Inbody
- **Đánh giá tình trạng sức khỏe**: Phân loại tình trạng sức khỏe tổng thể
- **Xác định loại hình cơ thể**: Phân tích Ectomorph, Mesomorph, Endomorph
- **So sánh với chuẩn**: Đánh giá chỉ số so với chuẩn theo tuổi/giới tính
- **Phát hiện vấn đề**: Nhận diện các vấn đề sức khỏe tiềm ẩn

### 2. Gợi ý mục tiêu thông minh:
- **Phân tích đa chiều**: Kết hợp BMI, mỡ, cơ, mỡ nội tạng để đưa ra gợi ý
- **Gợi ý cá nhân hóa**: Dựa trên tuổi, giới tính, lịch sử sức khỏe
- **Đề xuất đa mục tiêu**: Gợi ý nhiều mục tiêu có thể thực hiện cùng lúc
- **Tính toán thời gian**: Ước tính thời gian cần thiết để đạt mục tiêu
- **Đánh giá độ khó**: Phân loại mục tiêu theo mức độ khó khăn
- **Dự đoán tỷ lệ thành công**: Dựa trên dữ liệu người dùng tương tự

## Tham số đầu vào:

### 1. Thông tin profile hiện tại:
- **Thông tin cá nhân**: Tuổi, giới tính, chiều cao, cân nặng
- **Chỉ số Inbody đầy đủ**: 
  - Cân nặng, tỷ lệ mỡ cơ thể, khối lượng cơ bắp
  - Chỉ số nước (TBW, ICW, ECW), mỡ nội tạng
  - BMI, FFMI, BMR, TDEE
- **Mức độ hoạt động**: Từ SEDENTARY đến EXTREMELY_ACTIVE
- **Tình trạng sức khỏe**: Bệnh lý, dị ứng, hạn chế ăn uống

### 2. Lịch sử sức khỏe (nếu có):
- **Profile lịch sử**: Các profile trước đó để phân tích xu hướng
- **Mục tiêu đã thực hiện**: Lịch sử các mục tiêu và kết quả
- **Thành công/Thất bại**: Pattern thành công và thất bại

## Kết quả AI trả về:

### 1. Phân tích profile:
```typescript
{
  healthAssessment: {
    overallHealth: 'GOOD' | 'AVERAGE' | 'NEEDS_IMPROVEMENT';
    bodyType: 'ECTOMORPH' | 'MESOMORPH' | 'ENDOMORPH';
    healthScore: number; // 0-100
    
    // Phân tích từng chỉ số
    weightAnalysis: {
      status: 'UNDERWEIGHT' | 'NORMAL' | 'OVERWEIGHT' | 'OBESE';
      recommendation: string;
      riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    };
    
    bodyFatAnalysis: {
      status: 'LOW' | 'NORMAL' | 'HIGH' | 'VERY_HIGH';
      recommendation: string;
      healthRisks: string[];
    };
    
    muscleAnalysis: {
      status: 'LOW' | 'NORMAL' | 'HIGH';
      recommendation: string;
      potential: string;
    };
    
    visceralFatAnalysis: {
      status: 'LOW' | 'NORMAL' | 'HIGH';
      recommendation: string;
      healthRisks: string[];
    };
  };
  
  // So sánh với chuẩn
  comparisonWithStandards: {
    ageGroup: string;
    genderGroup: string;
    percentile: number; // 0-100
    ranking: 'BOTTOM_25%' | '25-50%' | '50-75%' | 'TOP_25%';
  };
  
  // Phát hiện vấn đề
  healthIssues: {
    immediate: string[];    // Vấn đề cần giải quyết ngay
    longTerm: string[];    // Vấn đề cần theo dõi
    recommendations: string[]; // Khuyến nghị cải thiện
  };
}
```

### 2. Gợi ý mục tiêu:
```typescript
{
  suggestedGoals: [
    {
      id: string;
      name: string;                    // "Giảm cân an toàn"
      goalType: GoalType;              // LOSE_WEIGHT
      description: string;             // "Dựa trên BMI hiện tại, bạn nên giảm 5kg"
      priority: number;                // 1 (cao nhất)
      estimatedDuration: number;       // 12 tuần
      difficulty: 'EASY' | 'MEDIUM' | 'HARD';
      successRate: number;             // 85% (dựa trên dữ liệu người dùng tương tự)
      
      // Mục tiêu cụ thể
      targets: {
        weight?: number;               // 60kg
        bodyFat?: number;              // 15%
        muscleMass?: number;           // 30kg
        visceralFat?: number;          // 5
      };
      
      // Kế hoạch dinh dưỡng
      nutritionPlan: {
        targetCalories: number;
        targetProtein: number;
        targetCarbs: number;
        targetFats: number;
        targetWater: number;
        mealTiming: string[];
        foodRecommendations: string[];
        restrictions: string[];
      };
      
      // Kế hoạch tập luyện
      exercisePlan: {
        frequency: string;             // "3x/tuần"
        duration: string;              // "45 phút"
        intensity: string;             // "Trung bình"
        exercises: string[];           // ["Cardio", "Strength training"]
        equipment: string[];           // ["Tại nhà", "Gym"]
        progression: string;           // "Tăng dần độ khó"
      };
      
      // Lý do gợi ý
      reasoning: {
        healthFactors: string[];       // ["BMI cao", "Mỡ nội tạng cao"]
        benefits: string[];            // ["Giảm nguy cơ tim mạch", "Tăng sức khỏe"]
        risks: string[];               // ["Cần kiên trì", "Thời gian dài"]
      };
      
      // Cảnh báo và lưu ý
      warnings: string[];
      notes: string[];
    }
  ];
  
  // Tùy chọn tạo mục tiêu tùy chỉnh
  customGoalOption: {
    description: string;               // "Hoặc tạo mục tiêu tùy chỉnh"
    allowCustom: boolean;              // true
    guidance: string;                  // "Hướng dẫn tạo mục tiêu tùy chỉnh"
  };
  
  // Thông tin tổng quan
  summary: {
    totalSuggestions: number;
    primaryGoal: string;
    estimatedTimeline: string;
    overallSuccessRate: number;
  };
}
```

## API Endpoints:

### AI Module:
- `GET /ai/suggested-goals` - Lấy gợi ý mục tiêu (dinh dưỡng + tập luyện + lối sống)

## Nguyên tắc gợi ý mục tiêu:

### 1. Gợi ý dựa trên BMI:
- **BMI < 18.5**: Gợi ý GAIN_WEIGHT, BUILD_MUSCLE
- **BMI 18.5-24.9**: Gợi ý MAINTAIN_WEIGHT, BUILD_MUSCLE, IMPROVE_HEALTH
- **BMI 25-29.9**: Gợi ý LOSE_WEIGHT, BUILD_MUSCLE
- **BMI > 30**: Gợi ý LOSE_WEIGHT, IMPROVE_HEALTH

### 2. Gợi ý dựa trên tỷ lệ mỡ:
- **Nam > 20%**: Gợi ý LOSE_WEIGHT (giảm mỡ)
- **Nữ > 28%**: Gợi ý LOSE_WEIGHT (giảm mỡ)
- **Nam < 10%**: Gợi ý BUILD_MUSCLE (tăng cơ)
- **Nữ < 18%**: Gợi ý BUILD_MUSCLE (tăng cơ)

### 3. Gợi ý dựa trên mỡ nội tạng:
- **Visceral Fat > 10**: Gợi ý LOSE_WEIGHT, IMPROVE_HEALTH
- **Visceral Fat < 5**: Gợi ý BUILD_MUSCLE, MAINTAIN_WEIGHT

### 4. Gợi ý dựa trên cơ bắp:
- **SMM Index < chuẩn**: Gợi ý BUILD_MUSCLE
- **SMM Index > chuẩn**: Gợi ý MAINTAIN_WEIGHT, IMPROVE_HEALTH

## Tích hợp với các module:

### Profile Module:
- **Input**: Nhận profile hiện tại để phân tích
- **Output**: Đánh giá sức khỏe và gợi ý mục tiêu

### Goals Module:
- **Input**: Cung cấp gợi ý mục tiêu
- **Output**: Tạo mục tiêu từ gợi ý AI

### Dashboard Module:
- **Input**: Cung cấp đánh giá sức khỏe
- **Output**: Hiển thị insights và khuyến nghị

## Cấu trúc thư mục:
```
src/ai/
├── ai.controller.ts
├── ai.module.ts
├── ai.service.ts
├── entities/
│   └── ai-cache.entity.ts
└── dto/
    ├── analyze-profile.dto.ts
    ├── suggest-goals.dto.ts
    └── health-assessment.dto.ts
```

## Database Schema:
- **ai_cache**: Cache kết quả phân tích để tối ưu hiệu suất 
  - userId: number
  - cacheType: string (profile_analysis, goal_suggestions)
  - data: jsonb
  - expiresAt: timestamp
  - createdAt: timestamp

## Hướng dẫn sử dụng:

### 1. Lấy gợi ý mục tiêu:
- Gọi API `GET /ai/suggested-goals` (userId lấy từ JWT)
- Nhận gợi ý mục tiêu dinh dưỡng, tập luyện và lối sống
- Xem đánh giá sức khỏe và khuyến nghị

### 2. Tạo mục tiêu từ gợi ý:
- Chọn gợi ý phù hợp từ danh sách AI đề xuất
- Gọi API `POST /goals` với dữ liệu từ gợi ý AI
- Bắt đầu thực hiện kế hoạch

### 3. Theo dõi và điều chỉnh:
- Định kỳ lấy gợi ý mới khi có profile mới
- Cập nhật mục tiêu theo khuyến nghị AI
- Điều chỉnh kế hoạch nếu cần 