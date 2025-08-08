import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { LogRetentionService } from './log-retention.service';
import { LogRetentionDiTokens } from './di/di-tokens';
import configuration from '../../config/configuration';
import { LoggerModule } from '../logger/logger.module';
import { LoggerDiTokens } from '../logger/di/di-tokens';
import { LoggerInterface } from '../logger/interfaces/logger.interface';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
    LoggerModule,
  ],
  providers: [
    {
      provide: LogRetentionDiTokens.LOG_RETENTION_SERVICE,
      useFactory: (configService: ConfigService, logger: LoggerInterface) => {
        return new LogRetentionService(configService, logger);
      },
      inject: [ConfigService, LoggerDiTokens.LOGGER],
    },
  ],
  exports: [LogRetentionDiTokens.LOG_RETENTION_SERVICE],
})
export class LogRetentionModule {}
