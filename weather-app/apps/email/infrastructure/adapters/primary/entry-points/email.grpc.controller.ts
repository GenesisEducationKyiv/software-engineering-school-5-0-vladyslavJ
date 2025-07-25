import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { GrpcCode } from '../../../../../../libs/common/enums/grpc-codes.enum';
import { EmailService } from '../../../../application/services/email.service';
import { EmailMessage } from '../../../../domain/models/email.model';

@Controller()
export class EmailGrpcController {
  constructor(private readonly emailService: EmailService) {}

  @GrpcMethod('EmailService', 'SendEmail')
  async sendEmail(email: EmailMessage): Promise<void> {
    try {
      return await this.emailService.sendEmail(email);
    } catch (err) {
      throw err instanceof RpcException
        ? err
        : new RpcException({
            code: GrpcCode.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
          });
    }
  }
}
