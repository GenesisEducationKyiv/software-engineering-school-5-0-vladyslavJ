import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcToObservable } from '../../../../../../libs/common/types/observable';
import { lastValueFrom } from 'rxjs';
import { GrpcClientDiTokens } from '../../../../../../libs/common/di/grpc-client-di-tokens';
import { EmailServiceClientInterface } from './interfaces/email-client.interface';
import { Notification } from '../../../../../../libs/common/types/notification-request.type';
import { EmailResponseInterface } from '../../../../../../libs/common/interfaces/emai-response.interface';

@Injectable()
export class EmailServiceClient implements OnModuleInit, EmailServiceClientInterface {
  constructor(
    @Inject(GrpcClientDiTokens.EMAIL_SERVICE_GRPC_CLIENT)
    private readonly client: ClientGrpc,
  ) {}
  private serviceClient!: GrpcToObservable<EmailServiceClientInterface>;

  onModuleInit() {
    this.serviceClient =
      this.client.getService<GrpcToObservable<EmailServiceClientInterface>>('EmailService');
  }

  async sendEmail(notification: Notification): Promise<EmailResponseInterface> {
    return lastValueFrom(this.serviceClient.sendEmail(notification));
  }
}
