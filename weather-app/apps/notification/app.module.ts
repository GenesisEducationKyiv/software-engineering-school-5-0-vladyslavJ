import { Module } from '@nestjs/common';
import { SubscriptionServiceClientModule } from '../api-gateway/src/modules/subscription-client/subscription-client.module';
import { NotificationGrpcController } from './infrastructure/adapters/primary/entry-points/notification.grpc.controller';
import { NotificationService } from './application/services/notification.service';
import { WeatherServiceClientModule } from '../api-gateway/src/modules/weather-client/weather-client.module';
import { EmailModule } from '../email/app.module';
import { SendNotificationUseCase } from './application/use-cases/send-notification.use-case';
import { SendWeatherDigestUseCase } from './application/use-cases/send-weather-digest.use-case';
@Module({
  imports: [SubscriptionServiceClientModule, WeatherServiceClientModule, EmailModule],
  controllers: [NotificationGrpcController],
  providers: [NotificationService, SendNotificationUseCase, SendWeatherDigestUseCase],
})
export class NotificationModule {}
