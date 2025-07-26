import { Weather } from '../../../../../../libs/common/interfaces/weather.interface';

export interface WeatherServiceInterface {
  getWeather(req: { city: string }): Promise<Weather>;
}
