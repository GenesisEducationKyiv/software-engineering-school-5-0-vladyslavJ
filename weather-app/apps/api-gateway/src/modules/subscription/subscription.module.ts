import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { SubscriptionServiceClientModule } from '../subscription-client/subscription-client.module';
import { WeatherServiceClientModule } from '../weather-client/weather-client.module';
import { NotificationServiceClientModule } from '../notification-client/notification-client.module';

@Module({
  imports: [
    SubscriptionServiceClientModule,
    WeatherServiceClientModule,
    NotificationServiceClientModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
