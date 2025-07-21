import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

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
      5: HttpStatus.NOT_FOUND,
      14: HttpStatus.SERVICE_UNAVAILABLE,
      3: HttpStatus.BAD_REQUEST,
      7: HttpStatus.FORBIDDEN,
      13: HttpStatus.INTERNAL_SERVER_ERROR,
      2: HttpStatus.INTERNAL_SERVER_ERROR,
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
