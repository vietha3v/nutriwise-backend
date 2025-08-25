import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('ai_cache')
export class AiCache {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'User ID' })
  @Column()
  userId: number;

  @ApiProperty({ description: 'Type of AI request' })
  @Column()
  requestType: string; // 'exercise_goals', 'nutrition_goals', 'progress_analysis', 'meal_plan'

  @ApiProperty({ description: 'Input parameters for AI request' })
  @Column({ type: 'jsonb' })
  inputData: any;

  @ApiProperty({ description: 'AI response (GPT or fallback)' })
  @Column({ type: 'jsonb' })
  responseData: any;

  @ApiProperty({ description: 'Source of response (gpt or fallback)' })
  @Column()
  source: string; // 'gpt' or 'fallback'

  @ApiProperty({ description: 'Whether response is from GPT' })
  @Column({ default: false })
  isFromGpt: boolean;

  @ApiProperty({ description: 'GPT model used (if applicable)' })
  @Column({ nullable: true })
  gptModel: string;

  @ApiProperty({ description: 'Tokens used (if GPT)' })
  @Column({ nullable: true })
  tokensUsed: number;

  @ApiProperty({ description: 'Cost in USD (if GPT)' })
  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  costUsd: number;

  @ApiProperty({ description: 'Cache expiry time' })
  @Column()
  expiresAt: Date;

  @ApiProperty({ description: 'Whether cache is expired' })
  @Column({ default: false })
  isExpired: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @ManyToOne('User', 'aiCaches')
  @JoinColumn({ name: 'userId' })
  user: any;
} 