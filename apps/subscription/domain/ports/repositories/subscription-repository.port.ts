import { Subscription } from '../../../../../libs/common/models/subscription.entity';
import { SubscriptionFrequency } from '../../../../../libs/common/enums/subscription-frequency.enum';

export type SubscriptionField = 'confirmation_token' | 'unsubscribe_token';

export interface SubscriptionRepositoryInterface {
  save(sub: Partial<Subscription>): Promise<Subscription>;
  confirm(sub: Subscription): Promise<void>;
  remove(sub: Subscription): Promise<void>;
  findByToken(token: string, field: SubscriptionField): Promise<Subscription | null>;
  findExisting(
    email: string,
    city: string,
    frequency: SubscriptionFrequency,
  ): Promise<Subscription | null>;
  findConfirmedByFrequency(frequency: SubscriptionFrequency): Promise<Subscription[]>;
}
