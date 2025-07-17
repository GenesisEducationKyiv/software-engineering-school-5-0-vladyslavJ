import { Weather } from '../../../../../../libs/common/interfaces/weather.interface';

export interface IWeatherServiceClient {
  getWeather(city: string): Promise<Weather>;
}
