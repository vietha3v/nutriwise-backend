export enum Role {
  SystemAdmin = 'SystemAdmin',
  Nutritionist = 'Nutritionist', 
  Trainer = 'Trainer',
  User = 'User',
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export enum ActivityLevel {
  Sedentary = 'Sedentary',
  LightlyActive = 'LightlyActive',
  ModeratelyActive = 'ModeratelyActive',
  VeryActive = 'VeryActive',
  ExtremelyActive = 'ExtremelyActive',
}

export enum GoalType {
  WeightLoss = 'WeightLoss',
  WeightGain = 'WeightGain',
  Maintenance = 'Maintenance',
  MuscleGain = 'MuscleGain',
  HealthImprovement = 'HealthImprovement',
}

export enum MealType {
  Breakfast = 'Breakfast',
  Lunch = 'Lunch',
  Dinner = 'Dinner',
  Snack = 'Snack',
}

// ExerciseType moved to exercise-template.entity.ts 