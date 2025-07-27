import { Module } from '@nestjs/common';
import { NotificationGrpcController } from './infrastructure/adapters/primary/entry-points/notification.grpc.controller';
import { NotificationService } from './application/services/notification.service';
import { SendNotificationUseCase } from './application/use-cases/send-notification.use-case';
import { SendWeatherDigestUseCase } from './application/use-cases/send-weather-digest.use-case';
import { WeatherServiceClientModule } from './infrastructure/adapters/secondary/weather/weather-client.module';
import { SubscriptionServiceClientModule } from './infrastructure/adapters/secondary/subscription/subscription-client.module';
import { EmailServiceClientModule } from './infrastructure/adapters/secondary/email/email-client.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './infrastructure/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    WeatherServiceClientModule,
    SubscriptionServiceClientModule,
    EmailServiceClientModule,
  ],
  controllers: [NotificationGrpcController],
  providers: [NotificationService, SendNotificationUseCase, SendWeatherDigestUseCase],
  exports: [NotificationService],
})
export class NotificationModule {}
