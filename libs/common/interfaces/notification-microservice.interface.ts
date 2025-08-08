import { Notification } from '../types/notification-request.type';
import { EmailResponseInterface } from './emai-response.interface';

export interface NotificationMicroserviceInterface {
  sendNotification(data: Notification): Promise<EmailResponseInterface>;
}
