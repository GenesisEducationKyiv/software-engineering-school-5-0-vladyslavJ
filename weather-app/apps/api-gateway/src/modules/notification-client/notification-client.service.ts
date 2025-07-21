/*import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { GrpcToObservable } from '../../../../../libs/common/types/observable';
import { INotificationServiceClient } from './interfaces/notification-client.interface';
import { Empty } from '../../../../../libs/common/types/empty.type';
import { NotificationRequest } from '../../../../../libs/common/types/notification-request.type';

@Injectable()
export class NotificationServiceClient implements OnModuleInit {
  private serviceClient!: GrpcToObservable<INotificationServiceClient>;
  constructor(@Inject('NOTIFICATION_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.serviceClient =
      this.client.getService<GrpcToObservable<INotificationServiceClient>>('NotificationService');
  }

  async sendNotification(req: NotificationRequest): Promise<Empty> {
    return lastValueFrom(this.serviceClient.sendNotification(req));
  }
}
*/
