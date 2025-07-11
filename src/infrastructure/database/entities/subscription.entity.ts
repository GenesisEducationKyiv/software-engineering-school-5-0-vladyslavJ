import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type Frequency = 'hourly' | 'daily';

@Entity({ name: 'subscriptions' })
@Index(['email', 'city', 'frequency'], { unique: true })
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  email!: string;

  @Column({ type: 'varchar' })
  city!: string;

  @Column({ type: 'varchar' })
  frequency!: Frequency;

  @Column({ type: 'boolean', default: false })
  confirmed!: boolean;

  @Column({ type: 'varchar' })
  confirmation_token!: string;

  @Column({ type: 'varchar' })
  unsubscribe_token!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
