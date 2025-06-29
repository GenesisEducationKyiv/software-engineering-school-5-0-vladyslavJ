import { IWeatherApiResponse } from '../interfaces/weather-api-response.interface';

export function condenseWeatherApiResponse(response: IWeatherApiResponse): object {
  if (!response) return {};
  return {
    location: response.location
      ? {
          name: response.location.name,
          country: response.location.country,
          localtime: response.location.localtime,
        }
      : undefined,
    current: response.current
      ? {
          temp_c: response.current.temp_c,
          temp_f: response.current.temp_f,
          condition: response.current.condition?.text,
          wind_kph: response.current.wind_kph,
          humidity: response.current.humidity,
          feelslike_c: response.current.feelslike_c,
        }
      : undefined,
  };
}
