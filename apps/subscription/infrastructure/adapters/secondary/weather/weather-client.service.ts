import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcToObservable } from '../../../../../../libs/common/types/observable';
import { firstValueFrom } from 'rxjs';
import { WeatherServiceClientInterface } from './interfaces/weather-client.interface';
import { Weather } from '../../../../../../libs/common/models/weather.model';
import { GrpcClientDiTokens } from '../../../../../../libs/common/di/grpc-client-di-tokens';
import { LoggerDiTokens } from '../../../../../../libs/modules/logger/di/di-tokens';
import { LoggerInterface } from '../../../../../../libs/modules/logger/interfaces/logger.interface';
import { GRPC_SERVICES } from '../../../../../../libs/common/constants/grpc-service.const';
@Injectable()
export class WeatherServiceClient implements OnModuleInit, WeatherServiceClientInterface {
  constructor(
    @Inject(GrpcClientDiTokens.WEATHER_SERVICE_GRPC_CLIENT)
    private readonly client: ClientGrpc,
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: LoggerInterface,
  ) {}
  private serviceClient!: GrpcToObservable<WeatherServiceClientInterface>;

  onModuleInit() {
    this.serviceClient = this.client.getService<GrpcToObservable<WeatherServiceClientInterface>>(
      GRPC_SERVICES.WEATHER,
    );
    this.logger.setContext(WeatherServiceClient.name);
    this.logger.info('gRPC WeatherServiceClient initialized');
  }

  async getWeather(req: { city: string }): Promise<Weather> {
    this.logger.info(`getWeather called for city: ${req.city}`);
    try {
      return await firstValueFrom(this.serviceClient.getWeather(req));
    } catch (error) {
      this.logger.error('Error getting weather', error);
      throw error;
    }
  }
}
