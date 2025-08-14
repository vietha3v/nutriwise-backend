# AI Assistant Usage Guide

## Tổng quan

AI Assistant của NutriWise hỗ trợ 2 chế độ hoạt động:

1. **AI Agent Mode** (Mặc định: tắt) - Phân tích intent và thực hiện action
2. **Direct Chat Mode** (Mặc định: bật) - Chat trực tiếp với AI

## Cấu hình

### Biến môi trường

Thêm vào file `.env`:

```env
# AI Assistant Configuration
AI_AGENT_MODE_ENABLED=false  # true = AI Agent Mode, false = Direct Chat Mode
```

### Các biến OpenAI khác

```env
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=1000
OPENAI_TEMPERATURE=0.7
OPENAI_VISION_MODEL=gpt-4-vision-preview
OPENAI_WHISPER_MODEL=whisper-1
```

## Chế độ hoạt động

### 1. Direct Chat Mode (AI_AGENT_MODE_ENABLED=false)

- AI chat trực tiếp với người dùng
- Sử dụng lịch sử chat gần đây để tạo context
- Trả về phản hồi tự nhiên, không phân tích intent
- Phù hợp cho chat thông thường, hỏi đáp về dinh dưỡng

**Ví dụ:**
```
User: "Tôi muốn biết về dinh dưỡng cho người tập gym"
AI: "Chào bạn! Để có dinh dưỡng tốt cho việc tập gym, bạn cần..."
```

### 2. AI Agent Mode (AI_AGENT_MODE_ENABLED=true)

- Phân tích intent của người dùng
- Xác định action cần thực hiện
- Thu thập thông tin cần thiết
- Thực hiện action và trả về kết quả
- Phù hợp cho các tác vụ cụ thể như tạo profile, ghi nhận bữa ăn

**Ví dụ:**
```
User: "Tôi vừa ăn cơm"
AI: "Tôi hiểu bạn muốn ghi nhận bữa ăn. Hãy cho tôi biết thêm thông tin:
- Thời gian ăn: ...
- Loại thực phẩm: ...
- Khẩu phần: ..."
```

## API Endpoints

### POST /ai-assistant/chat

Gửi tin nhắn đến AI Assistant.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Body:**
```json
{
  "message": "Nội dung tin nhắn"
}
```

**Response:**
```json
{
  "response": "Phản hồi từ AI",
  "intent": "unknown",
  "confidence": 1.0,
  "conversationState": "general_chat",
  "context": {
    "action": "general_query"
  }
}
```

### GET /ai-assistant/history

Lấy lịch sử chat.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `limit` (optional): Số lượng tin nhắn (mặc định: 50)

## Chuyển đổi chế độ

Để chuyển đổi giữa 2 chế độ:

1. **Từ Direct Chat sang AI Agent:**
   ```env
   AI_AGENT_MODE_ENABLED=true
   ```

2. **Từ AI Agent sang Direct Chat:**
   ```env
   AI_AGENT_MODE_ENABLED=false
   ```

3. **Restart server** sau khi thay đổi biến môi trường

## Lưu ý

- AI Agent Mode yêu cầu cấu hình đầy đủ các action trong `ai-actions.config.ts`
- Direct Chat Mode sử dụng ít tài nguyên hơn và phản hồi nhanh hơn
- Lịch sử chat được lưu trữ trong database cho cả 2 chế độ
- Có thể chuyển đổi chế độ mà không mất dữ liệu
