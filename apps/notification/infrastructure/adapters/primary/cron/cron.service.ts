import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Notification } from '../../../../../../libs/common/types/notification-request.type';
import { SubscriptionFrequency } from '../../../../../../libs/common/enums/subscription-frequency.enum';
import { EmailType } from '../../../../../../libs/common/enums/email-type.enum';
import { SubscriptionServiceClientDiTokens } from '../../../../../../libs/common/di/subscription-di-tokens';
import { WeatherServiceClientDiTokens } from '../../secondary/weather/di/weather-client-di-tokens';
import { WeatherServiceClientInterface } from '../../secondary/weather/interfaces/weather-client.interface';
import { SubscriptionServiceClientInterface } from '../../secondary/subscription/interfaces/subscription-client.interface';
import { LoggerDiTokens } from '../../../../../../libs/modules/logger/di/di-tokens';
import { ILogger } from '../../../../../../libs/modules/logger/interfaces/logger.interface';
import { CronServiceInterface } from './interfaces/cron.interface';
import { DigestPublisherInterface } from '../../secondary/digest-publisher/interfaces/digest-publisher.interface';
import { DigestServiceDiTokens } from '../../secondary/digest-publisher/di/digest-publisher-di-tokens';
import CRON_FREQUENCY from '../../../../../../libs/common/utils/constants/cron.constant';
import { SubscriptionModel } from '../../../../../../libs/common/models/subscription.model';

@Injectable()
export class CronService implements CronServiceInterface {
  constructor(
    @Inject(WeatherServiceClientDiTokens.WEATHER_SERVICE_CLIENT)
    private readonly weatherService: WeatherServiceClientInterface,
    @Inject(SubscriptionServiceClientDiTokens.SUBSCRIPTION_SERVICE_CLIENT)
    private readonly subscriptionService: SubscriptionServiceClientInterface,
    @Inject(DigestServiceDiTokens.DIGEST_PUBLISHER)
    private readonly digestPublisher: DigestPublisherInterface,
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: ILogger,
  ) {}

  @Cron(CRON_FREQUENCY.HOURLY, { name: 'hourly-digest' })
  async handleHourlyWeatherDigestCron(): Promise<void> {
    const { subscriptions: hourlySubscribers } = await this.subscriptionService.getByFrequency({
      frequency: SubscriptionFrequency.HOURLY,
    });
    if (!hourlySubscribers.length) {
      this.logger.info('No subscribers for hourly digest');
      return;
    }

    const notifications: Notification[] = await Promise.all(
      hourlySubscribers.map(async (sub: SubscriptionModel) => ({
        type: EmailType.HOURLY_DIGEST,
        email: sub.email,
        data: {
          city: sub.city,
          date: new Date().toISOString(),
          weather: await this.weatherService.getWeather({ city: sub.city }),
          unsubscribeToken: sub.unsubscribeToken,
        },
      })),
    );

    for (const notification of notifications) {
      await this.digestPublisher.publishDigest(notification);
    }
  }

  @Cron(CRON_FREQUENCY.DAILY, { name: 'daily-digest' })
  async handleDailyWeatherDigestCron(): Promise<void> {
    const { subscriptions: dailySubscribers } = await this.subscriptionService.getByFrequency({
      frequency: SubscriptionFrequency.DAILY,
    });
    if (!dailySubscribers.length) {
      this.logger.info('No subscribers for daily digest');
      return;
    }

    const notifications: Notification[] = await Promise.all(
      dailySubscribers.map(async (sub: SubscriptionModel) => ({
        type: EmailType.DAILY_DIGEST,
        email: sub.email,
        data: {
          city: sub.city,
          date: new Date().toISOString().slice(0, 10),
          weather: await this.weatherService.getWeather({ city: sub.city }),
          unsubscribeToken: sub.unsubscribeToken,
        },
      })),
    );

    for (const notification of notifications) {
      await this.digestPublisher.publishDigest(notification);
    }
  }
}
