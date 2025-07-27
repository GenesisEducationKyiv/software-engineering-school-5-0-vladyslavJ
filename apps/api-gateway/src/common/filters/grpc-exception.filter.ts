import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { GrpcCode } from '../../../../../libs/common/enums/grpc-codes.enum';

type GrpcError = {
  code?: number;
  details?: string;
  message?: string;
  metadata?: unknown;
  getError?: () => {
    code?: number;
    details?: string;
    message?: string;
  };
};

@Catch(RpcException, Error)
export class GrpcExceptionFilter implements ExceptionFilter {
  catch(exception: GrpcError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const grpcToHttpStatus: Record<number, number> = {
      [GrpcCode.NOT_FOUND]: HttpStatus.NOT_FOUND,
      [GrpcCode.SERVICE_UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
      [GrpcCode.BAD_REQUEST]: HttpStatus.BAD_REQUEST,
      [GrpcCode.FORBIDDEN]: HttpStatus.FORBIDDEN,
      [GrpcCode.INTERNAL_SERVER_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
      [GrpcCode.UNKNOWN]: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    const code = exception.code ?? exception.getError?.().code ?? 500;
    const message =
      exception.details ??
      exception.message ??
      exception.getError?.().details ??
      exception.getError?.().message ??
      'Internal server error';

    const status = grpcToHttpStatus[code] ?? HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      message,
      error: 'gRPC Error',
    });
  }
}
