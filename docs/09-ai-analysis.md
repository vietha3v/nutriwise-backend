# AI Analysis Module

## Tổng quan

Module AI Analysis cung cấp khả năng phân tích dữ liệu thông minh dựa trên OpenAI GPT để đưa ra insights chi tiết về sức khỏe và dinh dưỡng. Module này hoạt động theo nguyên tắc đơn giản: **lưu data → gửi OpenAI → trả kết quả**.

## Kiến trúc

### Luồng xử lý AI Analysis
```
1. Thu thập dữ liệu từ WaterService và ProfileService
2. Chuẩn bị data cho OpenAI
3. Gửi data lên OpenAI với prompt phù hợp
4. Nhận response từ OpenAI
5. Trả về kết quả phân tích cho frontend
```

### Các thành phần chính
- **AiAnalysisService**: Xử lý logic gửi data lên OpenAI
- **AiAnalysisController**: API endpoints cho các loại phân tích
- **OpenAI Integration**: Tích hợp trực tiếp với OpenAI API

## API Endpoints

### 1. Water Analysis
**Endpoint:** `GET /ai-analysis/water-analysis`

**Mô tả:** Phân tích thói quen uống nước và đưa ra insights chi tiết

**Parameters:**
- `period` (query): `'day' | 'week'` - Thời gian phân tích

**Response:**
```json
{
  "period": "day",
  "analysis": {
    "totalIntake": 1500,
    "averagePerDay": 1500,
    "goalAchievement": 75.0,
    "consistency": "GOOD",
    "hydrationScore": 75.0
  },
  "patterns": {
    "bestTime": "Sáng sớm và trước bữa ăn",
    "worstTime": "Buổi tối muộn",
    "frequency": "5 lần/ngày",
    "interval": 288
  },
  "recommendations": [
    {
      "type": "IMMEDIATE",
      "priority": 5,
      "title": "Tăng lượng nước ngay lập tức",
      "description": "Bạn cần uống thêm nước để đạt mục tiêu hàng ngày",
      "actionable": true
    }
  ],
  "insights": [
    "Bạn đã uống 1500ml nước trong ngày hôm nay",
    "Mục tiêu hàng ngày: 2000ml",
    "Còn thiếu: 500ml để đạt mục tiêu"
  ],
  "dataSummary": {
    "waterData": {...},
    "profile": {...}
  },
  "generatedAt": "2024-01-15T10:30:00.000Z",
  "aiModel": "gpt-4o"
}
```

### 2. Profile Analysis
**Endpoint:** `GET /ai-analysis/profile-analysis`

**Mô tả:** Phân tích profile sức khỏe người dùng và đánh giá tình trạng

**Parameters:**
- `forceRefresh` (query): `boolean` - Buộc làm mới cache

**Response:**
```json
{
  "analysis": {
    "healthAssessment": {
      "overallHealth": "GOOD",
      "bodyType": "MESOMORPH",
      "healthScore": 85,
      "weightAnalysis": {
        "status": "NORMAL",
        "recommendation": "Duy trì cân nặng hiện tại",
        "bmi": 22.5
      },
      "bodyFatAnalysis": {
        "status": "NORMAL",
        "recommendation": "Duy trì tỷ lệ mỡ cơ thể hiện tại",
        "bodyFat": 15.0
      },
      "muscleAnalysis": {
        "status": "AVAILABLE",
        "recommendation": "Duy trì và phát triển khối lượng cơ",
        "muscleMass": 45.0
      },
      "visceralFatAnalysis": {
        "status": "NORMAL",
        "recommendation": "Duy trì mức mỡ nội tạng hiện tại",
        "visceralFat": 8.0
      }
    },
    "comparisonWithStandards": {
      "ageGroup": "ADULT",
      "genderGroup": "MALE",
      "percentile": 85,
      "ranking": "TOP_25%"
    },
    "healthIssues": {
      "immediate": [],
      "longTerm": [],
      "recommendations": []
    }
  },
  "dataSummary": {
    "profile": {...}
  },
  "generatedAt": "2024-01-15T10:30:00.000Z",
  "aiModel": "gpt-4o"
}
```

### 3. Hydration Expert Analysis
**Endpoint:** `GET /ai-analysis/hydration-expert-analysis`

**Mô tả:** Phân tích chuyên gia dinh dưỡng về tác động của nước lên profile

**Parameters:**
- `period` (query): `'week' | 'month'` - Thời gian phân tích
- `analysisType` (query): `'comprehensive' | 'focused'` - Loại phân tích

**Response:**
```json
{
  "period": "month",
  "analysisType": "comprehensive",
  "expertAnalysis": {
    "title": "Tác động của Hydration lên Sức khỏe và Hiệu suất",
    "summary": "Phân tích chuyên sâu về mối liên hệ giữa thói quen uống nước và các chỉ số sức khỏe",
    "detailedReport": "Báo cáo chi tiết về tác động của hydration...",
    "keyInsights": [
      "Hydration ảnh hưởng trực tiếp đến hiệu suất tập luyện",
      "Thiếu nước làm giảm khả năng phục hồi cơ bắp",
      "Uống đủ nước hỗ trợ quá trình trao đổi chất"
    ],
    "healthImpact": {
      "weightManagement": "Nước đóng vai trò quan trọng trong quản lý cân nặng...",
      "muscleDevelopment": "Hydration cần thiết cho sự phát triển cơ bắp...",
      "metabolism": "Nước thúc đẩy quá trình trao đổi chất...",
      "energyLevels": "Mất nước làm giảm năng lượng...",
      "skinHealth": "Hydration cải thiện sức khỏe làn da..."
    },
    "recommendations": {
      "immediate": [
        "Tăng lượng nước uống ngay lập tức",
        "Đặt nhắc nhở uống nước"
      ],
      "shortTerm": [
        "Thiết lập thói quen uống nước đều đặn",
        "Theo dõi lượng nước hàng ngày"
      ],
      "longTerm": [
        "Duy trì thói quen hydration tốt",
        "Kết hợp với chế độ dinh dưỡng cân bằng"
      ]
    },
    "scientificEvidence": [
      "Nghiên cứu cho thấy mất 2% nước làm giảm 10% hiệu suất thể thao",
      "Hydration đầy đủ thúc đẩy quá trình trao đổi chất lên 30%"
    ],
    "nextSteps": [
      "Tăng lượng nước uống lên 2500ml/ngày",
      "Uống nước trước, trong và sau khi tập luyện",
      "Theo dõi màu sắc nước tiểu để đánh giá hydration"
    ],
    "tokensUsed": 1250,
    "costUsd": 0.0375
  },
  "dataSummary": {
    "waterStats": {...},
    "profile": {...}
  },
  "generatedAt": "2024-01-15T10:30:00.000Z",
  "aiModel": "gpt-4o"
}
```

### 4. GPT Status
**Endpoint:** `GET /ai-analysis/gpt-status`

**Mô tả:** Kiểm tra trạng thái tích hợp GPT

**Response:**
```json
{
  "isAvailable": true,
  "message": "Tích hợp GPT có sẵn",
  "config": {
    "model": "gpt-4o",
    "maxTokens": "2000",
    "temperature": "0.7"
  }
}
```

## Cấu hình

### Environment Variables
```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7
```

### AI Configuration
- **Model**: GPT-4o (mặc định) hoặc GPT-3.5-turbo
- **Max Tokens**: 2000 (có thể tăng lên 4000 cho phân tích chuyên gia)
- **Temperature**: 0.7 (cân bằng giữa sáng tạo và chính xác)

## Luồng xử lý chi tiết

### 1. Water Analysis Flow
```
1. Lấy dữ liệu nước từ WaterService (getTodayProgress/getWeeklyStats)
2. Lấy profile người dùng từ ProfileService
3. Chuẩn bị data cho OpenAI
4. Gửi prompt "water_analysis" lên OpenAI
5. Nhận response và trả về kết quả
```

### 2. Profile Analysis Flow
```
1. Lấy profile người dùng từ ProfileService
2. Chuẩn bị data cho OpenAI
3. Gửi prompt "profile_analysis" lên OpenAI
4. Nhận response và trả về kết quả
```

### 3. Hydration Expert Analysis Flow
```
1. Lấy dữ liệu nước từ WaterService (getWeeklyStats/getMonthlyStats)
2. Lấy profile người dùng từ ProfileService
3. Chuẩn bị data cho OpenAI
4. Gửi prompt "hydration_expert_analysis" lên OpenAI
5. Nhận response và trả về kết quả
```

## Prompt Templates

### Water Analysis Prompt
```
Phân tích thói quen uống nước dựa trên dữ liệu:
- Thời gian: {period}
- Dữ liệu nước: {waterData}
- Profile: {profile}

Hãy phân tích và đưa ra lời khuyên chi tiết.
```

### Profile Analysis Prompt
```
Phân tích profile sức khỏe dựa trên dữ liệu:
- Profile: {profile}

Hãy đánh giá tình trạng sức khỏe và đưa ra khuyến nghị.
```

### Hydration Expert Analysis Prompt
```
Phân tích chuyên sâu tác động của hydration lên sức khỏe:
- Thời gian: {period}
- Loại phân tích: {analysisType}
- Dữ liệu nước: {waterStats}
- Profile: {profile}

Hãy tạo bài phân tích chuyên gia chi tiết.
```

## Error Handling

### OpenAI Errors
- **API Key Missing**: Trả về lỗi "OpenAI không được khởi tạo"
- **Network Error**: Log lỗi và trả về thông báo lỗi
- **Invalid Response**: Xử lý JSON parsing errors

### Data Errors
- **Profile Not Found**: Trả về lỗi "Không tìm thấy profile người dùng"
- **Water Data Missing**: Trả về lỗi "Không có dữ liệu nước"

## Monitoring & Analytics

### Metrics
- **Token Usage**: Theo dõi số token sử dụng
- **Cost Tracking**: Tính toán chi phí OpenAI
- **Response Time**: Đo thời gian phản hồi
- **Analysis Accuracy**: Đánh giá độ chính xác của phân tích

### Logging
- **Request Logs**: Log tất cả requests
- **Error Logs**: Log các lỗi OpenAI
- **Performance Logs**: Log thời gian xử lý

## Best Practices

### Performance
- Tối ưu prompt để giảm token usage
- Sử dụng model phù hợp với từng loại phân tích
- Implement caching cho kết quả phân tích

### Security
- Validate input data trước khi gửi OpenAI
- Sanitize response data
- Rate limiting cho API calls

### Cost Optimization
- Sử dụng model phù hợp với use case
- Tối ưu prompt length
- Monitor token usage

## Use Cases

### 1. Water Analysis Use Cases
- **Daily Hydration Check**: Kiểm tra lượng nước uống hàng ngày
- **Weekly Progress Review**: Đánh giá tiến độ uống nước trong tuần
- **Hydration Pattern Analysis**: Phân tích mô hình uống nước

### 2. Profile Analysis Use Cases
- **Health Assessment**: Đánh giá tổng quan sức khỏe
- **Body Composition Analysis**: Phân tích thành phần cơ thể
- **Health Risk Identification**: Xác định rủi ro sức khỏe

### 3. Expert Analysis Use Cases
- **Comprehensive Health Report**: Báo cáo sức khỏe toàn diện
- **Nutritional Guidance**: Hướng dẫn dinh dưỡng
- **Lifestyle Recommendations**: Khuyến nghị lối sống

## Future Enhancements

### Planned Features
- **Multi-language Support**: Hỗ trợ nhiều ngôn ngữ
- **Custom Analysis Types**: Cho phép tùy chỉnh loại phân tích
- **Batch Analysis**: Phân tích hàng loạt
- **Real-time Analysis**: Phân tích real-time

### Integration Opportunities
- **Notification System**: Gửi thông báo dựa trên phân tích
- **Goal Tracking**: Theo dõi mục tiêu dựa trên AI recommendations
- **Progress Visualization**: Hiển thị tiến độ qua biểu đồ 