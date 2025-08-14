import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VOICE = 'voice',
  FILE = 'file'
}

@Entity('chat_messages')
@Index(['userId', 'createdAt'])
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  platform: string;

  @Column()
  platformUserId: string;

  @Column({
    type: 'enum',
    enum: MessageType
  })
  messageType: MessageType;

  @Column('text')
  message: string;

  @Column('text')
  response: string;

  @Column()
  intent: string;

  @Column({ type: 'float', default: 0 })
  confidence: number;

  @Column({ type: 'jsonb', nullable: true })
  context: Record<string, any>;

  @Column({ nullable: true })
  mediaUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}
