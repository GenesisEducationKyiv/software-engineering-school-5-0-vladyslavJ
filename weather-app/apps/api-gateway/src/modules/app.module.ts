import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeatherModule } from './weather/weather.module';
import { WeatherServiceClientModule } from './weather-client/weather-client.module';
import configuration from '../../../../libs/config/configuration';
import { SubscriptionModule } from './subscription/subscription.module';
import { SubscriptionServiceClientModule } from './subscription-client/subscription-client.module';
import { NotificationServiceClientModule } from './notification-client/notification-client.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    WeatherServiceClientModule,
    WeatherModule,
    SubscriptionServiceClientModule,
    SubscriptionModule,
    NotificationServiceClientModule,
  ],
})
export class AppModule {}
