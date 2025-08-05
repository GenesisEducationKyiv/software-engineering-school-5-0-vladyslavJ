import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeatherModule } from './weather/weather.module';
import configuration from '../../../../libs/config/configuration';
import { SubscriptionModule } from './subscription/subscription.module';
import { LoggerModule } from '../../../../libs/modules/logger/logger.module';
import { LogRetentionModule } from '../../../../libs/modules/log-retention/log-retention.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    LoggerModule,
    LogRetentionModule,
    WeatherModule,
    SubscriptionModule,
  ],
})
export class AppModule {}
