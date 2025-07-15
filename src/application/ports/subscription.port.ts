import { SubscriptionFrequency } from '../../shared/enums/subscription-frequency.enum';

export interface ISubscriptionInputPort {
  subscribe(email: string, city: string, frequency: SubscriptionFrequency): Promise<void>;
  confirm(token: string): Promise<void>;
  unsubscribe(token: string): Promise<void>;
  sendDigest(frequency: SubscriptionFrequency): Promise<void>;
}
