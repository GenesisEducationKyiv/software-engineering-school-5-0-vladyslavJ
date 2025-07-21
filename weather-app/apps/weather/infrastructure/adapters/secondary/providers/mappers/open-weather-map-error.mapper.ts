import { HttpException, HttpStatus } from '@nestjs/common';
import { IOpenWeatherMapErrorData } from '../interfaces/open-weather-map-error-response.interface';

export const mapWeatherApiError = (err: IOpenWeatherMapErrorData): Error => {
  if (err.cod === '404') {
    return new HttpException('City not found', HttpStatus.NOT_FOUND);
  }
  if (err.cod === '400') {
    return new HttpException('Invalid request', HttpStatus.BAD_REQUEST);
  }
  return new HttpException('External API error', HttpStatus.BAD_GATEWAY);
};
