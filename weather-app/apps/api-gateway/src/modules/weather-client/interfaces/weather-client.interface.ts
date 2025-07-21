import { Weather } from '../../../../../../libs/common/interfaces/weather.interface';

export interface IWeatherServiceClient {
  getWeather(req: { city: string }): Promise<Weather>;
}
