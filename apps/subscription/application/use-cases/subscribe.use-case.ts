import { Injectable, Inject } from '@nestjs/common';
import { SubscriptionDto } from '../../../../libs/common/dtos/subscription.dto';
import { LoggerDiTokens } from '../../../../libs/modules/logger/di/di-tokens';
import { ILogger } from '../../../../libs/modules/logger/interfaces/logger.interface';
import { SubscriptionRepositoryInterface } from '../../domain/ports/repositories/subscription-repository.port';
import { genToken } from '../../../../libs/common/utils/gen-token.util';
import { RpcException } from '@nestjs/microservices';
import { GrpcCode } from '../../../../libs/common/enums/grpc-codes.enum';
import { NotificationServiceClientInterface } from '../../infrastructure/adapters/secondary/notification/interfaces/notification-client.interface';
import { EmailType } from '../../../../libs/common/enums/email-type.enum';
import { Empty } from '../../../../libs/common/types/empty.type';
import { SubscriptionRepoDiTokens } from '../../infrastructure/database/di/di-tokens';
import { NotificationServiceClientDiTokens } from '../../infrastructure/adapters/secondary/notification/di/notification-client-di-tokens';
import { WeatherServiceClientDiTokens } from '../../infrastructure/adapters/secondary/weather/di/weather-client-di-tokens';
import { WeatherServiceClientInterface } from '../../infrastructure/adapters/secondary/weather/interfaces/weather-client.interface';

@Injectable()
export class SubscribeUseCase {
  constructor(
    @Inject(SubscriptionRepoDiTokens.SUBSCRIPTION_REPOSITORY)
    private readonly repo: SubscriptionRepositoryInterface,
    @Inject(NotificationServiceClientDiTokens.NOTIFICATION_SERVICE_CLIENT)
    private readonly notificationClient: NotificationServiceClientInterface,
    @Inject(WeatherServiceClientDiTokens.WEATHER_SERVICE_CLIENT)
    private readonly weatherClient: WeatherServiceClientInterface,
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: ILogger,
  ) {}

  async subscribe(req: SubscriptionDto): Promise<Empty> {
    const { email, city, frequency } = req;

    await this.weatherClient.getWeather({ city: req.city });

    const confirmationToken = genToken();
    const unsubscribeToken = genToken();

    this.logger.info(`Trying to subscribe: email=${email}, city=${city}, frequency=${frequency}`);

    const existing = await this.repo.findExisting(email, city, frequency);
    if (existing) {
      this.logger.warn(`Subscription already exists`);
      throw new RpcException({
        code: GrpcCode.ABORTED,
        message: 'Email already subscribed',
      });
    }

    await this.repo.save({
      email: email,
      city: city,
      frequency: frequency,
      confirmationToken: confirmationToken,
      unsubscribeToken: unsubscribeToken,
    });
    this.logger.info(`Subscription created`);

    await this.notificationClient.sendNotification({
      type: EmailType.SUBSCRIPTION_CONFIRMATION,
      email: email,
      data: { confirmationToken: confirmationToken },
    });
    this.logger.info(`Subscription confirmation email sent`);

    return {};
  }
}
