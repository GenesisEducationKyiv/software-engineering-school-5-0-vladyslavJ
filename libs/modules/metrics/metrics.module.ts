import { Module, Global } from '@nestjs/common';
import { CacheMetricService } from './cache-metric.service';
import { MetricsDiTokens } from './di/di-tokens';

@Global()
@Module({
  providers: [
    {
      provide: MetricsDiTokens.CACHE_METRIC_SERVICE,
      useClass: CacheMetricService,
    },
  ],
  exports: [MetricsDiTokens.CACHE_METRIC_SERVICE],
})
export class MetricsModule {}
