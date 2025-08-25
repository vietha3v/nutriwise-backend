import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Index } from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum Platform {
  ZALO = 'ZALO',
  FACEBOOK = 'FACEBOOK',
  TELEGRAM = 'TELEGRAM',
  WEB = 'WEB',
  MOBILE = 'MOBILE'
}

@Entity('user_platforms')
@Index(['platform', 'platformUserId'], { unique: true })
export class UserPlatform {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: Platform
  })
  platform: Platform;

  @Column()
  platformUserId: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  verifiedAt: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
