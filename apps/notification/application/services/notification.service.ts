import { Injectable } from '@nestjs/common';
import { Notification } from '../../../../libs/common/types/notification-request.type';
import { SendNotificationUseCase } from '../use-cases/send-notification.use-case';
import { NotificationInputPortInterface } from '../ports/notification.port';
import { EmailResponseInterface } from '../../../../libs/common/interfaces/emai-response.interface';

@Injectable()
export class NotificationService implements NotificationInputPortInterface {
  constructor(private readonly sendNotificationUseCase: SendNotificationUseCase) {}

  async sendNotification(data: Notification): Promise<EmailResponseInterface> {
    return await this.sendNotificationUseCase.execute(data);
  }
}
