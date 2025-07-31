import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { DigestServiceDiTokens } from '../../secondary/digest-publisher/di/digest-publisher-di-tokens';
import { WeatherServiceClientModule } from '../../secondary/weather/weather-client.module';
import { SubscriptionServiceClientModule } from '../../secondary/subscription/subscription-client.module';
import { DigestPublisherModule } from '../../secondary/digest-publisher/digest-publisher.module';
import { LoggerModule } from '../../../../../../libs/modules/logger/logger.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    WeatherServiceClientModule,
    SubscriptionServiceClientModule,
    DigestPublisherModule,
    LoggerModule,
  ],
  providers: [
    {
      provide: DigestServiceDiTokens.DIGEST_CRON_SERVICE,
      useClass: CronService,
    },
  ],
  exports: [DigestServiceDiTokens.DIGEST_CRON_SERVICE],
})
export class CronModule {}
