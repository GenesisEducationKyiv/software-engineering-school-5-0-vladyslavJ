import { Module } from '@nestjs/common';
import { NotificationGrpcController } from './infrastructure/adapters/primary/entry-points/notification.grpc.controller';
import { NotificationService } from './application/services/notification.service';
import { SendNotificationUseCase } from './application/use-cases/send-notification.use-case';
import { SendWeatherDigestUseCase } from './application/use-cases/send-weather-digest.use-case';
import { EmailGrpcClientModule } from './email-grpc-client.module';
import { SubscriptionGrpcClientModule } from './subscription-grpc-client.module';
import { WeatherGrpcClientModule } from './weather-grpc-client.module';

@Module({
  imports: [EmailGrpcClientModule, SubscriptionGrpcClientModule, WeatherGrpcClientModule],
  controllers: [NotificationGrpcController],
  providers: [NotificationService, SendNotificationUseCase, SendWeatherDigestUseCase],
  exports: [NotificationService],
})
export class NotificationModule {}
