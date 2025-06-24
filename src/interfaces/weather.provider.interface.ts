import { IWeatherApiResponse } from './weather-api-response.interface';

export interface IWeatherProvider {
  getWeather(city: string): Promise<IWeatherApiResponse>;
  setNextProvider(provider: IWeatherProvider): void;
}
