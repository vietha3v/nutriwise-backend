import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { WaterIntake } from './entities/water-intake.entity';
import { ProfileService } from '../profile/profile.service';
import { 
  startOfDay, 
  endOfDay, 
  getHours, 
  format, 
  isValid, 
  parseISO,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  addWeeks,
  addMonths,
  getWeek,
  getYear,
  setDate,
  setMonth,
  setYear
} from 'date-fns';

interface CreateWaterIntakeDto {
  amount: number;
  datetime: string;
}

interface UpdateWaterIntakeDto {
  amount?: number;
  datetime?: string;
}

interface DailyStats {
  date: string;
  dayName: string;
  dayNameShort: string;
  dayOfWeek: number;
  totalIntake: number;
  cumulativeIntake: number;
  goal: number;
  cumulativeGoal: number;
  achievement: number;
  cumulativeAchievement: number;
  drinkCount: number;
  averagePerDrink: number;
  actualHours?: number; // Thêm actualHours
  chartData: {
    intake: number;
    cumulativeIntake: number;
    goal: number;
    cumulativeGoal: number;
    percentage: number;
    cumulativePercentage: number;
    status: string;
  };
}

interface WeeklyStats {
  week: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  totalIntake: number;
  averageDaily: number;
  goalAchievement: number;
  recordCount: number;
  chartData: {
    week: string;
    intake: number;
    average: number;
    goal: number;
    percentage: number;
  };
}

@Injectable()
export class WaterService {
  constructor(
    @InjectRepository(WaterIntake)
    private waterIntakeRepository: Repository<WaterIntake>,
    private profileService: ProfileService,
  ) {}

  /**
   * Kiểm tra định dạng ISO 8601 bằng date-fns
   */
  private isValidISODate(dateString: string): boolean {
    try {
      const parsedDate = parseISO(dateString);
      return isValid(parsedDate);
    } catch {
      return false;
    }
  }

  /**
   * Tính toán lượng nước cần uống hàng ngày dựa trên thông tin profile
   * Công thức: 35ml/kg cân nặng + điều chỉnh theo mức độ hoạt động + điều chỉnh theo tuổi, giới tính, mục tiêu
   */
  private calculateDailyWaterGoal(profile: any): number {
    if (!profile || !profile.weight) {
      return 2000; // Giá trị mặc định nếu không có thông tin
    }

    // Công thức cơ bản: 35ml/kg cân nặng
    let baseWater = profile.weight * 35;

    // Điều chỉnh theo mức độ hoạt động
    const activityAdjustments = {
      'Sedentary': 0, // Không điều chỉnh
      'LightlyActive': 200, // +200ml
      'ModeratelyActive': 400, // +400ml
      'VeryActive': 600, // +600ml
      'ExtremelyActive': 800, // +800ml
    };

    const activityAdjustment = activityAdjustments[profile.activityLevel] || 0;
    baseWater += activityAdjustment;

    // Điều chỉnh theo tuổi (người lớn tuổi cần ít nước hơn)
    if (profile.age > 65) {
      baseWater *= 0.9; // Giảm 10%
    } else if (profile.age > 50) {
      baseWater *= 0.95; // Giảm 5%
    }

    // Điều chỉnh theo giới tính (nam thường cần nhiều nước hơn)
    if (profile.gender === 'Male') {
      baseWater *= 1.1; // Tăng 10%
    }

    // Điều chỉnh theo mục tiêu
    if (profile.goalType === 'WeightLoss') {
      baseWater *= 1.15; // Giảm cân cần nhiều nước hơn
    } else if (profile.goalType === 'MuscleGain') {
      baseWater *= 1.1; // Tăng cơ cần nhiều nước hơn
    }

    // Làm tròn đến 50ml gần nhất
    return Math.round(baseWater / 50) * 50;
  }

  /**
   * Transform WaterIntake entity thành response DTO (loại bỏ userId và isDeleted)
   */
  private transformToResponseDto(waterIntake: WaterIntake): any {
    const { userId, isDeleted, user, ...responseData } = waterIntake;
    return responseData;
  }

  async create(createWaterIntakeDto: CreateWaterIntakeDto, userId: number): Promise<any> {
    const waterIntake = new WaterIntake();
    Object.assign(waterIntake, {
      ...createWaterIntakeDto,
      userId,
      datetime: parseISO(createWaterIntakeDto.datetime),
    });
    const savedWaterIntake = await this.waterIntakeRepository.save(waterIntake);
    return this.transformToResponseDto(savedWaterIntake);
  }

  async findAllByUserId(userId: number): Promise<any[]> {
    const waterIntakes = await this.waterIntakeRepository.find({
      where: { userId, isDeleted: false },
      order: { datetime: 'DESC' },
    });
    return waterIntakes.map(waterIntake => this.transformToResponseDto(waterIntake));
  }

  async getWaterInfo(userId: number, date?: string): Promise<any> {
    let targetDate: Date;
    let records: WaterIntake[];
    let progress: any;

    if (date) {
      // Lấy dữ liệu theo ngày cụ thể
      targetDate = parseISO(date);
      if (!isValid(targetDate) || !this.isValidISODate(date)) {
        throw new Error('Định dạng ngày không hợp lệ. Vui lòng sử dụng định dạng ISO 8601 (ví dụ: 2024-01-15T00:00:00.000Z)');
      }

      const startOfTargetDate = startOfDay(targetDate);
      const endOfTargetDate = endOfDay(targetDate);

      [records, progress] = await Promise.all([
        this.waterIntakeRepository.find({
          where: {
            userId,
            datetime: Between(startOfTargetDate, endOfTargetDate),
            isDeleted: false,
          },
          order: { datetime: 'DESC' },
        }),
        this.getStatsByDate(userId, date)
      ]);
    } else {
      // Lấy dữ liệu hôm nay (mặc định)
      [records, progress] = await Promise.all([
        this.findAllByUserId(userId),
        this.getTodayProgress(userId)
      ]);
    }

    return {
      records: records.map(record => this.transformToResponseDto(record)),
      progress: progress, // Luôn trả về format trực tiếp
      // Thống nhất format với module profile - trả về dạng array
      datasets: {
        intake: records.map(r => r.amount),
        datetime: records.map(r => r.datetime),
        labels: records.map(r => {
          const date = new Date(r.datetime);
          return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
        })
      },
      units: {
        intake: 'ml',
        datetime: 'ISO 8601'
      },
      totalRecords: records.length,
      date: date || format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
    };
  }

  async getTodayProgress(userId: number): Promise<any> {
    const profile = await this.profileService.findByUserId(userId);
    const dailyGoal = this.calculateDailyWaterGoal(profile);

    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);
    
    const waterToday = await this.waterIntakeRepository.find({
      where: {
        userId,
        datetime: Between(startOfToday, endOfToday),
        isDeleted: false,
      },
      order: { datetime: 'DESC' },
    });

    const totalDrank = waterToday.reduce((sum, w) => sum + Number(w.amount), 0);
    const remaining = Math.max(dailyGoal - totalDrank, 0);
    const progressPercentage = Math.min((totalDrank / dailyGoal) * 100, 100);

    return {
      totalDrank,
      goal: dailyGoal, // Thay đổi từ dailyGoal thành goal để thống nhất
      remaining,
      percentage: progressPercentage, // Thay đổi từ progressPercentage thành percentage
      recordCount: waterToday.length,
      lastDrinkTime: waterToday.length > 0 ? waterToday[0].datetime : null,
    };
  }

  async getStatsByDate(userId: number, date: string): Promise<any> {
    const profile = await this.profileService.findByUserId(userId);
    const dailyGoal = this.calculateDailyWaterGoal(profile);

    const targetDate = parseISO(date);
    const startOfTargetDate = startOfDay(targetDate);
    const endOfTargetDate = endOfDay(targetDate);
    
    const waterRecords = await this.waterIntakeRepository.find({
      where: {
        userId,
        datetime: Between(startOfTargetDate, endOfTargetDate),
        isDeleted: false,
      },
      order: { datetime: 'ASC' },
    });

    const totalDrank = waterRecords.reduce((sum, w) => sum + Number(w.amount), 0);
    const remaining = Math.max(dailyGoal - totalDrank, 0);
    const progressPercentage = Math.min((totalDrank / dailyGoal) * 100, 100);

    // Thống kê theo giờ
    const hourlyData: number[] = new Array(24).fill(0);
    const hourlyCount: number[] = new Array(24).fill(0);
    
    waterRecords.forEach(water => {
      const hour = getHours(water.datetime);
      hourlyData[hour] += Number(water.amount);
      hourlyCount[hour]++;
    });

    return {
      date,
      totalDrank,
      goal: dailyGoal, // Thay đổi từ dailyGoal thành goal để thống nhất
      remaining,
      percentage: progressPercentage, // Thay đổi từ progressPercentage thành percentage
      recordCount: waterRecords.length,
      hourlyData,
      hourlyCount,
      records: waterRecords.map(record => this.transformToResponseDto(record)),
    };
  }

  async getStats(userId: number, period: string, time?: string, startDate?: string, endDate?: string): Promise<any> {
    const profile = await this.profileService.findByUserId(userId);
    const dailyGoal = this.calculateDailyWaterGoal(profile);

    if (period === 'week') {
      return this.getWeeklyStatsData(userId, dailyGoal, time);
    } else if (period === 'month') {
      return this.getMonthlyStatsData(userId, dailyGoal, time);
    } else if (period === 'custom') {
      return this.getCustomStatsData(userId, dailyGoal, startDate, endDate);
    } else {
      throw new Error('Period phải là "week", "month" hoặc "custom"');
    }
  }

  private async getWeeklyStatsData(userId: number, dailyGoal: number, week?: string): Promise<any> {
    // Xác định tuần cần thống kê
    let startOfWeek: Date, endOfWeek: Date;
    
    if (week) {
      // Parse week format: YYYY-WNN
      const [year, weekNum] = week.split('-W');
      const weekStart = this.getWeekStart(parseInt(year), parseInt(weekNum));
      startOfWeek = startOfDay(weekStart);
      endOfWeek = endOfDay(addDays(weekStart, 6));
    } else {
      // Tuần hiện tại (từ thứ 2 đến chủ nhật)
      const now = new Date();
      startOfWeek = this.getCurrentWeekStart(now);
      endOfWeek = endOfDay(new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000));
    }

    const waterRecords = await this.waterIntakeRepository.find({
      where: {
        userId,
        datetime: Between(startOfWeek, endOfWeek),
        isDeleted: false,
      },
      order: { datetime: 'ASC' },
    });

    // Thống kê theo ngày trong tuần
    const dailyStats: DailyStats[] = [];
    const weekDays = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const weekDaysShort = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    
    let cumulativeIntake = 0;
    let cumulativeGoal = 0;
    const currentDate = new Date();
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);
    
    for (let i = 0; i < 7; i++) {
      const dayStart = addDays(startOfWeek, i);
      const dayEnd = endOfDay(dayStart);
      
      const dayRecords = waterRecords.filter(record => 
        record.datetime >= dayStart && record.datetime <= dayEnd
      );
      
      const dayTotal = dayRecords.reduce((sum, w) => sum + Number(w.amount), 0);
      
      // Chỉ tính cho những ngày đã qua (không bao gồm hôm nay và tương lai)
      let actualGoal = dailyGoal;
      let actualHours = 24;
      
      // Nếu là ngày trong tương lai hoặc hôm nay, bỏ qua
      if (dayStart > yesterday) {
        continue; // Bỏ qua ngày này
      }
      
      const dayAchievement = Math.min((dayTotal / actualGoal) * 100, 100);
      
      // Tính tích lũy
      cumulativeIntake += dayTotal;
      cumulativeGoal += actualGoal;
      const cumulativeAchievement = Math.min((cumulativeIntake / cumulativeGoal) * 100, 100);
      
      dailyStats.push({
        date: format(dayStart, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        dayName: weekDays[dayStart.getDay()],
        dayNameShort: weekDaysShort[dayStart.getDay()],
        dayOfWeek: dayStart.getDay(),
        totalIntake: dayTotal,
        cumulativeIntake, // Thêm tích lũy
        goal: actualGoal, // Sử dụng mục tiêu thực tế
        cumulativeGoal, // Thêm mục tiêu tích lũy
        achievement: Math.round(dayAchievement * 100) / 100,
        cumulativeAchievement: Math.round(cumulativeAchievement * 100) / 100, // Thêm thành tích tích lũy
        drinkCount: dayRecords.length,
        averagePerDrink: dayRecords.length > 0 ? Math.round(dayTotal / dayRecords.length) : 0,
        actualHours: Math.round(actualHours * 10) / 10, // Thêm số giờ thực tế
        // Thêm dữ liệu cho biểu đồ
        chartData: {
          intake: dayTotal,
          cumulativeIntake, // Thêm cho biểu đồ
          goal: actualGoal, // Sử dụng mục tiêu thực tế
          cumulativeGoal, // Thêm cho biểu đồ
          percentage: Math.round(dayAchievement * 100) / 100,
          cumulativePercentage: Math.round(cumulativeAchievement * 100) / 100, // Thêm cho biểu đồ
          status: dayAchievement >= 100 ? 'achieved' : dayAchievement >= 80 ? 'good' : 'needs_improvement'
        }
      });
    }

    // Tính tổng kết tuần
    const weeklyTotal = dailyStats.reduce((sum, day) => sum + day.totalIntake, 0);
    
    // Tính số ngày thực tế từ đầu tuần đến hôm qua
    const actualDaysInWeek = dailyStats.length; // Chỉ những ngày đã qua
    
    // Chỉ tính trung bình cho những ngày đã qua
    const weeklyAverage = actualDaysInWeek > 0 ? Math.round(weeklyTotal / actualDaysInWeek) : 0;
    
    const consistencyDays = dailyStats.filter(day => day.achievement >= 100).length;
    
    // Xử lý trường hợp dailyStats rỗng
    let bestDay: any = null;
    let worstDay: any = null;
    
    if (dailyStats.length > 0) {
      bestDay = dailyStats.reduce((best, current) => 
        current.totalIntake > best.totalIntake ? current : best
      );
      worstDay = dailyStats.reduce((worst, current) => 
        current.totalIntake < worst.totalIntake ? current : worst
      );
    }

    // Tính toán metrics chi tiết với số ngày thực tế
    const detailedMetrics = this.calculateDetailedMetrics(dailyStats, waterRecords.length, actualDaysInWeek);

    // Dữ liệu cho biểu đồ
    const chartData = {
      labels: dailyStats.map(day => day.dayNameShort),
      datasets: {
        intake: dailyStats.map(day => day.totalIntake),
        cumulativeIntake: dailyStats.map(day => day.cumulativeIntake),
        goal: dailyStats.map(day => day.goal),
        cumulativeGoal: dailyStats.map(day => day.cumulativeGoal),
        achievement: dailyStats.map(day => day.achievement),
        cumulativeAchievement: dailyStats.map(day => day.cumulativeAchievement),
        drinkCount: dailyStats.map(day => day.drinkCount)
      }
    };

    // Tạo tên tuần hiển thị
    const weekDisplayName = this.getWeekDisplayName(startOfWeek, endOfWeek);

    return {
      period: 'week',
      periodData: week || weekDisplayName,
      timeRange: {
        startDate: format(startOfWeek, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        endDate: format(endOfWeek, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        displayName: weekDisplayName
      },
      dailyStats,
      chartData,
      summary: {
        totalIntake: weeklyTotal,
        averageDaily: weeklyAverage,
        goal: dailyGoal, // Thêm goal vào summary
        goalAchievement: Math.round((weeklyAverage / dailyGoal) * 100 * 100) / 100,
        consistencyDays: detailedMetrics.consistencyDays,
        consistencyRate: detailedMetrics.consistencyRate,
        actualDays: actualDaysInWeek, // Thêm số ngày thực tế
        bestDay: {
          date: bestDay ? bestDay.date : null,
          dayName: bestDay ? bestDay.dayName : null,
          intake: bestDay ? bestDay.totalIntake : 0,
          achievement: bestDay ? bestDay.achievement : 0
        },
        worstDay: {
          date: worstDay ? worstDay.date : null,
          dayName: worstDay ? worstDay.dayName : null,
          intake: worstDay ? worstDay.totalIntake : 0,
          achievement: worstDay ? worstDay.achievement : 0
        },
        // Sử dụng metrics chi tiết
        metrics: {
          totalDrinks: detailedMetrics.totalDrinks,
          averageDrinksPerDay: detailedMetrics.averageDrinksPerDay,
          maxDailyIntake: detailedMetrics.maxDailyIntake,
          minDailyIntake: detailedMetrics.minDailyIntake,
          standardDeviation: detailedMetrics.standardDeviation,
          trend: detailedMetrics.trend,
          averagePerDrink: detailedMetrics.averagePerDrink
        }
      },
      totalRecords: waterRecords.length,
      // Thêm lịch trình uống nước thông minh
      smartWaterSchedule: this.calculateSmartWaterSchedule(dailyGoal),
      // Dữ liệu cho AI phân tích
      aiAnalysisData: {
        hydrationPattern: this.analyzeHydrationPattern(dailyStats),
        consistencyScore: Math.round((consistencyDays / 7) * 100),
        improvementAreas: this.identifyImprovementAreas(dailyStats, dailyGoal),
        recommendations: this.generateRecommendations(dailyStats, dailyGoal)
      }
    };
  }

  private async getMonthlyStatsData(userId: number, dailyGoal: number, month?: string): Promise<any> {

    // Xác định tháng cần thống kê
    let startOfMonth: Date, endOfMonth: Date;
    
    if (month) {
      // Parse month format: YYYY-MM
      const [year, monthNum] = month.split('-');
      startOfMonth = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      endOfMonth = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59, 999);
    } else {
      // Tháng hiện tại
      const now = new Date();
      startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    const waterRecords = await this.waterIntakeRepository.find({
      where: {
        userId,
        datetime: Between(startOfMonth, endOfMonth),
        isDeleted: false,
      },
      order: { datetime: 'ASC' },
    });

    // Thống kê theo tuần trong tháng
    const weeklyStats: WeeklyStats[] = [];
    let currentDate = new Date(startOfMonth);
    
    while (currentDate <= endOfMonth) {
      const weekStart = this.getWeekStart(currentDate.getFullYear(), this.getWeekNumber(currentDate));
      const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
      
      // Chỉ tính tuần có ngày trong tháng
      if (weekStart <= endOfMonth && weekEnd >= startOfMonth) {
        const weekRecords = waterRecords.filter(record => 
          record.datetime >= weekStart && record.datetime <= weekEnd
        );
        
        const weekTotal = weekRecords.reduce((sum, w) => sum + Number(w.amount), 0);
        const weekAverage = Math.round(weekTotal / 7);
        
        weeklyStats.push({
          week: `Week ${this.getWeekNumber(weekStart)}`,
          weekNumber: this.getWeekNumber(weekStart),
          startDate: format(weekStart, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
          endDate: format(weekEnd, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
          totalIntake: weekTotal,
          averageDaily: weekAverage,
          goalAchievement: Math.round((weekAverage / dailyGoal) * 100 * 100) / 100,
          recordCount: weekRecords.length,
          // Thêm dữ liệu cho biểu đồ
          chartData: {
            week: `W${this.getWeekNumber(weekStart)}`,
            intake: weekTotal,
            average: weekAverage,
            goal: dailyGoal * 7,
            percentage: Math.round((weekAverage / dailyGoal) * 100 * 100) / 100
          }
        });
      }
      
      currentDate = addWeeks(currentDate, 1);
    }

    // Thống kê theo ngày trong tháng
    const dailyStats: any[] = [];
    const daysInMonth = endOfMonth.getDate();
    
    let cumulativeIntake = 0;
    let cumulativeGoal = 0;
    const todayDate = new Date();
    const yesterdayDate = new Date(todayDate);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStart = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth(), day);
      const dayEnd = endOfDay(dayStart);
      
      // Chỉ tính cho những ngày đã qua (không bao gồm hôm nay và tương lai)
      if (dayStart > yesterdayDate) {
        continue; // Bỏ qua ngày này
      }
      
      const dayRecords = waterRecords.filter(record => 
        record.datetime >= dayStart && record.datetime <= dayEnd
      );
      
      const dayTotal = dayRecords.reduce((sum, w) => sum + Number(w.amount), 0);
      const dayAchievement = Math.min((dayTotal / dailyGoal) * 100, 100);
      
      // Tính tích lũy
      cumulativeIntake += dayTotal;
      cumulativeGoal += dailyGoal;
      const cumulativeAchievement = Math.min((cumulativeIntake / cumulativeGoal) * 100, 100);
      
      dailyStats.push({
        date: format(dayStart, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        day: day,
        totalIntake: dayTotal,
        cumulativeIntake,
        goal: dailyGoal,
        cumulativeGoal,
        achievement: Math.round(dayAchievement * 100) / 100,
        cumulativeAchievement: Math.round(cumulativeAchievement * 100) / 100,
        drinkCount: dayRecords.length,
        averagePerDrink: dayRecords.length > 0 ? Math.round(dayTotal / dayRecords.length) : 0,
        // Thêm dữ liệu cho biểu đồ
        chartData: {
          day: day,
          intake: dayTotal,
          cumulativeIntake,
          goal: dailyGoal,
          cumulativeGoal,
          percentage: Math.round(dayAchievement * 100) / 100,
          cumulativePercentage: Math.round(cumulativeAchievement * 100) / 100,
          status: dayAchievement >= 100 ? 'achieved' : dayAchievement >= 80 ? 'good' : 'needs_improvement'
        }
      });
    }

    // Tính tổng kết tháng
    const monthlyTotal = dailyStats.reduce((sum, day) => sum + day.totalIntake, 0);
    
    // Tính số ngày thực tế từ đầu tháng đến hôm qua
    const actualDaysInMonth = dailyStats.length; // Chỉ những ngày đã qua
    
    // Chỉ tính trung bình cho những ngày đã qua
    const monthlyAverage = actualDaysInMonth > 0 ? Math.round(monthlyTotal / actualDaysInMonth) : 0;
    
    const consistencyDays = dailyStats.filter(day => day.achievement >= 100).length;
    
    // Xử lý trường hợp dailyStats rỗng
    let bestDay: any = null;
    let worstDay: any = null;
    
    if (dailyStats.length > 0) {
      bestDay = dailyStats.reduce((best, current) => 
        current.totalIntake > best.totalIntake ? current : best
      );
      worstDay = dailyStats.reduce((worst, current) => 
        current.totalIntake < worst.totalIntake ? current : worst
      );
    }

    // Tính toán metrics chi tiết với số ngày thực tế
    const detailedMetrics = this.calculateDetailedMetrics(dailyStats, waterRecords.length, actualDaysInMonth);

    // Dữ liệu cho biểu đồ
    const chartData = {
      daily: {
        labels: dailyStats.map(day => day.day.toString()),
        datasets: {
          intake: dailyStats.map(day => day.totalIntake),
          cumulativeIntake: dailyStats.map(day => day.cumulativeIntake),
          goal: dailyStats.map(day => day.goal),
          cumulativeGoal: dailyStats.map(day => day.cumulativeGoal),
          achievement: dailyStats.map(day => day.achievement),
          cumulativeAchievement: dailyStats.map(day => day.cumulativeAchievement),
          drinkCount: dailyStats.map(day => day.drinkCount)
        }
      },
      weekly: {
        labels: weeklyStats.map(week => week.chartData.week),
        datasets: {
          totalIntake: weeklyStats.map(week => week.totalIntake),
          averageDaily: weeklyStats.map(week => week.averageDaily),
          goalAchievement: weeklyStats.map(week => week.goalAchievement)
        }
      }
    };

    // Tạo tên tháng hiển thị
    const monthDisplayName = this.getMonthDisplayName(startOfMonth);

    return {
      period: 'month',
      periodData: month || monthDisplayName,
      timeRange: {
        startDate: format(startOfMonth, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        endDate: format(endOfMonth, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        displayName: monthDisplayName
      },
      weeklyStats,
      dailyStats,
      chartData,
      summary: {
        totalIntake: monthlyTotal,
        averageDaily: monthlyAverage,
        goal: dailyGoal, // Thêm goal vào summary
        goalAchievement: Math.round((monthlyAverage / dailyGoal) * 100 * 100) / 100,
        consistencyDays: detailedMetrics.consistencyDays,
        consistencyRate: detailedMetrics.consistencyRate,
        actualDays: actualDaysInMonth, // Thêm số ngày thực tế
        bestDay: {
          date: bestDay ? bestDay.date : null,
          day: bestDay ? bestDay.day : null,
          intake: bestDay ? bestDay.totalIntake : 0,
          achievement: bestDay ? bestDay.achievement : 0
        },
        worstDay: {
          date: worstDay ? worstDay.date : null,
          day: worstDay ? worstDay.day : null,
          intake: worstDay ? worstDay.totalIntake : 0,
          achievement: worstDay ? worstDay.achievement : 0
        },
        // Sử dụng metrics chi tiết
        metrics: {
          totalDrinks: detailedMetrics.totalDrinks,
          averageDrinksPerDay: detailedMetrics.averageDrinksPerDay,
          maxDailyIntake: detailedMetrics.maxDailyIntake,
          minDailyIntake: detailedMetrics.minDailyIntake,
          standardDeviation: detailedMetrics.standardDeviation,
          trend: detailedMetrics.trend,
          averagePerDrink: detailedMetrics.averagePerDrink,
          weeklyTrend: this.calculateTrend(weeklyStats.map(week => week.averageDaily))
        }
      },
      // Thêm lịch trình uống nước thông minh
      smartWaterSchedule: this.calculateSmartWaterSchedule(dailyGoal),
      // Dữ liệu cho AI phân tích
      aiAnalysisData: {
        hydrationPattern: this.analyzeHydrationPattern(dailyStats),
        consistencyScore: Math.round((consistencyDays / daysInMonth) * 100),
        improvementAreas: this.identifyImprovementAreas(dailyStats, dailyGoal),
        recommendations: this.generateRecommendations(dailyStats, dailyGoal),
        monthlyProgress: this.analyzeMonthlyProgress(weeklyStats, dailyGoal)
      }
    };
  }

  private async getCustomStatsData(userId: number, dailyGoal: number, startDate?: string, endDate?: string): Promise<any> {
    if (!startDate || !endDate) {
      throw new Error('startDate và endDate phải được cung cấp khi period=custom');
    }

    // Validate ISO format
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    
    if (!isValid(start) || !isValid(end) || 
        !this.isValidISODate(startDate) || !this.isValidISODate(endDate)) {
      throw new Error('Định dạng ngày không hợp lệ. Vui lòng sử dụng định dạng ISO 8601');
    }

    if (start > end) {
      throw new Error('startDate phải nhỏ hơn endDate');
    }

    const waterRecords = await this.waterIntakeRepository.find({
      where: {
        userId,
        datetime: Between(start, end),
        isDeleted: false,
      },
      order: { datetime: 'ASC' },
    });

    // Tính số ngày trong khoảng thời gian
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    // Thống kê theo ngày trong khoảng thời gian
    const dailyStats: any[] = [];
    let currentDate = new Date(start);
    
    let cumulativeIntake = 0;
    let cumulativeGoal = 0;
    const todayDate = new Date();
    const yesterdayDate = new Date(todayDate);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    
    for (let i = 0; i < daysDiff; i++) {
      const dayStart = startOfDay(currentDate);
      const dayEnd = endOfDay(currentDate);
      
      // Chỉ tính cho những ngày đã qua (không bao gồm hôm nay và tương lai)
      if (currentDate > yesterdayDate) {
        currentDate = addDays(currentDate, 1);
        continue; // Bỏ qua ngày này
      }
      
      const dayRecords = waterRecords.filter(record => 
        record.datetime >= dayStart && record.datetime <= dayEnd
      );
      
      const dayTotal = dayRecords.reduce((sum, w) => sum + Number(w.amount), 0);
      const dayAchievement = Math.min((dayTotal / dailyGoal) * 100, 100);
      
      // Tính tích lũy
      cumulativeIntake += dayTotal;
      cumulativeGoal += dailyGoal;
      const cumulativeAchievement = Math.min((cumulativeIntake / cumulativeGoal) * 100, 100);
      
      dailyStats.push({
        date: format(currentDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        day: i + 1,
        totalIntake: dayTotal,
        cumulativeIntake,
        goal: dailyGoal,
        cumulativeGoal,
        achievement: Math.round(dayAchievement * 100) / 100,
        cumulativeAchievement: Math.round(cumulativeAchievement * 100) / 100,
        drinkCount: dayRecords.length,
        averagePerDrink: dayRecords.length > 0 ? Math.round(dayTotal / dayRecords.length) : 0,
        chartData: {
          day: i + 1,
          intake: dayTotal,
          cumulativeIntake,
          goal: dailyGoal,
          cumulativeGoal,
          percentage: Math.round(dayAchievement * 100) / 100,
          cumulativePercentage: Math.round(cumulativeAchievement * 100) / 100,
          status: dayAchievement >= 100 ? 'achieved' : dayAchievement >= 80 ? 'good' : 'needs_improvement'
        }
      });
      
      currentDate = addDays(currentDate, 1);
    }

    // Tính tổng kết
    const totalIntake = dailyStats.reduce((sum, day) => sum + day.totalIntake, 0);
    
    // Tính số ngày thực tế từ startDate đến hôm qua
    const actualDaysInRange = dailyStats.length; // Chỉ những ngày đã qua
    
    // Chỉ tính trung bình cho những ngày đã qua
    const averageDaily = actualDaysInRange > 0 ? Math.round(totalIntake / actualDaysInRange) : 0;
    
    const consistencyDays = dailyStats.filter(day => day.achievement >= 100).length;
    const bestDay = dailyStats.reduce((best, current) => 
      current.totalIntake > best.totalIntake ? current : best
    );
    const worstDay = dailyStats.reduce((worst, current) => 
      current.totalIntake < worst.totalIntake ? current : worst
    );

    // Tính toán metrics chi tiết với số ngày thực tế
    const detailedMetrics = this.calculateDetailedMetrics(dailyStats, waterRecords.length, actualDaysInRange);

    // Dữ liệu cho biểu đồ
    const chartData = {
      daily: {
        labels: dailyStats.map(day => day.date),
        datasets: {
          intake: dailyStats.map(day => day.totalIntake),
          cumulativeIntake: dailyStats.map(day => day.cumulativeIntake),
          goal: dailyStats.map(day => day.goal),
          cumulativeGoal: dailyStats.map(day => day.cumulativeGoal),
          achievement: dailyStats.map(day => day.achievement),
          cumulativeAchievement: dailyStats.map(day => day.cumulativeAchievement),
          drinkCount: dailyStats.map(day => day.drinkCount)
        }
      }
    };

    // Tạo tên hiển thị
    const displayName = `${startDate.split('T')[0]} - ${endDate.split('T')[0]}`;

    return {
      period: 'custom',
      periodData: displayName,
      timeRange: {
        startDate: startDate.split('T')[0],
        endDate: endDate.split('T')[0],
        displayName,
        daysInRange: daysDiff
      },
      dailyStats,
      chartData,
      summary: {
        totalIntake,
        averageDaily,
        goal: dailyGoal, // Thêm goal vào summary
        goalAchievement: Math.round((averageDaily / dailyGoal) * 100 * 100) / 100,
        consistencyDays: detailedMetrics.consistencyDays,
        consistencyRate: detailedMetrics.consistencyRate,
        actualDays: actualDaysInRange, // Thêm số ngày thực tế
        bestDay: {
          date: bestDay.date,
          day: bestDay.day,
          intake: bestDay.totalIntake,
          achievement: bestDay.achievement
        },
        worstDay: {
          date: worstDay.date,
          day: worstDay.day,
          intake: worstDay.totalIntake,
          achievement: bestDay.achievement
        },
        metrics: {
          totalDrinks: detailedMetrics.totalDrinks,
          averageDrinksPerDay: detailedMetrics.averageDrinksPerDay,
          maxDailyIntake: detailedMetrics.maxDailyIntake,
          minDailyIntake: detailedMetrics.minDailyIntake,
          standardDeviation: detailedMetrics.standardDeviation,
          trend: detailedMetrics.trend,
          averagePerDrink: detailedMetrics.averagePerDrink
        }
      },
      totalRecords: waterRecords.length,
      // Thêm lịch trình uống nước thông minh
      smartWaterSchedule: this.calculateSmartWaterSchedule(dailyGoal),
      aiAnalysisData: {
        hydrationPattern: this.analyzeHydrationPattern(dailyStats),
        consistencyScore: Math.round((consistencyDays / daysDiff) * 100),
        improvementAreas: this.identifyImprovementAreas(dailyStats, dailyGoal),
        recommendations: this.generateRecommendations(dailyStats, dailyGoal)
      }
    };
  }

  /**
   * Tính toán lịch trình uống nước thông minh dựa trên thời gian thức dậy và đi ngủ
   * Không chia đều 24h mà tập trung vào thời gian hoạt động
   */
  private calculateSmartWaterSchedule(dailyGoal: number, wakeUpTimeStr: string = '06:00', bedTimeStr: string = '22:00'): any {
    // Parse thời gian thức dậy và đi ngủ
    const wakeUp = new Date(`2000-01-01T${wakeUpTimeStr}:00`);
    const bedTime = new Date(`2000-01-01T${bedTimeStr}:00`);
    
    // Tính thời gian hoạt động (không tính thời gian ngủ)
    const activeHours = (bedTime.getTime() - wakeUp.getTime()) / (1000 * 60 * 60);
    
    // Phân bổ nước theo thời gian hoạt động
    const waterPerHour = dailyGoal / activeHours;
    
    // Tạo lịch trình uống nước thông minh
    const schedule: any[] = [];
    let totalScheduled = 0;
    
    // Khung giờ vàng uống nước (theo khoảng 2-3 giờ)
    const goldenHours = [
      { start: 6, end: 8, multiplier: 1.5, name: 'Sáng sớm - Hydration boost' },
      { start: 9, end: 11, multiplier: 1.2, name: 'Giữa sáng - Năng lượng' },
      { start: 12, end: 14, multiplier: 1.3, name: 'Trưa - Sau bữa ăn' },
      { start: 15, end: 17, multiplier: 1.1, name: 'Chiều - Duy trì' },
      { start: 18, end: 20, multiplier: 1.0, name: 'Tối - Chuẩn bị ngủ' },
      { start: 21, end: 22, multiplier: 0.5, name: 'Trước ngủ - Ít nước' }
    ];
    
    // Tạo lịch trình theo khoảng giờ (2-3 giờ/lần)
    for (let hour = wakeUp.getHours(); hour < bedTime.getHours(); hour += 2) {
      const endHour = Math.min(hour + 2, bedTime.getHours());
      const goldenHour = goldenHours.find(gh => hour >= gh.start && hour <= gh.end);
      const multiplier = goldenHour ? goldenHour.multiplier : 1.0;
      const hourlyGoal = Math.round(waterPerHour * multiplier * 2); // 2 giờ
      
      if (hourlyGoal > 0) {
        schedule.push({
          hour: hour,
          time: `${hour.toString().padStart(2, '0')}:00 - ${endHour.toString().padStart(2, '0')}:00`,
          goal: hourlyGoal,
          period: goldenHour ? goldenHour.name : 'Giờ hoạt động',
          priority: goldenHour ? 'high' : 'normal',
          recommendedDrinks: Math.ceil(hourlyGoal / 250) // Ước tính số lần uống (250ml/lần)
        });
        totalScheduled += hourlyGoal;
      }
    }
    
    // Điều chỉnh để đảm bảo tổng bằng dailyGoal
    if (totalScheduled !== dailyGoal && schedule.length > 0) {
      const adjustment = dailyGoal - totalScheduled;
      const adjustmentPerSlot = Math.round(adjustment / schedule.length);
      
      schedule.forEach(slot => {
        slot.goal += adjustmentPerSlot;
        slot.recommendedDrinks = Math.ceil(slot.goal / 250);
      });
    }
    
    return {
      dailyGoal,
      activeHours: Math.round(activeHours * 10) / 10,
      wakeUpTime: wakeUpTimeStr,
      bedTime: bedTimeStr,
      schedule,
      recommendations: [
        'Uống 1-2 ly nước ngay khi thức dậy để khởi động cơ thể',
        'Tập trung uống nước trong thời gian hoạt động (6h-22h)',
        'Giảm lượng nước 2-3 giờ trước khi ngủ',
        'Uống nước trước và sau bữa ăn 30 phút',
        'Lắng nghe cơ thể - uống khi khát',
        'Chia nhỏ thành nhiều lần uống trong mỗi khoảng giờ'
      ]
    };
  }

  // Helper methods for week calculations
  private getWeekStart(year: number, week: number): Date {
    const firstDayOfYear = new Date(year, 0, 1);
    const days = (week - 1) * 7;
    const weekStart = new Date(firstDayOfYear.getTime() + days * 24 * 60 * 60 * 1000);
    
    // Điều chỉnh để tuần bắt đầu từ thứ 2
    const dayOfWeek = weekStart.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    return new Date(weekStart.getTime() - daysToSubtract * 24 * 60 * 60 * 1000);
  }

  private getCurrentWeekStart(date: Date): Date {
    const currentDayOfWeek = date.getDay();
    const daysToSubtract = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
    return new Date(date.getTime() - daysToSubtract * 24 * 60 * 60 * 1000);
  }

  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  private getWeekDisplayName(startOfWeek: Date, endOfWeek: Date): string {
    const startDate = startOfWeek.toISOString().split('T')[0];
    const endDate = endOfWeek.toISOString().split('T')[0];
    const startDay = startOfWeek.getDate();
    const endDay = endOfWeek.getDate();

    if (startDate === endDate) {
      return `Week ${this.getWeekNumber(startOfWeek)}`;
    }

    return `${startDate} - ${endDate}`;
  }

  private getMonthDisplayName(date: Date): string {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month}/${year}`;
  }

  // Helper methods for AI analysis
  private calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.sqrt(variance);
  }

  private calculateTrend(values: number[]): string {
    if (values.length < 2) return 'stable';
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    const change = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    if (change > 5) return 'increasing';
    if (change < -5) return 'decreasing';
    return 'stable';
  }

  private analyzeHydrationPattern(dailyStats: any[]): any {
    const weekdays = dailyStats.filter(day => day.dayOfWeek >= 1 && day.dayOfWeek <= 5);
    const weekends = dailyStats.filter(day => day.dayOfWeek === 0 || day.dayOfWeek === 6);
    
    const weekdayAvg = weekdays.length > 0 ? 
      weekdays.reduce((sum, day) => sum + day.totalIntake, 0) / weekdays.length : 0;
    const weekendAvg = weekends.length > 0 ? 
      weekends.reduce((sum, day) => sum + day.totalIntake, 0) / weekends.length : 0;
    
    // Phân tích thói quen uống nước
    const strengths: string[] = [];
    const improvementAreas: string[] = [];
    
    // Kiểm tra điểm mạnh
    if (weekdayAvg >= 2000) {
      strengths.push('Duy trì lượng nước tốt trong tuần làm việc');
    }
    if (weekendAvg >= 2000) {
      strengths.push('Uống nước đều đặn cả cuối tuần');
    }
    if (Math.abs(weekdayAvg - weekendAvg) < 500) {
      strengths.push('Thói quen uống nước ổn định giữa tuần và cuối tuần');
    }
    
    // Kiểm tra điểm cần cải thiện
    if (weekdayAvg < 1500) {
      improvementAreas.push('Cần tăng lượng nước trong tuần làm việc');
    }
    if (weekendAvg < 1500) {
      improvementAreas.push('Cần chú ý uống nước nhiều hơn vào cuối tuần');
    }
    if (Math.abs(weekdayAvg - weekendAvg) > 1000) {
      improvementAreas.push('Có sự khác biệt lớn giữa tuần và cuối tuần');
    }
    
    return {
      weekdayAverage: Math.round(weekdayAvg),
      weekendAverage: Math.round(weekendAvg),
      weekdayWeekendDifference: Math.round(weekdayAvg - weekendAvg),
      pattern: weekdayAvg > weekendAvg ? 'weekday_focused' : 
               weekendAvg > weekdayAvg ? 'weekend_focused' : 'consistent',
      strengths,
      improvementAreas
    };
  }

  private identifyImprovementAreas(dailyStats: any[], dailyGoal: number): string[] {
    const areas: string[] = [];
    
    const lowDays = dailyStats.filter(day => day.achievement < 80);
    if (lowDays.length > 0) {
      areas.push('Cần cải thiện tính nhất quán - có nhiều ngày chưa đạt mục tiêu');
    }
    
    const inconsistentDays = dailyStats.filter(day => 
      day.totalIntake < dailyGoal * 0.7 || day.totalIntake > dailyGoal * 1.3
    );
    if (inconsistentDays.length > dailyStats.length * 0.3) {
      areas.push('Lượng nước uống không ổn định - có sự chênh lệch lớn giữa các ngày');
    }
    
    const lowDrinkCountDays = dailyStats.filter(day => day.drinkCount < 6);
    if (lowDrinkCountDays.length > dailyStats.length * 0.5) {
      areas.push('Tần suất uống nước thấp - nên uống ít nhất 6 lần/ngày');
    }
    
    const veryLowDays = dailyStats.filter(day => day.achievement < 50);
    if (veryLowDays.length > 0) {
      areas.push('Có những ngày uống nước rất ít - cần đặt nhắc nhở');
    }
    
    const highDays = dailyStats.filter(day => day.totalIntake > dailyGoal * 1.5);
    if (highDays.length > dailyStats.length * 0.2) {
      areas.push('Có những ngày uống quá nhiều nước - cần cân bằng hơn');
    }
    
    return areas;
  }

  private generateRecommendations(dailyStats: any[], dailyGoal: number): string[] {
    const recommendations: string[] = [];
    
    const avgAchievement = dailyStats.reduce((sum, day) => sum + day.achievement, 0) / dailyStats.length;
    if (avgAchievement < 80) {
      recommendations.push('Tăng lượng nước uống hàng ngày để đạt mục tiêu 2000ml');
    }
    
    const avgDrinkCount = dailyStats.reduce((sum, day) => sum + day.drinkCount, 0) / dailyStats.length;
    if (avgDrinkCount < 6) {
      recommendations.push('Tăng tần suất uống nước - nên uống ít nhất 6 lần/ngày');
    }
    
    const lowDays = dailyStats.filter(day => day.achievement < 70);
    if (lowDays.length > 0) {
      recommendations.push('Đặt nhắc nhở uống nước vào những ngày thường quên');
    }
    
    const inconsistentDays = dailyStats.filter(day => 
      day.totalIntake < dailyGoal * 0.7 || day.totalIntake > dailyGoal * 1.3
    );
    if (inconsistentDays.length > dailyStats.length * 0.3) {
      recommendations.push('Cố gắng duy trì lượng nước ổn định mỗi ngày');
    }
    
    const weekdays = dailyStats.filter(day => day.dayOfWeek >= 1 && day.dayOfWeek <= 5);
    const weekends = dailyStats.filter(day => day.dayOfWeek === 0 || day.dayOfWeek === 6);
    
    if (weekdays.length > 0 && weekends.length > 0) {
      const weekdayAvg = weekdays.reduce((sum, day) => sum + day.totalIntake, 0) / weekdays.length;
      const weekendAvg = weekends.reduce((sum, day) => sum + day.totalIntake, 0) / weekends.length;
      
      if (Math.abs(weekdayAvg - weekendAvg) > 1000) {
        recommendations.push('Cân bằng lượng nước giữa tuần làm việc và cuối tuần');
      }
    }
    
    const highDays = dailyStats.filter(day => day.totalIntake > dailyGoal * 1.5);
    if (highDays.length > 0) {
      recommendations.push('Tránh uống quá nhiều nước một lúc - chia nhỏ thành nhiều lần');
    }
    
    return recommendations;
  }

  private analyzeMonthlyProgress(weeklyStats: any[], dailyGoal: number): any {
    if (weeklyStats.length < 2) return { trend: 'insufficient_data' };
    
    const weeklyAverages = weeklyStats.map(week => week.averageDaily);
    const trend = this.calculateTrend(weeklyAverages);
    
    const firstWeek = weeklyStats[0];
    const lastWeek = weeklyStats[weeklyStats.length - 1];
    const improvement = ((lastWeek.averageDaily - firstWeek.averageDaily) / firstWeek.averageDaily) * 100;
    
    return {
      trend,
      improvement: Math.round(improvement * 100) / 100,
      firstWeekAverage: firstWeek.averageDaily,
      lastWeekAverage: lastWeek.averageDaily,
      overallProgress: improvement > 0 ? 'improving' : improvement < 0 ? 'declining' : 'stable'
    };
  }

  private calculateDetailedMetrics(dailyStats: any[], totalRecords: number, daysCount: number): any {
    const totalIntake = dailyStats.reduce((sum, day) => sum + day.totalIntake, 0);
    const averageDaily = totalIntake / daysCount;
    const maxDailyIntake = Math.max(...dailyStats.map(day => day.totalIntake));
    const minDailyIntake = Math.min(...dailyStats.map(day => day.totalIntake));
    const standardDeviation = this.calculateStandardDeviation(dailyStats.map(day => day.totalIntake));
    
    // Tính toán thêm các metrics
    const consistencyDays = dailyStats.filter(day => day.achievement >= 100).length;
    const consistencyRate = daysCount > 0 ? Math.round((consistencyDays / daysCount) * 100 * 100) / 100 : 0;
    
    // Phân tích xu hướng
    const trend = this.calculateTrend(dailyStats.map(day => day.totalIntake));
    
    // Phân tích tần suất
    const totalDrinks = totalRecords;
    const averageDrinksPerDay = totalDrinks / daysCount;
    
    // Phân tích hiệu quả
    const averagePerDrink = totalIntake / totalDrinks;
    
    // Tính toán theo khoảng giờ (làm tròn theo giờ)
    const averagePerHour = averageDaily / 24; // Lượng nước trung bình/giờ
    const recommendedDrinksPerHour = Math.ceil(averagePerHour / 250); // Số lần uống/giờ (250ml/lần)
    
    return {
      totalDrinks,
      averageDrinksPerDay: Math.round(averageDrinksPerDay * 100) / 100,
      maxDailyIntake,
      minDailyIntake,
      standardDeviation: Math.round(standardDeviation * 100) / 100,
      trend,
      averagePerDrink: Math.round(averagePerDrink),
      consistencyDays,
      consistencyRate,
      averageDaily: Math.round(averageDaily),
      totalIntake,
      // Thêm metrics theo giờ
      averagePerHour: Math.round(averagePerHour * 10) / 10,
      recommendedDrinksPerHour,
      optimalDrinkInterval: Math.round(60 / recommendedDrinksPerHour) // Phút giữa các lần uống
    };
  }
  async remove(id: number): Promise<{ message: string }> {
    const waterIntake = await this.waterIntakeRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!waterIntake) {
      throw new NotFoundException(`Water intake with ID ${id} not found`);
    }
    waterIntake.isDeleted = true;
    await this.waterIntakeRepository.save(waterIntake);
    return { message: 'Bản ghi uống nước đã được xóa thành công' };
  }
} 