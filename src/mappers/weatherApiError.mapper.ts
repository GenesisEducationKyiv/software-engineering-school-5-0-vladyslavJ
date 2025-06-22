import { AxiosError } from 'axios';
import { IWeatherApiErrorData } from '../interfaces/weather-api-error-response.interface';
import { HttpError } from '../utils/customError';
import WEATHER_API_ERROR_CODE from '../utils/constants/weather-api-error-code.constants';

export const mapWeatherApiError = (err: AxiosError<IWeatherApiErrorData>): Error => {
  const apiCode = err.response?.data?.error?.code;

  if (apiCode === WEATHER_API_ERROR_CODE.CITY_NOT_FOUND)
    return new HttpError('City not found', 404);
  if (err.code === 'ECONNABORTED' || err.message.includes('timeout'))
    return new HttpError('External API timeout', 504);

  const status = err.response?.status ?? 502;
  return new HttpError(err.message || 'External API err', status);
};
