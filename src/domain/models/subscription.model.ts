import { SubscriptionFrequency } from '../../shared/enums/subscription-frequency.enum';

export class Subscription {
  id!: string;
  email!: string;
  city!: string;
  frequency!: SubscriptionFrequency;
  confirmed!: boolean;
  confirmation_token!: string;
  unsubscribe_token!: string;
  created_at!: Date;
  updated_at!: Date;
}
