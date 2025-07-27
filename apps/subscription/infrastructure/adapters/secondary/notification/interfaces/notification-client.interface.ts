import { NotificationMicroserviceInterface } from '../../../../../../../libs/common/interfaces/notification-microservice.interface';
import { Notification } from '../../../../../../../libs/common/types/notification-request.type';
import { EmailResponseInterface } from '../../../../../../../libs/common/interfaces/emai-response.interface';

export interface NotificationServiceClientInterface extends NotificationMicroserviceInterface {
  sendNotification(data: Notification): Promise<EmailResponseInterface>;
}
