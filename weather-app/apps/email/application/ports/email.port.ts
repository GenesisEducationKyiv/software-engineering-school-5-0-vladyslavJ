import { Notification } from '../../../../libs/common/types/notification-request.type';

export interface EmailSenderInputPortInterface {
  sendEmail(req: Notification): Promise<{ success: boolean }>;
}
