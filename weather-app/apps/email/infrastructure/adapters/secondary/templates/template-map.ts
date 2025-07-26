import { EmailType } from '../../../../../../libs/common/enums/email-type.enum';
import { Notification } from '../../../../../../libs/common/types/notification-request.type';
import {
  confirmTpl,
  confirmedTpl,
  goodbyeTpl,
  digestTpl,
} from '../../../../../../libs/common/utils/email-templates.util';
import { SubscriptionFrequency } from '../../../../../../libs/common/enums/subscription-frequency.enum';
import { Weather } from '../../../../../../libs/common/interfaces/weather.interface';

const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:3000';

export const templateMap: Record<
  EmailType,
  (notification: Notification) => { subject: string; html: string }
> = {
  [EmailType.SUBSCRIPTION_CONFIRMATION]: notification => {
    const data = notification.data as { confirmationToken: string };
    return confirmTpl(APP_BASE_URL, data.confirmationToken);
  },

  [EmailType.CONFIRMED_SUBSCRIPTION]: notification => {
    const data = notification.data as {
      city: string;
      frequency: SubscriptionFrequency.HOURLY | SubscriptionFrequency.DAILY;
      unsubscribeToken: string;
    };
    return confirmedTpl(
      APP_BASE_URL,
      notification.email,
      data.city,
      data.frequency,
      data.unsubscribeToken,
    );
  },

  [EmailType.UNSUBSCRIPTION_GOODBYE]: notification => {
    const data = notification.data as { city: string };
    return goodbyeTpl(data.city);
  },

  [EmailType.DAILY_DIGEST]: notification => {
    const data = notification.data as {
      city: string;
      date: string;
      weather: Weather;
      unsubscribeToken: string;
    };
    return digestTpl(APP_BASE_URL, data.city, data.weather, data.date, data.unsubscribeToken);
  },

  [EmailType.HOURLY_DIGEST]: notification => {
    const data = notification.data as {
      city: string;
      date: string;
      weather: Weather;
      unsubscribeToken: string;
    };
    return digestTpl(APP_BASE_URL, data.city, data.weather, data.date, data.unsubscribeToken);
  },
};
