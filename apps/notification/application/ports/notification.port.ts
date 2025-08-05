import { Notification } from '../../../../libs/common/types/notification-request.type';
import { NotificationMicroserviceInterface } from '../../../../libs/common/interfaces/notification-microservice.interface';
import { EmailResponseInterface } from '../../../../libs/common/interfaces/emai-response.interface';

export interface NotificationInputPortInterface extends NotificationMicroserviceInterface {
  sendNotification(data: Notification): Promise<EmailResponseInterface>;
}
