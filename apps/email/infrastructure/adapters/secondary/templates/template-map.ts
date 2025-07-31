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
import { validateNotificationData } from '../validators/notification-validator';
import { APP_BASE_URL } from '../../../config/env';

export const templateMap: Record<
  EmailType,
  (notification: Notification) => { subject: string; html: string }
> = {
  [EmailType.SUBSCRIPTION_CONFIRMATION]: notification => {
    const data = notification.data as { confirmationToken: string };
    validateNotificationData(EmailType.SUBSCRIPTION_CONFIRMATION, data);
    return confirmTpl(APP_BASE_URL, data.confirmationToken);
  },

  [EmailType.CONFIRMED_SUBSCRIPTION]: notification => {
    const data = notification.data as {
      city: string;
      frequency: SubscriptionFrequency.HOURLY | SubscriptionFrequency.DAILY;
      unsubscribeToken: string;
    };
    validateNotificationData(EmailType.CONFIRMED_SUBSCRIPTION, data);
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
    validateNotificationData(EmailType.UNSUBSCRIPTION_GOODBYE, data);
    return goodbyeTpl(data.city);
  },

  [EmailType.DAILY_DIGEST]: notification => {
    const data = notification.data as {
      city: string;
      date: string;
      weather: Weather;
      unsubscribeToken: string;
    };
    validateNotificationData(EmailType.DAILY_DIGEST, data);
    return digestTpl(APP_BASE_URL, data.city, data.weather, data.date, data.unsubscribeToken);
  },

  [EmailType.HOURLY_DIGEST]: notification => {
    const data = notification.data as {
      city: string;
      date: string;
      weather: Weather;
      unsubscribeToken: string;
    };
    validateNotificationData(EmailType.HOURLY_DIGEST, data);
    return digestTpl(APP_BASE_URL, data.city, data.weather, data.date, data.unsubscribeToken);
  },
};
