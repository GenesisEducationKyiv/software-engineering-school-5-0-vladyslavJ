import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcToObservable } from '../../../../../../libs/common/types/observable';
import { firstValueFrom } from 'rxjs';
import { GrpcClientDiTokens } from '../../../../../../libs/common/di/grpc-client-di-tokens';
import { EmailServiceClientInterface } from './interfaces/email-client.interface';
import { Notification } from '../../../../../../libs/common/types/notification-request.type';
import { EmailResponseInterface } from '../../../../../../libs/common/interfaces/emai-response.interface';
import { LoggerDiTokens } from '../../../../../../libs/modules/logger/di/di-tokens';
import { LoggerInterface } from '../../../../../../libs/modules/logger/interfaces/logger.interface';
import { GRPC_SERVICES } from '../../../../../../libs/common/constants/grpc-service.const';

@Injectable()
export class EmailServiceClient implements OnModuleInit, EmailServiceClientInterface {
  constructor(
    @Inject(GrpcClientDiTokens.EMAIL_SERVICE_GRPC_CLIENT)
    private readonly client: ClientGrpc,
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: LoggerInterface,
  ) {}
  private serviceClient!: GrpcToObservable<EmailServiceClientInterface>;

  onModuleInit() {
    this.serviceClient = this.client.getService<GrpcToObservable<EmailServiceClientInterface>>(
      GRPC_SERVICES.EMAIL,
    );
    this.logger.setContext(EmailServiceClient.name);
    this.logger.info('gRPC EmailServiceClient initialized');
  }

  async sendEmail(notification: Notification): Promise<EmailResponseInterface> {
    this.logger.info(`sendEmail called for: ${notification.email}`);
    try {
      return await firstValueFrom(this.serviceClient.sendEmail(notification));
    } catch (error) {
      this.logger.error('Error sending email via gRPC', error);
      throw error;
    }
  }
}
