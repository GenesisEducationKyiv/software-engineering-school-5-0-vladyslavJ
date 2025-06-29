import { IOpenWeatherMapResponse } from '../interfaces/open-weather-map-response.interface';
import { IWeatherApiResponse } from '../interfaces/weather-api-response.interface';

const KELVIN_TO_FAHRENHEIT = 1.8;
const FAHRENHEIT_OFFSET = 32;
const MPS_TO_MPH = 2.23694;
const MPS_TO_KPH = 3.6;
const HPA_TO_INHG = 0.02953;
const MM_TO_IN = 0.0393701;
const M_TO_KM = 0.001;
const M_TO_MILES = 1 / 1609.34;

export function mapOpenWeatherMapToWeatherApiResponse(
  response: IOpenWeatherMapResponse,
): IWeatherApiResponse {
  const tempC = response.main?.temp ?? 0;
  const feelsLikeC = response.main?.feels_like ?? 0;
  const windSpeed = response.wind?.speed ?? 0;
  const pressureMb = response.main?.pressure ?? 0;
  const humidity = response.main?.humidity ?? 0;
  const cloud = response.clouds?.all ?? 0;
  const rain1h = response.rain?.['1h'] ?? 0;
  const gust = response.wind?.gust ?? 0;
  const dt = response.dt ?? Math.floor(Date.now() / 1000);
  const visibility = response.visibility ?? 0;

  return {
    location: {
      name: response.name ?? '',
      region: '',
      country: response.sys?.country ?? '',
      lat: response.coord?.lat ?? 0,
      lon: response.coord?.lon ?? 0,
      tz_id: String(response.timezone ?? ''),
      localtime_epoch: dt,
      localtime: new Date(dt * 1000).toISOString(),
    },
    current: {
      last_updated_epoch: dt,
      last_updated: new Date(dt * 1000).toISOString(),
      temp_c: tempC,
      temp_f: tempC * KELVIN_TO_FAHRENHEIT + FAHRENHEIT_OFFSET,
      is_day: isDay(response.sys?.sunrise, response.sys?.sunset, dt),
      condition: {
        text: response.weather?.[0]?.description ?? '',
        icon: response.weather?.[0]?.icon ?? '',
        code: response.weather?.[0]?.id ?? 0,
      },
      wind_mph: windSpeed * MPS_TO_MPH,
      wind_kph: windSpeed * MPS_TO_KPH,
      wind_degree: response.wind?.deg ?? 0,
      wind_dir: '',
      pressure_mb: pressureMb,
      pressure_in: pressureMb * HPA_TO_INHG,
      precip_mm: rain1h,
      precip_in: rain1h * MM_TO_IN,
      humidity: humidity,
      cloud: cloud,
      feelslike_c: feelsLikeC,
      feelslike_f: feelsLikeC * KELVIN_TO_FAHRENHEIT + FAHRENHEIT_OFFSET,
      windchill_c: feelsLikeC,
      windchill_f: feelsLikeC * KELVIN_TO_FAHRENHEIT + FAHRENHEIT_OFFSET,
      heatindex_c: feelsLikeC,
      heatindex_f: feelsLikeC * KELVIN_TO_FAHRENHEIT + FAHRENHEIT_OFFSET,
      dewpoint_c: 0,
      dewpoint_f: 0,
      vis_km: visibility * M_TO_KM,
      vis_miles: visibility * M_TO_MILES,
      uv: 0,
      gust_mph: gust * MPS_TO_MPH,
      gust_kph: gust * MPS_TO_KPH,
    },
  };
}

function isDay(sunrise?: number, sunset?: number, dt?: number): number {
  if (!sunrise || !sunset || !dt) return 1;
  return dt >= sunrise && dt <= sunset ? 1 : 0;
}
