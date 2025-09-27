import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExerciseTemplate } from './exercise-template.entity';

@Entity('exercise_sessions')
export class ExerciseSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  templateId: number;

  @Column({ type: 'timestamp with time zone' })
  startedAt: Date; // Gộp date + time thành ISO timestamp

  @Column({ type: 'integer' })
  durationMinutes: number; // Thời gian tập thực tế (phút)

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  caloriesBurned: number; // Tổng calo đốt cháy

  @Column({ type: 'text', nullable: true })
  notes: string; // Ghi chú của user

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @ManyToOne(() => ExerciseTemplate, (template) => template.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'templateId' })
  template: ExerciseTemplate;
}
