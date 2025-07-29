# Cấu hình AI cho NutriWise

## Tổng quan

NutriWise sử dụng OpenAI GPT-4o để cung cấp các gợi ý dinh dưỡng và tập luyện thông minh. Hệ thống được thiết kế để tối ưu hóa chi phí và hiệu suất thông qua cache và fallback system.

## Các biến môi trường AI

### OpenAI Configuration
```env
# API Key cho OpenAI
OPENAI_API_KEY=your-openai-api-key

# Model AI sử dụng (mặc định: gpt-4o)
OPENAI_MODEL=gpt-4o

# Số token tối đa cho mỗi request (mặc định: 2000)
OPENAI_MAX_TOKENS=2000

# Nhiệt độ cho AI (0.0-1.0, mặc định: 0.7)
OPENAI_TEMPERATURE=0.7

# System prompt cho AI
OPENAI_SYSTEM_PROMPT=Bạn là chuyên gia dinh dưỡng và thể dục. Hãy đưa ra lời khuyên cá nhân hóa, chính xác và có thể thực hiện được dựa trên dữ liệu người dùng. Trả về phản hồi bằng tiếng Việt và định dạng JSON hợp lệ.
```

### Cache Configuration
```env
# Bật/tắt cache AI (mặc định: true)
AI_CACHE_ENABLED=true

# Thời gian cache hết hạn (giờ, mặc định: 24)
AI_CACHE_EXPIRY_HOURS=24
```

## Cách hoạt động

### 1. AI Processing Flow
1. **Input Data Collection**: Thu thập dữ liệu người dùng (profile, preferences, available foods)
2. **Cache Check**: Kiểm tra cache trước khi gọi AI
3. **AI Processing**: Gửi request đến OpenAI GPT-4o
4. **Response Processing**: Xử lý và validate response từ AI
5. **Cache Storage**: Lưu kết quả vào cache
6. **Fallback**: Sử dụng tính toán dự phòng nếu AI không khả dụng

### 2. Cache System
- **Purpose**: Tiết kiệm chi phí API và tăng tốc độ response
- **Storage**: PostgreSQL database
- **Expiry**: Có thể cấu hình thời gian hết hạn
- **Management**: Có thể refresh cache thủ công

### 3. Fallback System
- **Purpose**: Đảm bảo hệ thống hoạt động khi AI không khả dụng
- **Logic**: Sử dụng các thuật toán dinh dưỡng cơ bản
- **Quality**: Kết quả đơn giản nhưng đáng tin cậy

## API Endpoints

### AI Services
- `GET /ai/exercise-goals` - Mục tiêu tập luyện AI
- `GET /ai/nutrition-goals` - Mục tiêu dinh dưỡng AI
- `GET /ai/progress-analysis` - Phân tích tiến độ AI
- `GET /ai/weekly-meal-plan` - Kế hoạch ăn uống AI
- `GET /ai/smart-meal-suggestion/:mealType` - Gợi ý bữa ăn thông minh

### Cache Management
- `POST /ai/refresh-cache` - Làm mới cache AI
- `GET /ai/cache-stats` - Thống kê cache
- `GET /ai/gpt-status` - Trạng thái GPT và cấu hình

## Chi phí ước tính

### GPT-4o Pricing
- **Input**: $5.00 per 1M tokens
- **Output**: $15.00 per 1M tokens
- **Average cost per request**: ~$0.01-0.05

### Tối ưu hóa chi phí
1. **Cache System**: Giảm 80-90% số lượng API calls
2. **Token Optimization**: Sử dụng max_tokens phù hợp
3. **Fallback System**: Giảm dependency vào AI
4. **Batch Processing**: Xử lý nhiều request cùng lúc

## Monitoring

### Cache Statistics
```sql
-- Xem thống kê cache theo user
SELECT 
  request_type,
  COUNT(*) as total_requests,
  SUM(CASE WHEN is_from_gpt = true THEN 1 ELSE 0 END) as gpt_requests,
  SUM(cost_usd) as total_cost,
  AVG(tokens_used) as avg_tokens
FROM ai_cache 
WHERE user_id = ? AND is_expired = false
GROUP BY request_type;
```

### Performance Metrics
- **Response Time**: < 2s cho cached responses
- **Cache Hit Rate**: > 80%
- **Cost per User**: < $0.10/tháng
- **Uptime**: > 99.9%

## Troubleshooting

### Common Issues

1. **AI không hoạt động**
   - Kiểm tra `OPENAI_API_KEY`
   - Kiểm tra kết nối internet
   - Xem logs để debug

2. **Cache không hoạt động**
   - Kiểm tra `AI_CACHE_ENABLED`
   - Kiểm tra database connection
   - Xem cache statistics

3. **Chi phí cao**
   - Giảm `OPENAI_MAX_TOKENS`
   - Tăng `AI_CACHE_EXPIRY_HOURS`
   - Tối ưu prompts

### Debug Commands
```bash
# Kiểm tra trạng thái AI
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4001/ai/gpt-status

# Xem thống kê cache
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4001/ai/cache-stats

# Refresh cache
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4001/ai/refresh-cache
```

## Best Practices

1. **Environment Variables**: Luôn sử dụng env variables cho configuration
2. **Error Handling**: Luôn có fallback khi AI không khả dụng
3. **Monitoring**: Theo dõi chi phí và performance
4. **Security**: Không expose API keys trong code
5. **Testing**: Test với cả AI và fallback modes 