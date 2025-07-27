import { Notification } from '../../../../libs/common/types/notification-request.type';
import { Empty } from '../../../../libs/common/types/empty.type';

export interface EmailServicePortInterface {
  sendEmail(req: Notification): Promise<Empty>;
}
