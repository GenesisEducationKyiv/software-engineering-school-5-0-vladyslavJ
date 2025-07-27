import { RpcException } from '@nestjs/microservices';
import { IWeatherApiErrorData } from '../interfaces/weather-api-error-response.interface';
import { GrpcCode } from '../../../../../../../libs/common/enums/grpc-codes.enum';

export const mapWeatherApiError = (err: IWeatherApiErrorData): Error => {
  if (err.error?.code === 1006) {
    return new RpcException({
      code: GrpcCode.NOT_FOUND,
      message: 'City not found',
      details: 'Not Found',
    });
  }
  if (err.error?.code === 1003) {
    return new RpcException({
      code: GrpcCode.BAD_REQUEST,
      message: 'Parameter city is missing',
      details: 'Bad Request',
    });
  }
  if (err.error?.code === 2006) {
    return new RpcException({
      code: GrpcCode.UNAUTHENTICATED,
      message: 'API key is invalid',
      details: 'Unauthorized',
    });
  }
  return new RpcException({
    code: GrpcCode.SERVICE_UNAVAILABLE,
    message: 'External API error',
    details: 'Service Unavailable',
  });
};
