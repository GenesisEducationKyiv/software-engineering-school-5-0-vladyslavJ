import {
  Subscription,
  Frequency,
} from '../../../infrastructure/database/entities/subscription.entity';
import { SubscriptionField } from '../../../shared/types/subscription-field.type';

export interface ISubscriptionRepository {
  findByToken(token: string, field: SubscriptionField): Promise<Subscription | null>;
  findExisting(email: string, city: string, frequency: Frequency): Promise<Subscription | null>;
  save(sub: Partial<Subscription>): Promise<Subscription>;
  confirm(sub: Subscription): Promise<void>;
  remove(sub: Subscription): Promise<void>;
  findConfirmedByFrequency(frequency: Frequency): Promise<Subscription[]>;
}
