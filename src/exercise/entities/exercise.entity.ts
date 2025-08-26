import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExerciseType } from '../../common/enums/role.enum';

@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ExerciseType,
  })
  type: ExerciseType;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  time: string;

  @Column({ type: 'integer' })
  duration: number; // in minutes

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  caloriesBurned: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  distance: number; // in km

  @Column({ type: 'integer', nullable: true })
  heartRate: number; // bpm

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @ManyToOne('User', 'exercises', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: any;

  @Column()
  userId: number;
} 