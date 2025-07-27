import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcToObservable } from '../../../../../../libs/common/types/observable';
import { lastValueFrom } from 'rxjs';
import { NotificationServiceClientInterface } from './interfaces/notification-client.interface';
import { GrpcClientDiTokens } from '../../../../../../libs/common/di/grpc-client-di-tokens';
import { Notification } from '../../../../../../libs/common/types/notification-request.type';
import { Empty } from '../../../../../../libs/common/types/empty.type';

@Injectable()
export class NotificationServiceClient implements OnModuleInit, NotificationServiceClientInterface {
  constructor(
    @Inject(GrpcClientDiTokens.NOTIFICATION_SERVICE_GRPC_CLIENT)
    private readonly client: ClientGrpc,
  ) {}
  private serviceClient!: GrpcToObservable<NotificationServiceClientInterface>;

  onModuleInit() {
    this.serviceClient =
      this.client.getService<GrpcToObservable<NotificationServiceClientInterface>>(
        'NotificationService',
      );
  }

  async sendNotification(data: Notification): Promise<Empty> {
    return lastValueFrom(this.serviceClient.sendNotification(data));
  }
}
