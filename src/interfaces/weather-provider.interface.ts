import { IWeatherApiResponse } from './weather-api-response.interface';

export interface IWeatherApiProvider {
  fetchCurrentWeather(city: string): Promise<IWeatherApiResponse>;
  setNextProvider(provider: IWeatherApiProvider): void;
}
