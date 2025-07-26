import { Weather } from '../../../../../../libs/common/interfaces/weather.interface';

export interface WeatherServiceClientInterface {
  getWeather(req: { city: string }): Promise<Weather>;
}
