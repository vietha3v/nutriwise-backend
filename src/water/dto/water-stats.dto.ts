import { ApiProperty } from '@nestjs/swagger';

export class DailyWaterStatsDto {
  @ApiProperty()
  date: string;

  @ApiProperty()
  dayName: string;

  @ApiProperty()
  dayNameShort: string;

  @ApiProperty()
  dayOfWeek: number;

  @ApiProperty()
  totalIntake: number;

  @ApiProperty()
  goal: number;

  @ApiProperty()
  achievement: number;

  @ApiProperty()
  drinkCount: number;

  @ApiProperty()
  averagePerDrink: number;

  @ApiProperty()
  chartData: {
    intake: number;
    goal: number;
    percentage: number;
    status: string;
  };
}

export class WeeklyWaterStatsDto {
  @ApiProperty()
  week: string;

  @ApiProperty()
  period: {
    startDate: string;
    endDate: string;
  };

  @ApiProperty({ type: [DailyWaterStatsDto] })
  dailyStats: DailyWaterStatsDto[];

  @ApiProperty()
  chartData: {
    labels: string[];
    datasets: {
      intake: number[];
      goal: number[];
      achievement: number[];
      drinkCount: number[];
    };
    colors: {
      intake: string;
      goal: string;
      achievement: string;
      drinkCount: string;
    };
  };

  @ApiProperty()
  summary: {
    totalIntake: number;
    averageDaily: number;
    goalAchievement: number;
    consistencyDays: number;
    consistencyRate: number;
    bestDay: {
      date: string;
      dayName: string;
      intake: number;
      achievement: number;
    };
    worstDay: {
      date: string;
      dayName: string;
      intake: number;
      achievement: number;
    };
    metrics: {
      totalDrinks: number;
      averageDrinksPerDay: number;
      maxDailyIntake: number;
      minDailyIntake: number;
      standardDeviation: number;
      trend: string;
    };
  };

  @ApiProperty()
  aiAnalysisData: {
    hydrationPattern: any;
    consistencyScore: number;
    improvementAreas: string[];
    recommendations: string[];
  };

  @ApiProperty()
  totalRecords: number;
}

export class MonthlyWaterStatsDto {
  @ApiProperty()
  month: string;

  @ApiProperty()
  period: {
    startDate: string;
    endDate: string;
    daysInMonth: number;
  };

  @ApiProperty({ type: [WeeklyWaterStatsDto] })
  weeklyStats: WeeklyWaterStatsDto[];

  @ApiProperty({ type: [DailyWaterStatsDto] })
  dailyStats: DailyWaterStatsDto[];

  @ApiProperty()
  chartData: {
    daily: {
      labels: string[];
      datasets: {
        intake: number[];
        goal: number[];
        achievement: number[];
        drinkCount: number[];
      };
      colors: {
        intake: string;
        goal: string;
        achievement: string;
        drinkCount: string;
      };
    };
    weekly: {
      labels: string[];
      datasets: {
        totalIntake: number[];
        averageDaily: number[];
        goalAchievement: number[];
      };
      colors: {
        totalIntake: string;
        averageDaily: string;
        goalAchievement: string;
      };
    };
  };

  @ApiProperty()
  summary: {
    totalIntake: number;
    averageDaily: number;
    goalAchievement: number;
    consistencyDays: number;
    consistencyRate: number;
    bestDay: {
      date: string;
      day: number;
      intake: number;
      achievement: number;
    };
    worstDay: {
      date: string;
      day: number;
      intake: number;
      achievement: number;
    };
    totalDrinks: number;
    averageDrinksPerDay: number;
    metrics: {
      totalDrinks: number;
      averageDrinksPerDay: number;
      maxDailyIntake: number;
      minDailyIntake: number;
      standardDeviation: number;
      trend: string;
      weeklyTrend: string;
    };
  };

  @ApiProperty()
  aiAnalysisData: {
    hydrationPattern: any;
    consistencyScore: number;
    improvementAreas: string[];
    recommendations: string[];
    monthlyProgress: any;
  };
}

export class WaterAiAnalysisDto {
  @ApiProperty()
  period: string;

  @ApiProperty()
  waterStats: WeeklyWaterStatsDto | MonthlyWaterStatsDto;

  @ApiProperty()
  profileData: {
    currentWeight: number;
    currentBodyFat: number;
    currentMuscleMass: number;
    currentBMI: number;
    dailyWaterGoal: number;
    activityLevel: string;
    goalType: string;
  };

  @ApiProperty()
  metrics: {
    hydrationConsistency: number;
    averageDailyIntake: number;
    goalAchievement: number;
    trend: string;
  };

  @ApiProperty()
  patterns: any;

  @ApiProperty()
  recommendations: {
    hydration: string[];
    profileImpact: string[];
  };
}
