import { Notification } from '../types/notification-request.type';
import { EmailResponseInterface } from './emai-response.interface';

export interface EmailMicroserviceInterface {
  sendEmail(data: Notification): Promise<EmailResponseInterface>;
}
