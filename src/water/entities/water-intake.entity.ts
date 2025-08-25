import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('water_intakes')
export class WaterIntake {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number; // in ml

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  datetime: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @ManyToOne('User', 'waterIntakes', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: any;

  @Column()
  userId: number;
} 