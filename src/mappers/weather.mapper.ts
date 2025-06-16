import { injectable } from 'tsyringe';
import { WeatherDto } from '../dto/weather.dto';
import { WeatherApiResponse } from '../types/weatherApi.interfaces';

export interface IWeatherMapper {
  mapCurrentWeather(raw: WeatherApiResponse): WeatherDto;
}

@injectable()
export class WeatherMapper implements IWeatherMapper {
  mapCurrentWeather(raw: WeatherApiResponse): WeatherDto {
    return new WeatherDto({
      temperature: raw?.current?.temp_c,
      humidity: raw?.current?.humidity,
      description: raw?.current?.condition?.text,
    });
  }
}
