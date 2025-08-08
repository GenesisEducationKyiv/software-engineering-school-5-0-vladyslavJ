import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcToObservable } from '../../../../../../libs/common/types/observable';
import { firstValueFrom } from 'rxjs';
import { NotificationServiceClientInterface } from './interfaces/notification-client.interface';
import { GrpcClientDiTokens } from '../../../../../../libs/common/di/grpc-client-di-tokens';
import { Notification } from '../../../../../../libs/common/types/notification-request.type';
import { EmailResponseInterface } from '../../../../../../libs/common/interfaces/emai-response.interface';
import { LoggerDiTokens } from '../../../../../../libs/modules/logger/di/di-tokens';
import { LoggerInterface } from '../../../../../../libs/modules/logger/interfaces/logger.interface';
import { GRPC_SERVICES } from '../../../../../../libs/common/constants/grpc-service.const';
@Injectable()
export class NotificationServiceClient implements OnModuleInit, NotificationServiceClientInterface {
  constructor(
    @Inject(GrpcClientDiTokens.NOTIFICATION_SERVICE_GRPC_CLIENT)
    private readonly client: ClientGrpc,
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: LoggerInterface,
  ) {}
  private serviceClient!: GrpcToObservable<NotificationServiceClientInterface>;

  onModuleInit() {
    this.serviceClient = this.client.getService<
      GrpcToObservable<NotificationServiceClientInterface>
    >(GRPC_SERVICES.NOTIFICATION);
    this.logger.setContext(NotificationServiceClient.name);
    this.logger.info('gRPC NotificationServiceClient initialized');
  }

  async sendNotification(data: Notification): Promise<EmailResponseInterface> {
    this.logger.info(`sendNotification called for: ${data.email}`);
    try {
      return await firstValueFrom(this.serviceClient.sendNotification(data));
    } catch (error) {
      this.logger.error('Error sending notification via gRPC', error);
      throw error;
    }
  }
}
