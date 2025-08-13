# 13. AI Assistant - Trợ lý ảo

## Tổng quan

AI Assistant là module chatbot thông minh cung cấp API thống nhất cho các bot platform (Zalo, Facebook, Telegram, Web) kết nối. Module này tự động nhận diện ý định người dùng, thu thập thông tin và thực hiện các hành động tương ứng.

## Chức năng chính

### Chatbot thông minh
- API thống nhất cho các bot platform
- Nhận diện ý định từ tin nhắn text và hình ảnh
- Thu thập thông tin tự động
- Thực hiện hành động và gọi API các module khác
- Tự động tạo user mới nếu chưa tồn tại

### Tích hợp module
- Profile Module: Tạo/cập nhật profile từ ảnh chỉ số
- Meal Module: Ghi lại bữa ăn từ ảnh hoặc mô tả
- Nutrition Goals: Tạo mục tiêu từ yêu cầu
- Dashboard: Trả lời câu hỏi về tiến độ

## Kịch bản sử dụng

### Kịch bản 1: Tạo profile từ ảnh cân
```
User: [Gửi ảnh cân Inbody]
AI: "Tôi thấy bạn đã đo cân Inbody! Tôi đã đọc được các chỉ số:
- Cân nặng: 65kg
- Tỷ lệ mỡ: 18%
- Khối lượng cơ: 32kg
- BMI: 22.5

Bạn có muốn tôi tạo profile mới với những chỉ số này không?"

User: "Có"
AI: "Tôi đã tạo profile mới cho bạn! Bạn có muốn tôi phân tích và gợi ý mục tiêu không?"
```

### Kịch bản 2: Ghi bữa ăn từ ảnh
```
User: [Gửi ảnh bữa ăn]
AI: "Tôi thấy bạn đang ăn! Tôi đã nhận diện được:
- Cơm trắng: khoảng 200g
- Thịt gà: khoảng 100g
- Rau cải: khoảng 50g

Tôi sẽ ghi lại bữa ăn này cho bạn. Đây có phải là bữa trưa không?"

User: "Đúng rồi"
AI: "Đã ghi lại bữa trưa! Tổng: 425 calo, 36g protein
So với mục tiêu hôm nay, bạn còn thiếu 575 calo. Bạn có muốn tôi gợi ý bữa phụ không?"
```

### Kịch bản 3: Tạo mục tiêu
```
User: "Tôi muốn giảm cân"
AI: "Tôi hiểu bạn muốn giảm cân! Để tư vấn chính xác, tôi cần biết:
- Bạn muốn giảm bao nhiêu kg?
- Trong thời gian bao lâu?
- Bạn có tập luyện không?

Bạn có thể cho tôi biết những thông tin này không?"

User: "Giảm 5kg trong 3 tháng, tập 3 lần/tuần"
AI: "Tuyệt vời! Dựa trên profile hiện tại, tôi sẽ tạo mục tiêu:
- Giảm 5kg trong 12 tuần
- Calo mục tiêu: 1800 kcal/ngày
- Protein: 120g/ngày

Bạn có muốn tôi tạo mục tiêu này không?"

User: "Có"
AI: "Đã tạo mục tiêu giảm cân! Tôi sẽ theo dõi tiến độ của bạn."
```

## API Endpoints

### POST /ai-assistant/chat
Xử lý tin nhắn từ bot platform

**Request:**
```typescript
{
  platform: 'ZALO' | 'FACEBOOK' | 'TELEGRAM' | 'WEB';
  platformUserId: string;
  message: {
    type: 'TEXT' | 'IMAGE' | 'FILE';
    content: string;
    mediaUrl?: string;
  };
  context?: {
    conversationId?: string;
    metadata?: object;
  };
}
```

**Response:**
```typescript
{
  response: string;
  intent: string;
  confidence: number;
  actions?: {
    type: 'COLLECT_DATA' | 'CONFIRM' | 'EXECUTE_API';
    data?: object;
    confirmMessage?: string;
  }[];
  suggestions?: string[];
  userInfo?: {
    userId: number;
    isNewUser: boolean;
    hasProfile: boolean;
  };
}
```

### GET /ai-assistant/chat/history
Lấy lịch sử chat theo userId

## Logic xử lý user

### Platform Priority + Strict Verification

**Platform Verification Levels:**
```typescript
const VERIFIED_PLATFORMS = {
  'ZALO': true,      // Zalo đã verify SĐT
  'FACEBOOK': true,  // Facebook đã verify
  'TELEGRAM': false, // Telegram chưa verify
  'WEB': false,      // Web chưa verify
  'MOBILE': false    // Mobile chưa verify
};
```

**Logic tìm/tạo user:**
1. Tìm user theo platform + platformUserId
2. Nếu không tìm thấy và có phone:
   - Kiểm tra phone đã tồn tại chưa
   - Nếu platform đã verify → Tự động link
   - Nếu platform chưa verify → Yêu cầu OTP (xử lý bởi User Module)
3. Tạo user mới nếu cần

## Database Schema

### users
- id (PK)
- phone (unique, nullable)
- email (unique, nullable)
- status (ACTIVE, INACTIVE)
- createdAt
- updatedAt

### user_platforms
- id (PK)
- userId (FK to users)
- platform (ZALO, FACEBOOK, TELEGRAM, WEB, MOBILE)
- platformUserId (unique per platform)
- isVerified (boolean)
- verifiedAt (timestamp, nullable)
- createdAt

### chat_messages
- id (PK)
- userId (FK to users)
- platform (string)
- platformUserId (string)
- messageType (TEXT, IMAGE, FILE)
- message (text)
- response (text)
- intent (string)
- confidence (float)
- context (jsonb, nullable)
- mediaUrl (string, nullable)
- createdAt

## Cấu trúc thư mục

```
src/ai-assistant/
├── ai-assistant.controller.ts
├── ai-assistant.module.ts
├── ai-assistant.service.ts
├── entities/
│   └── chat-message.entity.ts
├── processors/
│   ├── intent-recognition.ts
│   ├── image-processor.ts
│   ├── user-manager.ts
│   └── action-executor.ts
└── utils/
    ├── context-manager.ts
    └── response-generator.ts
```

## Tích hợp bot platform

### Zalo Bot
- Gửi: `platform: 'ZALO', platformUserId: '0123456789'`
- Bot gọi API `/ai-assistant/chat`
- Nhận response và gửi tin nhắn qua Zalo API

### Facebook Messenger Bot
- Gửi: `platform: 'FACEBOOK', platformUserId: '123456789'`
- Bot gọi API `/ai-assistant/chat`
- Nhận response và gửi tin nhắn qua Facebook Graph API

### Telegram Bot
- Gửi: `platform: 'TELEGRAM', platformUserId: '123456789'`
- Bot gọi API `/ai-assistant/chat`
- Nhận response và gửi tin nhắn qua Telegram Bot API

### Web Chat
- Gửi: `platform: 'WEB', platformUserId: 'web_session_123'`
- Frontend gọi API `/ai-assistant/chat`
- Hiển thị response trong giao diện web

## Context Management

- **Short-term**: Redis với key `platform:platformUserId:conversationId`
- **Long-term**: Database theo user
- **Verification**: Xử lý bởi User/Auth Module

## Lưu ý

- Verification và User Management được xử lý bởi User/Auth Module, không phải AI Assistant
- AI Assistant chỉ focus vào xử lý tin nhắn và tương tác với user
- Tất cả dữ liệu user được lưu trong bảng users và user_platforms
