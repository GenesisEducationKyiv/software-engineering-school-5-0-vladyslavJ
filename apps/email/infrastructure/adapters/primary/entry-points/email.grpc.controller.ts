import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { GrpcCode } from '../../../../../../libs/common/enums/grpc-codes.enum';
import { EmailService } from '../../../../application/services/email.service';
import { Notification } from '../../../../../../libs/common/types/notification-request.type';
import { EmailDiTokens } from '../../secondary/di/di-tokens';
import { EmailMicroserviceInterface } from '../../../../../../libs/common/interfaces/email-microservice.interface';
import { EmailResponseInterface } from '../../../../../../libs/common/interfaces/emai-response.interface';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class EmailGrpcController implements EmailMicroserviceInterface {
  constructor(
    @Inject(EmailDiTokens.EMAIL_SERVICE)
    private readonly emailService: EmailService,
  ) {}

  @GrpcMethod('EmailService', 'SendEmail')
  async sendEmail(notification: Notification): Promise<EmailResponseInterface> {
    try {
      return await this.emailService.sendEmail(notification);
    } catch (err) {
      throw err instanceof RpcException
        ? err
        : new RpcException({
            code: GrpcCode.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
          });
    }
  }

  @EventPattern('digest.ready')
  async handleDigest(@Payload() digest: Notification): Promise<EmailResponseInterface> {
    try {
      return await this.emailService.sendEmail(digest);
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
