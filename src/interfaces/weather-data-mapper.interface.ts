import { WeatherDto } from '../dto/weather.dto';
import { IWeatherApiResponse } from './weather-api-response.interface';

export interface IWeatherMapper {
  mapCurrentWeather(raw: IWeatherApiResponse): WeatherDto;
}
