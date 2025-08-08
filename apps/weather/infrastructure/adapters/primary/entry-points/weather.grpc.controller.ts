import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { WeatherService } from '../../../../application/services/weather.service';
import { WeatherMicroserviceInterface } from '../../../../../../libs/common/interfaces/weather-microservice.interface';
import { MetricsDiTokens } from '../../../../../../libs/modules/metrics/di/di-tokens';
import { CacheMetricServiceInterface } from '../../../../../../libs/modules/metrics/interfaces/cache-metric-service.interface';
import { Empty } from '../../../../../../libs/common/types/empty.type';
import { GRPC_SERVICES } from '../../../../../../libs/common/constants/grpc-service.const';
import { GRPC_METHODS } from '../../../../../../libs/common/constants/grpc-method.const';

@Controller()
export class WeatherGrpcController implements WeatherMicroserviceInterface {
  constructor(
    private readonly weatherService: WeatherService,
    @Inject(MetricsDiTokens.CACHE_METRIC_SERVICE)
    private readonly cacheMetricsService: CacheMetricServiceInterface,
  ) {}

  @GrpcMethod(GRPC_SERVICES.WEATHER, GRPC_METHODS.WEATHER.GET_WEATHER)
  async getWeather(req: { city: string }) {
    try {
      return await this.weatherService.getWeather(req.city);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        code: 13,
        message: 'Internal server error',
      });
    }
  }

  @GrpcMethod(GRPC_SERVICES.WEATHER, GRPC_METHODS.WEATHER.GET_METRICS)
  async getMetrics(req: Empty) {
    try {
      const metrics = await this.cacheMetricsService.getMetrics(req);
      return { metrics };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        code: 13,
        message: 'Internal server error',
      });
    }
  }
}
