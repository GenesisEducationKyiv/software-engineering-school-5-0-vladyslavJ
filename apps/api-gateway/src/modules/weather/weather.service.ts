import { Injectable, Inject } from '@nestjs/common';
import { WeatherServiceInterface } from './interfaces/weather.interface';
import { WeatherServiceClientInterface } from './weather-client/interfaces/weather-client.interface';
import { Weather } from '../../../../../libs/common/interfaces/weather.interface';
import { WeatherServiceClientDiTokens } from '../../../../../libs/common/di/weather-di-tokens';
import { Empty } from '../../../../../libs/common/types/empty.type';

@Injectable()
export class WeatherService implements WeatherServiceInterface {
  constructor(
    @Inject(WeatherServiceClientDiTokens.WEATHER_SERVICE_CLIENT)
    private readonly weatherClient: WeatherServiceClientInterface,
  ) {}

  async getWeather(req: { city: string }): Promise<Weather> {
    return this.weatherClient.getWeather(req);
  }

  async getMetrics(req: Empty): Promise<{ metrics: string }> {
    return this.weatherClient.getMetrics(req);
  }
}
