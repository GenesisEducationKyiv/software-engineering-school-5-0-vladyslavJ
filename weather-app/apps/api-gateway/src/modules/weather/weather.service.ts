import { Injectable } from '@nestjs/common';
import { WeatherServiceClient } from '../weather-client/weather-client.service';
import { IWeatherService } from './interfaces/weather.interface';
import { Weather } from '../../../../../libs/common/interfaces/weather.interface';

@Injectable()
export class WeatherService implements IWeatherService {
  constructor(private readonly weatherClient: WeatherServiceClient) {}

  async getWeather(city: string): Promise<Weather> {
    return this.weatherClient.getWeather(city);
  }
}
