import { Notification } from '../../../../libs/common/types/notification-request.type';
import { EmailResponseInterface } from '../../../../libs/common/interfaces/emai-response.interface';

export interface EmailSenderInputPortInterface {
  sendEmail(req: Notification): Promise<EmailResponseInterface>;
}
