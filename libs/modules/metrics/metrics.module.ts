import { Module, Global } from '@nestjs/common';
import { CacheMetricService } from './cache-metric.service';
import { MetricsDiTokens } from './di/di-tokens';
import { MetricService } from './metric.service';

@Global()
@Module({
  providers: [
    {
      provide: MetricsDiTokens.CACHE_METRIC_SERVICE,
      useClass: CacheMetricService,
    },
    {
      provide: MetricsDiTokens.METRIC_SERVICE,
      useClass: MetricService,
    },
  ],
  exports: [MetricsDiTokens.CACHE_METRIC_SERVICE, MetricsDiTokens.METRIC_SERVICE],
})
export class MetricsModule {}
