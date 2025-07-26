import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { GrpcToObservable } from '../../../../../libs/common/types/observable';
import { NotificationServiceClientInterface } from './interfaces/notification-client.interface';
import { Empty } from '../../../../../libs/common/types/empty.type';
import { Notification } from '../../../../../libs/common/types/notification-request.type';
import { PackageNames } from '../../common/utils/enums/package-names.enum';

@Injectable()
export class NotificationServiceClient implements OnModuleInit, NotificationServiceClientInterface {
  constructor(@Inject(PackageNames.NOTIFICATION_PACKAGE) private readonly client: ClientGrpc) {}
  private serviceClient!: GrpcToObservable<NotificationServiceClientInterface>;

  onModuleInit() {
    this.serviceClient =
      this.client.getService<GrpcToObservable<NotificationServiceClientInterface>>(
        'NotificationService',
      );
  }

  async sendNotification(req: Notification): Promise<Empty> {
    return lastValueFrom(this.serviceClient.sendNotification(req));
  }
}
