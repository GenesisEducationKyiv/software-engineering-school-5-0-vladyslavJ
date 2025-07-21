import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
//import { SubscriptionModule } from './subscription/subscription.module';
import { WeatherModule } from './weather/weather.module';
import { WeatherServiceClientModule } from './weather-client/weather-client.module';
//import { SubscriptionServiceClientModule } from './subscription-client/subscription-client.module';
//import { NotificationServiceClientModule } from './notification-client/notification-client.module';
import configuration from '../common/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    WeatherModule,
    //SubscriptionModule,
    WeatherServiceClientModule,
    //SubscriptionServiceClientModule,
    //NotificationServiceClientModule,
  ],
})
export class AppModule {}
