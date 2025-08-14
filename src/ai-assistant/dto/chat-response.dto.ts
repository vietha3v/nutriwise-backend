import { ApiProperty } from '@nestjs/swagger';

export enum IntentType {
  CREATE_PROFILE = 'create_profile',
  UPDATE_PROFILE = 'update_profile',
  ADD_MEAL = 'add_meal',
  CREATE_GOAL = 'create_goal',
  ANALYZE_PROFILE = 'analyze_profile',
  GET_SUGGESTIONS = 'get_suggestions',
  ADD_WATER = 'add_water',
  ADD_EXERCISE = 'add_exercise',
  VIEW_MEALS = 'view_meals',
  VIEW_GOALS = 'view_goals',
  VIEW_WATER = 'view_water',
  VIEW_EXERCISE = 'view_exercise',
  VIEW_DASHBOARD = 'view_dashboard',
  HELP = 'help',
  CONFIRM = 'confirm',
  REJECT = 'reject',
  CLARIFY_INTENT = 'clarify_intent',
  GENERAL_QUERY = 'general_query',
  UNKNOWN = 'unknown',
}

export class ChatResponseDto {
  @ApiProperty({
    description: 'Phản hồi từ AI Assistant cho người dùng',
    example: 'Tôi hiểu bạn muốn tạo profile mới. Hãy cho tôi biết tên và tuổi của bạn.',
  })
  response: string;

  @ApiProperty({
    description: 'Ý định được AI nhận diện từ tin nhắn người dùng',
    enum: IntentType,
    example: IntentType.CREATE_PROFILE,
  })
  intent: IntentType;

  @ApiProperty({
    description: 'Độ tin cậy của việc nhận diện ý định, từ 0 đến 1',
    example: 0.95,
  })
  confidence: number;

  @ApiProperty({
    description: 'Trạng thái hiện tại của cuộc hội thoại',
    example: 'collecting_info',
  })
  conversationState: string;

  @ApiProperty({
    description: 'Thông tin bổ sung cho developer',
    required: false,
  })
  context?: Record<string, any>;
}
