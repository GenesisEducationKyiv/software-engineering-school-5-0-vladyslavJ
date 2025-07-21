import { RpcException } from '@nestjs/microservices';
import { IOpenWeatherMapErrorData } from '../interfaces/open-weather-map-error-response.interface';
import { GrpcCode } from '../../../../../../../libs/common/enums/grpc-codes.enum';

export const mapWeatherApiError = (err: IOpenWeatherMapErrorData): Error => {
  if (err.cod === '404') {
    return new RpcException({
      code: GrpcCode.NOT_FOUND,
      message: 'City not found',
      details: 'City not found',
    });
  }
  if (err.cod === '400') {
    return new RpcException({
      code: GrpcCode.BAD_REQUEST,
      message: 'Invalid request',
      details: 'Invalid request',
    });
  }
  return new RpcException({
    code: GrpcCode.SERVICE_UNAVAILABLE,
    message: 'External API error',
    details: 'Service Unavailable',
  });
};
