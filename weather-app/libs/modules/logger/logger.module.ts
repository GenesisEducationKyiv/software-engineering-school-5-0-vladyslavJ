import { Module, Global } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerDiTokens } from './di/di-tokens';

@Global()
@Module({
  providers: [
    {
      provide: LoggerDiTokens.LOGGER,
      useClass: LoggerService,
    },
  ],
  exports: [LoggerDiTokens.LOGGER],
})
export class LoggerModule {}
