import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { NotificationService } from '../../../../application/services/notification.service';
import { Notification } from '../../../../../../libs/common/types/notification-request.type';
import { Empty } from '../../../../../../libs/common/types/empty.type';
import { GRPC_SERVICES } from '../../../../../../libs/common/constants/grpc-service.const';
import { GRPC_METHODS } from '../../../../../../libs/common/constants/grpc-method.const';

@Controller()
export class NotificationGrpcController {
  constructor(private readonly notificationService: NotificationService) {}

  @GrpcMethod(GRPC_SERVICES.NOTIFICATION, GRPC_METHODS.NOTIFICATION.SEND_NOTIFICATION)
  async sendNotification(data: Notification): Promise<Empty> {
    await this.notificationService.sendNotification(data);
    return {};
  }
}
