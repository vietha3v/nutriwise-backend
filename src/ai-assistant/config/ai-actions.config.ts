import { ActionDefinition, ParamDefinition } from '../dto/ai-action.dto';

export const AI_ACTIONS: ActionDefinition[] = [
  {
    action: 'UPDATE_PROFILE',
    description: 'Cập nhật thông tin cá nhân và thể chất',
    requiredParams: [],
    optionalParams: [
      { name: 'name', type: 'string', description: 'Tên người dùng', required: false },
      { name: 'age', type: 'number', description: 'Tuổi (1-120)', required: false },
      { name: 'gender', type: 'enum', description: 'Giới tính (male|female)', required: false },
      { name: 'height', type: 'number', description: 'Chiều cao (cm, 50-300)', required: false },
      { name: 'weight', type: 'number', description: 'Cân nặng (kg, 20-500)', required: false },
      { name: 'activityLevel', type: 'enum', description: 'Mức độ hoạt động (sedentary|light|moderate|active|very_active)', required: false },
      { name: 'email', type: 'string', description: 'Email', required: false },
      { name: 'phone', type: 'string', description: 'Số điện thoại', required: false },
      { name: 'birthDate', type: 'date', description: 'Ngày sinh', required: false },
      { name: 'targetWeight', type: 'number', description: 'Cân nặng mục tiêu', required: false },
      { name: 'medicalConditions', type: 'array', description: 'Tình trạng sức khỏe', required: false },
      { name: 'allergies', type: 'array', description: 'Dị ứng thực phẩm', required: false }
    ],
    confirmationRequired: true
  },
  {
    action: 'ADD_MEAL',
    description: 'Ghi nhận thông tin về bữa ăn đã ăn',
    requiredParams: [
      { name: 'mealType', type: 'enum', description: 'Loại bữa ăn (breakfast|lunch|dinner|snack)', required: true },
      { name: 'foods', type: 'array', description: 'Danh sách thực phẩm', required: true }
    ],
    optionalParams: [
      { name: 'amount', type: 'string', description: 'Lượng ăn', required: false },
      { name: 'time', type: 'date', description: 'Thời gian ăn', required: false },
      { name: 'calories', type: 'number', description: 'Tổng calo', required: false },
      { name: 'protein', type: 'number', description: 'Protein (g)', required: false },
      { name: 'carbs', type: 'number', description: 'Carbohydrate (g)', required: false },
      { name: 'fat', type: 'number', description: 'Chất béo (g)', required: false },
      { name: 'fiber', type: 'number', description: 'Chất xơ (g)', required: false },
      { name: 'sugar', type: 'number', description: 'Đường (g)', required: false },
      { name: 'sodium', type: 'number', description: 'Natri (mg)', required: false },
      { name: 'location', type: 'string', description: 'Địa điểm ăn', required: false },
      { name: 'mood', type: 'enum', description: 'Tâm trạng khi ăn (great|good|okay|bad)', required: false },
      { name: 'notes', type: 'string', description: 'Ghi chú', required: false }
    ],
    confirmationRequired: false
  },
  {
    action: 'UPDATE_MEAL',
    description: 'Cập nhật thông tin bữa ăn',
    requiredParams: [
      { name: 'mealId', type: 'number', description: 'ID bữa ăn', required: true }
    ],
    optionalParams: [
      { name: 'mealType', type: 'enum', description: 'Loại bữa ăn (breakfast|lunch|dinner|snack)', required: false },
      { name: 'foods', type: 'array', description: 'Danh sách thực phẩm', required: false },
      { name: 'amount', type: 'string', description: 'Lượng ăn', required: false },
      { name: 'time', type: 'date', description: 'Thời gian ăn', required: false }
    ],
    confirmationRequired: true
  },
  {
    action: 'DELETE_MEAL',
    description: 'Xóa bữa ăn',
    requiredParams: [
      { name: 'mealId', type: 'number', description: 'ID bữa ăn', required: true }
    ],
    optionalParams: [],
    confirmationRequired: true
  },
  {
    action: 'VIEW_MEALS',
    description: 'Xem danh sách bữa ăn',
    requiredParams: [],
    optionalParams: [
      { name: 'date', type: 'date', description: 'Ngày cụ thể', required: false },
      { name: 'mealType', type: 'enum', description: 'Loại bữa ăn (breakfast|lunch|dinner|snack)', required: false },
      { name: 'limit', type: 'number', description: 'Số lượng (mặc định: 10)', required: false }
    ],
    confirmationRequired: false
  },
  {
    action: 'CREATE_GOAL',
    description: 'Tạo mục tiêu về cân nặng, dinh dưỡng hoặc tập luyện',
    requiredParams: [
      { name: 'goalType', type: 'enum', description: 'Loại mục tiêu (weight_loss|weight_gain|maintain|muscle_gain|calorie_target|protein_target|water_target|exercise_frequency)', required: true },
      { name: 'targetValue', type: 'number', description: 'Giá trị mục tiêu', required: true }
    ],
    optionalParams: [
      { name: 'timeframe', type: 'string', description: 'Thời gian thực hiện', required: false },
      { name: 'description', type: 'string', description: 'Mô tả chi tiết', required: false },
      { name: 'startDate', type: 'date', description: 'Ngày bắt đầu', required: false },
      { name: 'endDate', type: 'date', description: 'Ngày kết thúc', required: false },
      { name: 'priority', type: 'enum', description: 'Mức độ ưu tiên (low|medium|high)', required: false },
      { name: 'reminderFrequency', type: 'enum', description: 'Tần suất nhắc nhở (daily|weekly|monthly)', required: false },
      { name: 'milestones', type: 'array', description: 'Các cột mốc quan trọng', required: false }
    ],
    confirmationRequired: true
  },
  {
    action: 'UPDATE_GOAL',
    description: 'Cập nhật mục tiêu',
    requiredParams: [
      { name: 'goalId', type: 'number', description: 'ID mục tiêu', required: true }
    ],
    optionalParams: [
      { name: 'targetValue', type: 'number', description: 'Giá trị mục tiêu', required: false },
      { name: 'timeframe', type: 'string', description: 'Thời gian thực hiện', required: false },
      { name: 'description', type: 'string', description: 'Mô tả chi tiết', required: false }
    ],
    confirmationRequired: true
  },
  {
    action: 'DELETE_GOAL',
    description: 'Xóa mục tiêu',
    requiredParams: [
      { name: 'goalId', type: 'number', description: 'ID mục tiêu', required: true }
    ],
    optionalParams: [],
    confirmationRequired: true
  },
  {
    action: 'VIEW_GOALS',
    description: 'Xem danh sách mục tiêu',
    requiredParams: [],
    optionalParams: [
      { name: 'status', type: 'enum', description: 'Trạng thái mục tiêu (active|completed|paused)', required: false },
      { name: 'goalType', type: 'enum', description: 'Loại mục tiêu (weight_loss|weight_gain|maintain|muscle_gain)', required: false }
    ],
    confirmationRequired: false
  },
  {
    action: 'ADD_WATER',
    description: 'Ghi nhận lượng nước đã uống trong ngày',
    requiredParams: [
      { name: 'amount', type: 'number', description: 'Lượng nước (ml)', required: true }
    ],
    optionalParams: [
      { name: 'time', type: 'date', description: 'Thời gian uống', required: false },
      { name: 'waterType', type: 'enum', description: 'Loại nước (plain|mineral|filtered|bottled)', required: false },
      { name: 'temperature', type: 'enum', description: 'Nhiệt độ nước (cold|room|warm)', required: false },
      { name: 'container', type: 'string', description: 'Loại bình/chai', required: false },
      { name: 'location', type: 'string', description: 'Địa điểm uống', required: false },
      { name: 'notes', type: 'string', description: 'Ghi chú', required: false }
    ],
    confirmationRequired: false
  },
  {
    action: 'UPDATE_WATER',
    description: 'Cập nhật lượng nước',
    requiredParams: [
      { name: 'waterId', type: 'number', description: 'ID ghi nhận nước', required: true }
    ],
    optionalParams: [
      { name: 'amount', type: 'number', description: 'Lượng nước (ml)', required: false },
      { name: 'time', type: 'date', description: 'Thời gian uống', required: false }
    ],
    confirmationRequired: true
  },
  {
    action: 'DELETE_WATER',
    description: 'Xóa ghi nhận nước',
    requiredParams: [
      { name: 'waterId', type: 'number', description: 'ID ghi nhận nước', required: true }
    ],
    optionalParams: [],
    confirmationRequired: true
  },
  {
    action: 'VIEW_WATER_HISTORY',
    description: 'Xem lịch sử uống nước',
    requiredParams: [],
    optionalParams: [
      { name: 'date', type: 'date', description: 'Ngày cụ thể', required: false },
      { name: 'limit', type: 'number', description: 'Số lượng (mặc định: 10)', required: false }
    ],
    confirmationRequired: false
  },
  {
    action: 'ADD_EXERCISE',
    description: 'Ghi nhận hoạt động thể dục, thể thao đã thực hiện',
    requiredParams: [
      { name: 'exerciseType', type: 'string', description: 'Loại bài tập', required: true },
      { name: 'duration', type: 'number', description: 'Thời gian (phút)', required: true }
    ],
    optionalParams: [
      { name: 'intensity', type: 'enum', description: 'Cường độ (low|medium|high)', required: false },
      { name: 'calories', type: 'number', description: 'Calo tiêu thụ', required: false },
      { name: 'distance', type: 'number', description: 'Khoảng cách (km)', required: false },
      { name: 'steps', type: 'number', description: 'Số bước chân', required: false },
      { name: 'heartRate', type: 'number', description: 'Nhịp tim (bpm)', required: false },
      { name: 'location', type: 'string', description: 'Địa điểm tập', required: false },
      { name: 'equipment', type: 'array', description: 'Thiết bị sử dụng', required: false },
      { name: 'workoutPlan', type: 'string', description: 'Kế hoạch tập luyện', required: false },
      { name: 'mood', type: 'enum', description: 'Tâm trạng khi tập (great|good|okay|bad)', required: false },
      { name: 'notes', type: 'string', description: 'Ghi chú', required: false },
      { name: 'startTime', type: 'date', description: 'Thời gian bắt đầu', required: false },
      { name: 'endTime', type: 'date', description: 'Thời gian kết thúc', required: false }
    ],
    confirmationRequired: false
  },
  {
    action: 'UPDATE_EXERCISE',
    description: 'Cập nhật bài tập',
    requiredParams: [
      { name: 'exerciseId', type: 'number', description: 'ID bài tập', required: true }
    ],
    optionalParams: [
      { name: 'exerciseType', type: 'string', description: 'Loại bài tập', required: false },
      { name: 'duration', type: 'number', description: 'Thời gian (phút)', required: false },
      { name: 'intensity', type: 'enum', description: 'Cường độ (low|medium|high)', required: false },
      { name: 'calories', type: 'number', description: 'Calo tiêu thụ', required: false }
    ],
    confirmationRequired: true
  },
  {
    action: 'DELETE_EXERCISE',
    description: 'Xóa bài tập',
    requiredParams: [
      { name: 'exerciseId', type: 'number', description: 'ID bài tập', required: true }
    ],
    optionalParams: [],
    confirmationRequired: true
  },
  {
    action: 'VIEW_EXERCISES',
    description: 'Xem danh sách bài tập',
    requiredParams: [],
    optionalParams: [
      { name: 'date', type: 'date', description: 'Ngày cụ thể', required: false },
      { name: 'exerciseType', type: 'string', description: 'Loại bài tập', required: false },
      { name: 'limit', type: 'number', description: 'Số lượng (mặc định: 10)', required: false }
    ],
    confirmationRequired: false
  },
  {
    action: 'VIEW_DASHBOARD',
    description: 'Hiển thị thông tin tổng quan về tình trạng dinh dưỡng và sức khỏe',
    requiredParams: [],
    optionalParams: [],
    confirmationRequired: false
  },
  {
    action: 'VIEW_WEEKLY_REPORT',
    description: 'Xem báo cáo tuần',
    requiredParams: [],
    optionalParams: [
      { name: 'weekStart', type: 'date', description: 'Ngày bắt đầu tuần', required: false }
    ],
    confirmationRequired: false
  },
  {
    action: 'SEARCH_FOOD',
    description: 'Tìm kiếm thực phẩm',
    requiredParams: [
      { name: 'query', type: 'string', description: 'Từ khóa tìm kiếm', required: true }
    ],
    optionalParams: [
      { name: 'limit', type: 'number', description: 'Số lượng kết quả (mặc định: 10)', required: false },
      { name: 'category', type: 'enum', description: 'Danh mục thực phẩm (fruits|vegetables|meat|dairy|grains|nuts|beverages)', required: false },
      { name: 'calorieRange', type: 'object', description: 'Khoảng calo {min, max}', required: false },
      { name: 'proteinRange', type: 'object', description: 'Khoảng protein {min, max}', required: false },
      { name: 'allergenFree', type: 'array', description: 'Loại trừ dị ứng', required: false },
      { name: 'sortBy', type: 'enum', description: 'Sắp xếp theo (name|calories|protein|popularity)', required: false }
    ],
    confirmationRequired: false
  },
  {
    action: 'GET_MEAL_SUGGESTIONS',
    description: 'Lấy gợi ý bữa ăn thông minh',
    requiredParams: [],
    optionalParams: [
      { name: 'mealType', type: 'enum', description: 'Loại bữa ăn (breakfast|lunch|dinner|snack)', required: false },
      { name: 'preferences', type: 'array', description: 'Sở thích thực phẩm', required: false },
      { name: 'restrictions', type: 'array', description: 'Hạn chế ăn uống', required: false },
      { name: 'calorieTarget', type: 'number', description: 'Mục tiêu calo', required: false },
      { name: 'proteinTarget', type: 'number', description: 'Mục tiêu protein', required: false },
      { name: 'cookingTime', type: 'enum', description: 'Thời gian nấu (quick|medium|long)', required: false },
      { name: 'difficulty', type: 'enum', description: 'Độ khó (easy|medium|hard)', required: false },
      { name: 'cuisine', type: 'array', description: 'Loại ẩm thực', required: false },
      { name: 'ingredients', type: 'array', description: 'Nguyên liệu có sẵn', required: false },
      { name: 'budget', type: 'enum', description: 'Ngân sách (low|medium|high)', required: false },
      { name: 'servings', type: 'number', description: 'Số người ăn', required: false },
      { name: 'seasonal', type: 'boolean', description: 'Thực phẩm theo mùa', required: false }
    ],
    confirmationRequired: false
  },
  {
    action: 'GET_NUTRITION_ADVICE',
    description: 'Tư vấn dinh dưỡng',
    requiredParams: [],
    optionalParams: [
      { name: 'topic', type: 'string', description: 'Chủ đề tư vấn', required: false },
      { name: 'goal', type: 'string', description: 'Mục tiêu dinh dưỡng', required: false },
      { name: 'age', type: 'number', description: 'Tuổi', required: false },
      { name: 'gender', type: 'enum', description: 'Giới tính (male|female)', required: false },
      { name: 'activityLevel', type: 'enum', description: 'Mức độ hoạt động (sedentary|light|moderate|active|very_active)', required: false },
      { name: 'healthConditions', type: 'array', description: 'Tình trạng sức khỏe', required: false },
      { name: 'allergies', type: 'array', description: 'Dị ứng', required: false },
      { name: 'currentWeight', type: 'number', description: 'Cân nặng hiện tại', required: false },
      { name: 'targetWeight', type: 'number', description: 'Cân nặng mục tiêu', required: false },
      { name: 'lifestyle', type: 'enum', description: 'Lối sống (busy|moderate|relaxed)', required: false },
      { name: 'cookingSkill', type: 'enum', description: 'Kỹ năng nấu ăn (beginner|intermediate|advanced)', required: false }
    ],
    confirmationRequired: false
  },
  {
    action: 'GET_HEALTH_TIPS',
    description: 'Lời khuyên sức khỏe',
    requiredParams: [],
    optionalParams: [
      { name: 'category', type: 'string', description: 'Danh mục lời khuyên', required: false },
      { name: 'age', type: 'number', description: 'Tuổi', required: false },
      { name: 'gender', type: 'enum', description: 'Giới tính (male|female)', required: false },
      { name: 'healthGoals', type: 'array', description: 'Mục tiêu sức khỏe', required: false },
      { name: 'currentHealthStatus', type: 'array', description: 'Tình trạng sức khỏe hiện tại', required: false },
      { name: 'lifestyle', type: 'enum', description: 'Lối sống (sedentary|active|very_active)', required: false },
      { name: 'stressLevel', type: 'enum', description: 'Mức độ căng thẳng (low|medium|high)', required: false },
      { name: 'sleepQuality', type: 'enum', description: 'Chất lượng giấc ngủ (poor|fair|good|excellent)', required: false },
      { name: 'dietType', type: 'enum', description: 'Chế độ ăn (omnivore|vegetarian|vegan|keto|paleo)', required: false },
      { name: 'season', type: 'enum', description: 'Mùa trong năm (spring|summer|autumn|winter)', required: false },
      { name: 'weather', type: 'enum', description: 'Thời tiết (hot|warm|cool|cold)', required: false }
    ],
    confirmationRequired: false
  },
  {
    action: 'HELP',
    description: 'Hiển thị hướng dẫn sử dụng và các chức năng có sẵn',
    requiredParams: [],
    optionalParams: [],
    confirmationRequired: false
  }
];

export const getActionByName = (actionName: string): ActionDefinition | undefined => {
  return AI_ACTIONS.find(action => action.action === actionName);
};

export const getAllActions = (): ActionDefinition[] => {
  return AI_ACTIONS;
};
