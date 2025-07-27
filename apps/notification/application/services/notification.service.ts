import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Notification } from '../../../../libs/common/types/notification-request.type';
import { SendNotificationUseCase } from '../use-cases/send-notification.use-case';
import { SendWeatherDigestUseCase } from '../use-cases/send-weather-digest.use-case';
import { NotificationInputPortInterface } from '../ports/notification.port';
import { Empty } from '../../../../libs/common/types/empty.type';
import { SubscriptionFrequency } from '../../../../libs/common/enums/subscription-frequency.enum';
import { EmailType } from '../../../../libs/common/enums/email-type.enum';
import { Subscription } from '../../../../libs/common/models/subscription.entity';
import { SubscriptionServiceClientDiTokens } from '../../../../libs/common/di/subscription-di-tokens';
import { WeatherServiceClientDiTokens } from '../../../api-gateway/src/modules/weather/weather-client/di/weather-client-di-tokens';
import { WeatherServiceClientInterface } from '../../infrastructure/adapters/secondary/weather/interfaces/weather-client.interface';
import { SubscriptionServiceClientInterface } from '../../infrastructure/adapters/secondary/subscription/interfaces/subscription-client.interface';
import { LoggerDiTokens } from '../../../../libs/modules/logger/di/di-tokens';
import { ILogger } from '../../../../libs/modules/logger/interfaces/logger.interface';
import { EmailResponseInterface } from '../../../../libs/common/interfaces/emai-response.interface';

@Injectable()
export class NotificationService implements NotificationInputPortInterface {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase,
    private readonly sendWeatherDigestUseCase: SendWeatherDigestUseCase,
    @Inject(WeatherServiceClientDiTokens.WEATHER_SERVICE_CLIENT)
    private readonly weatherService: WeatherServiceClientInterface,
    @Inject(SubscriptionServiceClientDiTokens.SUBSCRIPTION_SERVICE_CLIENT)
    private readonly subscriptionService: SubscriptionServiceClientInterface,
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: ILogger,
  ) {}

  async sendNotification(data: Notification): Promise<EmailResponseInterface> {
    return await this.sendNotificationUseCase.execute(data);
  }

  async sendDigest(digests: Notification[]): Promise<Empty> {
    await this.sendWeatherDigestUseCase.execute(digests);
    return {};
  }

  @Cron('0 * * * *', { name: 'hourly-digest' })
  async handleHourlyWeatherDigestCron(): Promise<void> {
    const hourlySubscribers = await this.subscriptionService.getByFrequency(
      SubscriptionFrequency.HOURLY,
    );
    if (!hourlySubscribers.length) {
      this.logger.info('No subscribers for hourly digest');
      return;
    }

    const notifications: Notification[] = await Promise.all(
      hourlySubscribers.map(async (sub: Subscription) => ({
        type: EmailType.HOURLY_DIGEST,
        email: sub.email,
        data: {
          city: sub.city,
          date: new Date().toISOString(),
          weather: await this.weatherService.getWeather({ city: sub.city }),
          unsubscribeToken: sub.unsubscribe_token,
        },
      })),
    );

    await this.sendDigest(notifications);
  }

  @Cron('0 7 * * *', { name: 'daily-digest' })
  async handleDailyWeatherDigestCron(): Promise<void> {
    const dailySubscribers = await this.subscriptionService.getByFrequency(
      SubscriptionFrequency.DAILY,
    );
    if (!dailySubscribers.length) {
      this.logger.info('No subscribers for daily digest');
      return;
    }

    const notifications: Notification[] = await Promise.all(
      dailySubscribers.map(async (sub: Subscription) => ({
        type: EmailType.DAILY_DIGEST,
        email: sub.email,
        data: {
          city: sub.city,
          date: new Date().toISOString().slice(0, 10),
          weather: await this.weatherService.getWeather({ city: sub.city }),
          unsubscribeToken: sub.unsubscribe_token,
        },
      })),
    );

    await this.sendDigest(notifications);
  }
}
