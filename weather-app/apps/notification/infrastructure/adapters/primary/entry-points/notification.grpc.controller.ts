import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { NotificationService } from '../../../../application/services/notification.service';
import { Notification } from '../../../../../../libs/common/types/notification-request.type';
import { Empty } from '../../../../../../libs/common/types/empty.type';

@Controller()
export class NotificationGrpcController {
  constructor(private readonly notificationService: NotificationService) {}

  @GrpcMethod('NotificationService', 'SendNotification')
  async sendNotification(data: Notification): Promise<Empty> {
    await this.notificationService.sendNotification(data);
    return {};
  }

  @GrpcMethod('NotificationService', 'SendDigest')
  async sendDigest(data: { digests: Notification[] }): Promise<Empty> {
    await this.notificationService.sendDigest(data.digests);
    return {};
  }
}
