import { Weather } from '../models/weather.model';
import { EmailType } from '../enums/email-type.enum';
import { SubscriptionFrequency } from '../enums/subscription-frequency.enum';

export type Notification =
  | {
      type: EmailType.SUBSCRIPTION_CONFIRMATION;
      email: string;
      data: {
        confirmationToken: string;
      };
    }
  | {
      type: EmailType.CONFIRMED_SUBSCRIPTION;
      email: string;
      data: {
        city: string;
        frequency: SubscriptionFrequency.HOURLY | SubscriptionFrequency.DAILY;
        unsubscribeToken: string;
      };
    }
  | {
      type: EmailType.UNSUBSCRIPTION_GOODBYE;
      email: string;
      data: {
        city: string;
      };
    }
  | {
      type: EmailType.DAILY_DIGEST | EmailType.HOURLY_DIGEST;
      email: string;
      data: {
        city: string;
        date: string;
        weather: Weather;
        unsubscribeToken: string;
      };
    };
