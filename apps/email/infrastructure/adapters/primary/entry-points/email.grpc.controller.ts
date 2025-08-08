import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { GrpcCode } from '../../../../../../libs/common/enums/grpc-codes.enum';
import { EmailService } from '../../../../application/services/email.service';
import { Notification } from '../../../../../../libs/common/types/notification-request.type';
import { EmailDiTokens } from '../../secondary/di/di-tokens';
import { EmailMicroserviceInterface } from '../../../../../../libs/common/interfaces/email-microservice.interface';
import { EmailResponseInterface } from '../../../../../../libs/common/interfaces/emai-response.interface';
import { EventPattern, Payload } from '@nestjs/microservices';
import { GRPC_SERVICES } from '../../../../../../libs/common/constants/grpc-service.const';
import { GRPC_METHODS } from '../../../../../../libs/common/constants/grpc-method.const';
import { EVENT_PATTERNS } from '../../../../../../libs/common/constants/events.const';
@Controller()
export class EmailGrpcController implements EmailMicroserviceInterface {
  constructor(
    @Inject(EmailDiTokens.EMAIL_SERVICE)
    private readonly emailService: EmailService,
  ) {}

  @GrpcMethod(GRPC_SERVICES.EMAIL, GRPC_METHODS.EMAIL.SEND_EMAIL)
  async sendEmail(notification: Notification): Promise<EmailResponseInterface> {
    return this.send(notification);
  }

  @EventPattern(EVENT_PATTERNS.DIGEST_READY)
  async handleDigest(@Payload() digest: Notification): Promise<EmailResponseInterface> {
    return this.send(digest);
  }

  private async send(req: Notification): Promise<EmailResponseInterface> {
    try {
      return await this.emailService.sendEmail(req);
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
