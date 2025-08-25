# AI Assistant Module

## Tổng quan

Module AI Assistant cung cấp khả năng tương tác thông minh với người dùng thông qua chatbot, trả lời câu hỏi về dinh dưỡng, sức khỏe và đưa ra lời khuyên cá nhân hóa. Module này hoạt động theo nguyên tắc: **nhận câu hỏi → phân tích context → gửi OpenAI → trả lời thông minh**.

## Kiến trúc

### Luồng xử lý AI Assistant
```
1. Nhận câu hỏi từ người dùng
2. Phân tích context và lịch sử chat
3. Chuẩn bị prompt cho OpenAI
4. Gửi câu hỏi lên OpenAI
5. Nhận response và trả về câu trả lời
```

### Các thành phần chính
- **AiAssistantService**: Xử lý logic chat và tương tác
- **AiAssistantController**: API endpoints cho chat
- **ChatMessage Entity**: Lưu trữ lịch sử chat
- **OpenAI Integration**: Tích hợp trực tiếp với OpenAI API

## API Endpoints

### 1. Chat với AI Assistant
**Endpoint:** `POST /ai-assistant/chat`

**Mô tả:** Gửi tin nhắn và nhận phản hồi từ AI Assistant

**Request Body:**
```json
{
  "message": "Tôi nên uống bao nhiêu nước mỗi ngày?",
  "context": "nutrition_advice"
}
```

**Response:**
```json
{
  "id": "msg_123",
  "message": "Tôi nên uống bao nhiêu nước mỗi ngày?",
  "response": "Dựa trên thông tin của bạn, bạn nên uống khoảng 2-2.5 lít nước mỗi ngày. Điều này phụ thuộc vào cân nặng, mức độ hoạt động và khí hậu. Tôi khuyên bạn nên uống nước đều đặn trong ngày, đặc biệt là trước và sau khi tập luyện.",
  "context": "nutrition_advice",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "aiModel": "gpt-4o",
  "tokensUsed": 150,
  "costUsd": 0.0045
}
```

### 2. Lấy lịch sử chat
**Endpoint:** `GET /ai-assistant/chat-history`

**Mô tả:** Lấy lịch sử chat của người dùng

**Parameters:**
- `limit` (query): `number` - Số lượng tin nhắn tối đa (mặc định: 50)
- `offset` (query): `number` - Vị trí bắt đầu (mặc định: 0)

**Response:**
```json
{
  "messages": [
    {
      "id": "msg_123",
      "message": "Tôi nên uống bao nhiêu nước mỗi ngày?",
      "response": "Dựa trên thông tin của bạn...",
      "context": "nutrition_advice",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 25,
  "hasMore": true
}
```

### 3. Xóa lịch sử chat
**Endpoint:** `DELETE /ai-assistant/chat-history`

**Mô tả:** Xóa toàn bộ lịch sử chat của người dùng

**Response:**
```json
{
  "message": "Đã xóa lịch sử chat thành công",
  "deletedCount": 25
}
```

### 4. Lấy gợi ý câu hỏi
**Endpoint:** `GET /ai-assistant/suggestions`

**Mô tả:** Lấy danh sách câu hỏi gợi ý

**Parameters:**
- `category` (query): `string` - Danh mục gợi ý (nutrition, exercise, health, general)

**Response:**
```json
{
  "suggestions": [
    {
      "id": "sug_1",
      "question": "Tôi nên ăn gì trước khi tập luyện?",
      "category": "nutrition",
      "description": "Lời khuyên về dinh dưỡng trước tập luyện"
    },
    {
      "id": "sug_2", 
      "question": "Làm thế nào để tăng cơ bắp hiệu quả?",
      "category": "exercise",
      "description": "Hướng dẫn tập luyện tăng cơ"
    }
  ]
}
```

### 5. Hỏi câu hỏi nhanh
**Endpoint:** `POST /ai-assistant/ask`

**Mô tả:** Hỏi câu hỏi nhanh không cần lưu vào lịch sử

**Request Body:**
```json
{
  "question": "Calo trong 1 quả chuối là bao nhiêu?",
  "includeContext": false
}
```

**Response:**
```json
{
  "question": "Calo trong 1 quả chuối là bao nhiêu?",
  "answer": "Một quả chuối trung bình (khoảng 118g) chứa khoảng 105 calo. Chuối cũng chứa nhiều chất dinh dưỡng quan trọng như kali, vitamin B6, và chất xơ.",
  "source": "nutrition_database",
  "confidence": 0.95
}
```

### 6. Kiểm tra trạng thái Assistant
**Endpoint:** `GET /ai-assistant/status`

**Mô tả:** Kiểm tra trạng thái AI Assistant

**Response:**
```json
{
  "isAvailable": true,
  "message": "AI Assistant đang hoạt động bình thường",
  "config": {
    "model": "gpt-4o",
    "maxTokens": "1000",
    "temperature": "0.8"
  },
  "stats": {
    "totalConversations": 1250,
    "averageResponseTime": 2.5,
    "userSatisfaction": 4.2
  }
}
```

## Cấu hình

### Environment Variables
```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=1000
OPENAI_TEMPERATURE=0.8
```

### AI Configuration
- **Model**: GPT-4o (mặc định) hoặc GPT-3.5-turbo
- **Max Tokens**: 1000 (phù hợp cho chat)
- **Temperature**: 0.8 (thân thiện và sáng tạo hơn)

## Luồng xử lý chi tiết

### 1. Chat Flow
```
1. Nhận tin nhắn từ người dùng
2. Lấy lịch sử chat gần đây (context)
3. Chuẩn bị prompt với context
4. Gửi lên OpenAI
5. Lưu tin nhắn và phản hồi vào database
6. Trả về phản hồi cho người dùng
```

### 2. Context Management
```
1. Phân tích tin nhắn để xác định chủ đề
2. Lấy lịch sử chat liên quan
3. Tạo context summary
4. Đưa context vào prompt
```

## Prompt Templates

### Chat Prompt
```
Bạn là một trợ lý dinh dưỡng và sức khỏe thông minh. Hãy trả lời câu hỏi của người dùng một cách thân thiện và chuyên nghiệp.

Context trước đó:
{chatHistory}

Câu hỏi hiện tại: {currentMessage}

Hãy trả lời ngắn gọn, chính xác và hữu ích.
```

### Quick Question Prompt
```
Trả lời câu hỏi sau một cách ngắn gọn và chính xác:
{question}

Chỉ trả lời thông tin cần thiết, không cần giải thích dài dòng.
```

## Database Schema

### ChatMessage Entity
```typescript
{
  id: string;
  userId: number;
  message: string;
  response: string;
  context?: string;
  timestamp: Date;
  tokensUsed: number;
  costUsd: number;
  aiModel: string;
}
```

## Error Handling

### OpenAI Errors
- **API Key Missing**: Trả về lỗi "AI Assistant không khả dụng"
- **Network Error**: Thông báo lỗi kết nối
- **Rate Limit**: Thông báo quá tải và yêu cầu thử lại

### User Input Errors
- **Empty Message**: Yêu cầu nhập tin nhắn
- **Message Too Long**: Giới hạn độ dài tin nhắn
- **Invalid Context**: Xử lý context không hợp lệ

## Monitoring & Analytics

### Metrics
- **Conversation Count**: Số lượng cuộc hội thoại
- **Response Time**: Thời gian phản hồi trung bình
- **User Satisfaction**: Đánh giá từ người dùng
- **Token Usage**: Số token sử dụng
- **Cost Tracking**: Chi phí OpenAI

### Logging
- **Chat Logs**: Log tất cả cuộc hội thoại
- **Error Logs**: Log các lỗi
- **Performance Logs**: Log thời gian xử lý

## Best Practices

### Performance
- Giới hạn context length để tối ưu token usage
- Cache các câu trả lời phổ biến
- Batch processing cho multiple requests

### User Experience
- Phản hồi nhanh chóng (< 3 giây)
- Câu trả lời ngắn gọn, dễ hiểu
- Gợi ý câu hỏi tiếp theo
- Lưu trữ lịch sử để context

### Security
- Sanitize user input
- Rate limiting cho API calls
- Không lưu thông tin nhạy cảm

## Use Cases

### 1. Tư vấn dinh dưỡng
- **Calorie Calculation**: Tính toán calo cho món ăn
- **Meal Planning**: Gợi ý thực đơn
- **Nutrition Facts**: Thông tin dinh dưỡng

### 2. Tư vấn tập luyện
- **Exercise Guidance**: Hướng dẫn bài tập
- **Workout Planning**: Lập kế hoạch tập luyện
- **Recovery Advice**: Lời khuyên phục hồi

### 3. Tư vấn sức khỏe
- **Health Questions**: Câu hỏi về sức khỏe
- **Symptom Analysis**: Phân tích triệu chứng
- **Lifestyle Advice**: Lời khuyên lối sống

### 4. Hỗ trợ chung
- **App Usage**: Hướng dẫn sử dụng app
- **Feature Explanation**: Giải thích tính năng
- **Troubleshooting**: Xử lý sự cố

## Future Enhancements

### Planned Features
- **Voice Chat**: Hỗ trợ chat bằng giọng nói
- **Multi-language**: Hỗ trợ nhiều ngôn ngữ
- **Image Analysis**: Phân tích hình ảnh thực phẩm
- **Personalization**: Tùy chỉnh theo người dùng

### Integration Opportunities
- **Notification System**: Gửi lời nhắc thông minh
- **Goal Integration**: Liên kết với mục tiêu người dùng
- **Social Features**: Chia sẻ insights với cộng đồng
