import { Notification } from "../types/notification-request.type";
import { Empty } from '../types/empty.type';

export interface NotificationMicroserviceInterface {
  sendNotification(data: Notification): Promise<Empty>;
}
