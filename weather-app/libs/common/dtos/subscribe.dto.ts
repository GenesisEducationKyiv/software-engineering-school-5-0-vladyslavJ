import { SubscriptionFrequency } from "../enums/subscription-frequency.enum";

export interface SubscribeDto {
  email: string;
  city: string;
  frequency: SubscriptionFrequency;
}
