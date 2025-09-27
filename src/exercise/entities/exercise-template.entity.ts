import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ExerciseSession } from './exercise-session.entity';

export enum BodyPart {
  FULL_BODY = 'FullBody',
  UPPER_BODY = 'UpperBody',
  LOWER_BODY = 'LowerBody',
  CORE = 'Core',
  ARMS = 'Arms',
  LEGS = 'Legs',
  BACK = 'Back',
  CHEST = 'Chest',
}

export enum ExerciseType {
  CARDIO = 'Cardio',
  STRENGTH = 'Strength',
  FLEXIBILITY = 'Flexibility',
  BALANCE = 'Balance',
  HIIT = 'HIIT',
  YOGA = 'Yoga',
  PILATES = 'Pilates',
}

@Entity('exercise_templates')
export class ExerciseTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  instructions: string[]; // JSON array cho hướng dẫn chi tiết

  @Column({ length: 500, nullable: true })
  videoUrl: string;

  @Column({ length: 500, nullable: true })
  thumbnailUrl: string;

  @Column({
    type: 'enum',
    enum: BodyPart,
  })
  bodyPart: BodyPart;

  @Column({
    type: 'enum',
    enum: ExerciseType,
  })
  exerciseType: ExerciseType;

  @Column({ type: 'integer' })
  difficultyLevel: number; // 1-5

  @Column({ type: 'integer' })
  durationMinutes: number; // Thời gian tập (phút)

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  caloriesPerMinute: number; // Calo/phút

  @Column({ type: 'text', array: true, nullable: true })
  equipmentNeeded: string[]; // Danh sách dụng cụ cần thiết

  @Column({ type: 'text', array: true, nullable: true })
  targetMuscles: string[]; // Các nhóm cơ chính

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToMany(() => ExerciseSession, (session) => session.template)
  sessions: ExerciseSession[];
}
