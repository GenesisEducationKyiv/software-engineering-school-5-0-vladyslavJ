import { Module } from '@nestjs/common';
import { NotificationGrpcController } from './infrastructure/adapters/primary/entry-points/notification.grpc.controller';
import { NotificationService } from './application/services/notification.service';
import { SendNotificationUseCase } from './application/use-cases/send-notification.use-case';
import { WeatherServiceClientModule } from './infrastructure/adapters/secondary/weather/weather-client.module';
import { SubscriptionServiceClientModule } from './infrastructure/adapters/secondary/subscription/subscription-client.module';
import { EmailServiceClientModule } from './infrastructure/adapters/secondary/email/email-client.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './infrastructure/config/configuration';
import { LoggerModule } from '../../libs/modules/logger/logger.module';
import { DigestPublisherModule } from './infrastructure/adapters/secondary/digest-publisher/digest-publisher.module';
import { CronModule } from './infrastructure/adapters/primary/cron/cron.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    CronModule,
    WeatherServiceClientModule,
    SubscriptionServiceClientModule,
    EmailServiceClientModule,
    DigestPublisherModule,
    LoggerModule,
  ],
  controllers: [NotificationGrpcController],
  providers: [NotificationService, SendNotificationUseCase],
  exports: [NotificationService],
})
export class NotificationModule {}
