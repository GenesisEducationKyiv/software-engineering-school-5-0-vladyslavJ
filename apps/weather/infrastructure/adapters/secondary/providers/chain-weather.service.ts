import { Injectable, Inject } from '@nestjs/common';
import { IWeatherProviderPort } from '../../../../domain/ports/providers/weather-provider.port';
import { Weather } from '../../../../../../libs/common/models/weather.model';
import { LoggerDiTokens } from '../../../../../../libs/modules/logger/di/di-tokens';
import { LoggerInterface } from '../../../../../../libs/modules/logger/interfaces/logger.interface';
import { RpcException } from '@nestjs/microservices';
import { GrpcCode } from '../../../../../../libs/common/enums/grpc-codes.enum';

@Injectable()
export class ChainWeatherService implements IWeatherProviderPort {
  constructor(
    private readonly providers: IWeatherProviderPort[],
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: LoggerInterface,
  ) {
    this.logger.setContext(ChainWeatherService.name);
  }

  async fetchCurrentWeather(city: string): Promise<Weather> {
    for (const provider of this.providers) {
      try {
        return await provider.fetchCurrentWeather(city);
      } catch (error) {
        this.logger.warn(`Provider ${provider.constructor.name} failed: ${String(error)}`);

        let code: number;
        if (error instanceof RpcException) {
          const grpcError = error.getError();
          if (typeof grpcError === 'object' && grpcError !== null && 'code' in grpcError) {
            code = (grpcError as { code: number }).code;
            if (code === GrpcCode.NOT_FOUND || code === GrpcCode.BAD_REQUEST) {
              throw error;
            }
          }
        }
        continue;
      }
    }
    throw new RpcException({
      code: GrpcCode.SERVICE_UNAVAILABLE,
      message: 'All providers are unavailable',
      details: 'Service Unavailable',
    });
  }
}
