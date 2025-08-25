import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { AIPersonality, AIStyle, AITone, NotificationType, Theme, Language } from '../../common/enums/settings.enum';

@Entity('user_settings')
export class UserSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // AI Assistant Settings
  @Column({
    type: 'varchar',
    length: 50,
    default: 'cute'
  })
  aiPersonality: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'gen_z'
  })
  aiStyle: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'sweet'
  })
  aiTone: string;

  @Column({ default: true })
  aiUseEmojis: boolean;

  @Column({ default: true })
  aiUseNicknames: boolean;

  @Column({ default: true })
  aiUseGenZSlang: boolean;

  @Column({ default: true })
  aiShowPersonalizedReactions: boolean;

  @Column({ type: 'text', nullable: true })
  aiCustomName: string;

  @Column({ type: 'json', nullable: true })
  aiCustomPreferences: {
    favoriteEmojis?: string[];
    favoriteColors?: string[];
    communicationStyle?: string;
    responseLength?: 'short' | 'medium' | 'long';
    detailLevel?: 'basic' | 'detailed' | 'expert';
  };

  // Notification Settings
  @Column({ default: true })
  notificationsEnabled: boolean;

  @Column({ type: 'simple-array', nullable: true })
  notificationTypes: NotificationType[];

  @Column({ default: true })
  waterReminders: boolean;

  @Column({ default: true })
  mealReminders: boolean;

  @Column({ default: true })
  exerciseReminders: boolean;

  @Column({ default: true })
  goalReminders: boolean;

  @Column({ type: 'varchar', length: 5, default: '08:00' })
  reminderStartTime: string;

  @Column({ type: 'varchar', length: 5, default: '22:00' })
  reminderEndTime: string;

  // UI/UX Settings
  @Column({
    type: 'varchar',
    length: 20,
    default: 'auto'
  })
  theme: string;

  @Column({
    type: 'varchar',
    length: 10,
    default: 'vi'
  })
  language: string;

  @Column({ default: true })
  showTips: boolean;

  @Column({ default: true })
  showTutorials: boolean;

  @Column({ default: true })
  showProgressAnimations: boolean;

  // Privacy Settings
  @Column({ default: false })
  shareDataForResearch: boolean;

  @Column({ default: true })
  allowPersonalizedAds: boolean;

  @Column({ default: true })
  allowAnalytics: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
