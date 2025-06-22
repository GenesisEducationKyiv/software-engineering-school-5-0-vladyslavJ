import { AxiosError } from 'axios';
import { WeatherApiErrorData } from '../types/weatherApi.interfaces';
import { HttpError } from '../utils/customError';
import CONSTANTS from '../config/constants';

export const mapWeatherApiError = (err: AxiosError<WeatherApiErrorData>): Error => {
  const apiCode = err.response?.data?.error?.code;

  if (apiCode === CONSTANTS.CITY_NOT_FOUND_CODE) return new HttpError('City not found', 404);
  if (err.code === 'ECONNABORTED' || err.message.includes('timeout'))
    return new HttpError('External API timeout', 504);

  const status = err.response?.status ?? 502;
  if (status === 503) return new HttpError('Weather service unavailable', 503);
  return new HttpError(err.message || 'External API err', status);
};
