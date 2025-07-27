/*import { IOpenWeatherMapResponse } from '../../interfaces/open-weather-map-response.interface';
import { IWeatherApiResponse } from '../../interfaces/weather-api-response.interface';
import { mapOpenWeatherMapToWeatherApiResponse } from '../../mappers/open-weather-map.mapper';

export function condenseWeatherApiResponse(response: IWeatherApiResponse): object;
export function condenseWeatherApiResponse(response: IOpenWeatherMapResponse): object;
export function condenseWeatherApiResponse(
  response: IWeatherApiResponse | IOpenWeatherMapResponse,
): object {
  if (!response) return {};

  let unifiedResponse: IWeatherApiResponse;

  // Check if it's an OpenWeatherMap response by looking for a unique property like 'coord'
  if ('coord' in response) {
    unifiedResponse = mapOpenWeatherMapToWeatherApiResponse(response as IOpenWeatherMapResponse);
  } else {
    unifiedResponse = response as IWeatherApiResponse;
  }

  return {
    location: unifiedResponse.location
      ? {
          name: unifiedResponse.location.name,
          country: unifiedResponse.location.country,
          localtime: unifiedResponse.location.localtime,
        }
      : undefined,
    current: unifiedResponse.current
      ? {
          temp_c: unifiedResponse.current.temp_c,
          temp_f: unifiedResponse.current.temp_f,
          condition: unifiedResponse.current.condition?.text,
          wind_kph: unifiedResponse.current.wind_kph,
          humidity: unifiedResponse.current.humidity,
          feelslike_c: unifiedResponse.current.feelslike_c,
        }
      : undefined,
  };
}*/
