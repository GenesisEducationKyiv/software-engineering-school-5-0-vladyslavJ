import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcToObservable } from '../../../../../libs/common/types/observable';
import { lastValueFrom } from 'rxjs';
import { IWeatherServiceClient } from './interfaces/weather-client.interface';
import { Weather } from '../../../../../libs/common/interfaces/weather.interface';
import { PackageNames } from '../../common/utils/enums/package-names.enum';

@Injectable()
export class WeatherServiceClient implements OnModuleInit, IWeatherServiceClient {
  constructor(@Inject(PackageNames.WEATHER_PACKAGE) private readonly client: ClientGrpc) {}
  private serviceClient!: GrpcToObservable<IWeatherServiceClient>;

  onModuleInit() {
    this.serviceClient =
      this.client.getService<GrpcToObservable<IWeatherServiceClient>>('WeatherService');
  }

  async getWeather(req: { city: string }): Promise<Weather> {
    return lastValueFrom(this.serviceClient.getWeather(req));
  }
}
