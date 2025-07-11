import { Frequency } from '../../infrastructure/database/entities/subscription.entity';
import { SubscriptionFrequencyEnum } from '../../shared/enums/subscription-frequency.enum';

export interface ISubscriptionInputPort {
  subscribe(email: string, city: string, frequency: Frequency): Promise<void>;
  confirm(token: string): Promise<void>;
  unsubscribe(token: string): Promise<void>;
  sendDigest(frequency: SubscriptionFrequencyEnum): Promise<void>;
}
