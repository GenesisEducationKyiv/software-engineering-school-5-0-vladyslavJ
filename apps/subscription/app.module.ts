import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '../../libs/modules/logger/logger.module';
import configuration from './infrastructure/config/configuration';
import { SubscriptionRepoDiTokens } from './infrastructure/database/di/di-tokens';
import { SubscriptionRepository } from './infrastructure/database/repositories/subscription.repository';
import { SubscriptionGrpcController } from './infrastructure/adapters/primary/entry-points/subscription.grpc.controller';
import { SubscriptionService } from './application/services/subscription.service';
import { SubscriptionMapper } from './infrastructure/database/mappers/subscription.mapper';
import { SubscribeUseCase } from './application/use-cases/subscribe.use-case';
import { ConfirmSubscriptionUseCase } from './application/use-cases/confirm-subscription.use-case';
import { UnsubscribeUseCase } from './application/use-cases/unsubscribe.use-case';
import { GetSubscribersByFrequencyUseCase } from './application/use-cases/get-subscribers-by-frequency.use-case';
import { WeatherServiceClientModule } from './infrastructure/adapters/secondary/weather/weather-client.module';
import { NotificationServiceClientModule } from './infrastructure/adapters/secondary/notification/notification-client.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    LoggerModule,
    WeatherServiceClientModule,
    NotificationServiceClientModule,
  ],
  controllers: [SubscriptionGrpcController],
  providers: [
    {
      provide: SubscriptionRepoDiTokens.SUBSCRIPTION_REPOSITORY,
      useClass: SubscriptionRepository,
    },
    {
      provide: SubscriptionRepoDiTokens.SUBSCRIPTION_SERVICE,
      useClass: SubscriptionService,
    },
    SubscriptionMapper,
    SubscribeUseCase,
    ConfirmSubscriptionUseCase,
    UnsubscribeUseCase,
    GetSubscribersByFrequencyUseCase,
  ],
  exports: [
    SubscriptionRepoDiTokens.SUBSCRIPTION_REPOSITORY,
    SubscriptionRepoDiTokens.SUBSCRIPTION_SERVICE,
  ],
})
export class SubscriptionModule {}
