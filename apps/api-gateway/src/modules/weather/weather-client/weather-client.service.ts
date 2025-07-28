import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcToObservable } from '../../../../../../libs/common/types/observable';
import { lastValueFrom } from 'rxjs';
import { WeatherServiceClientInterface } from './interfaces/weather-client.interface';
import { Weather } from '../../../../../../libs/common/models/weather.model';
import { GrpcClientDiTokens } from '../../../../../../libs/common/di/grpc-client-di-tokens';
import { Empty } from '../../../../../../libs/common/types/empty.type';

@Injectable()
export class WeatherServiceClient implements OnModuleInit, WeatherServiceClientInterface {
  constructor(
    @Inject(GrpcClientDiTokens.WEATHER_SERVICE_GRPC_CLIENT)
    private readonly client: ClientGrpc,
  ) {}
  private serviceClient!: GrpcToObservable<WeatherServiceClientInterface>;

  onModuleInit() {
    this.serviceClient =
      this.client.getService<GrpcToObservable<WeatherServiceClientInterface>>('WeatherService');
  }

  async getWeather(req: { city: string }): Promise<Weather> {
    return lastValueFrom(this.serviceClient.getWeather(req));
  }

  async getMetrics(req: Empty): Promise<{ metrics: string }> {
    return lastValueFrom(this.serviceClient.getMetrics(req));
  }
}
