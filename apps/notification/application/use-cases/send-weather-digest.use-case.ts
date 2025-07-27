import { Injectable } from '@nestjs/common';
import { Notification } from '../../../../libs/common/types/notification-request.type';
import { SendNotificationUseCase } from './send-notification.use-case';
import { Empty } from '../../../../libs/common/types/empty.type';

@Injectable()
export class SendWeatherDigestUseCase {
  constructor(private readonly sendNotificationUseCase: SendNotificationUseCase) {}

  async execute(digests: Notification[]): Promise<Empty> {
    await Promise.all(
      digests.map(notification => this.sendNotificationUseCase.execute(notification)),
    );
    return {};
  }
}
