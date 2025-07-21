import { HttpException, HttpStatus } from '@nestjs/common';
import { IWeatherApiErrorData } from '../interfaces/weather-api-error-response.interface';

export const mapWeatherApiError = (err: IWeatherApiErrorData): Error => {
  if (err.error?.code === 1006) {
    return new HttpException('City not found', HttpStatus.NOT_FOUND);
  }
  if (err.error?.code === 1003) {
    return new HttpException('Parameter city is missing.', HttpStatus.BAD_REQUEST);
  }
  if (err.error?.code === 2006) {
    return new HttpException('API key is invalid', HttpStatus.UNAUTHORIZED);
  }
  return new HttpException('External API error', HttpStatus.BAD_GATEWAY);
};
