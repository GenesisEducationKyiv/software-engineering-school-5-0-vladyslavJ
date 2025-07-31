import { SubscriptionFrequency } from '../enums/subscription-frequency.enum';

export class SubscriptionModel {
  id!: string;
  email!: string;
  city!: string;
  frequency!: SubscriptionFrequency;
  confirmed!: boolean;
  confirmationToken!: string;
  unsubscribeToken!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
