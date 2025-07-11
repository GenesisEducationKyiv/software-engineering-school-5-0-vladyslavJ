import { AxiosError } from 'axios';
import { HttpError } from '../../../../../shared/utils/custom-error.util';
import WEATHER_API_ERROR_CODE from '../../../../../shared/utils/constants/weather-api-error-code.constant';
import { IWeatherApiErrorData } from '../interfaces/weather-api-error-response.interface';
import { IOpenWeatherMapErrorData } from '../interfaces/open-weather-map-error-response.interface';

type KnownErrorData = IWeatherApiErrorData | IOpenWeatherMapErrorData | undefined;

export const mapWeatherApiError = (err: AxiosError<KnownErrorData>): Error => {
  const weatherApiCode = (err.response?.data as IWeatherApiErrorData)?.error?.code;
  if (weatherApiCode === WEATHER_API_ERROR_CODE.CITY_NOT_FOUND)
    return new HttpError('City not found', 404);

  const openWeatherMapCode = (err.response?.data as IOpenWeatherMapErrorData)?.cod;
  const openWeatherMapMsg = (err.response?.data as IOpenWeatherMapErrorData)?.message;
  if (openWeatherMapCode === '404' || openWeatherMapMsg?.toLowerCase().includes('city not found'))
    return new HttpError('City not found', 404);

  if (err.code === 'ECONNABORTED' || err.message.includes('timeout'))
    return new HttpError('External API timeout', 504);

  const status = err.response?.status ?? 502;
  if (status === 503) return new HttpError('Weather service unavailable', 503);

  return new HttpError(err.message || 'External API err', status);
};
