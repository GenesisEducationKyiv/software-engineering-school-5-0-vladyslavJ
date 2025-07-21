import { Weather } from '../../../../../../libs/common/interfaces/weather.interface';

export interface IWeatherService {
  getWeather(req: { city: string }): Promise<Weather>;
}
