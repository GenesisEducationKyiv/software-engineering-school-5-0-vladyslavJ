import { Subscription } from '../../models/subscription.model';
import { SubscriptionField } from '../../../shared/types/subscription-field.type';
import { SubscriptionFrequency } from '../../../shared/enums/subscription-frequency.enum';

export interface ISubscriptionRepository {
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
