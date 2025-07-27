import { NotificationMicroserviceInterface } from "../../../../../../../libs/common/interfaces/notification-microservice.interface";
import { Notification } from "../../../../../../../libs/common/types/notification-request.type";
import { Empty } from "../../../../../../../libs/common/types/empty.type";

export interface NotificationServiceClientInterface extends NotificationMicroserviceInterface {
  sendNotification(data: Notification): Promise<{ success: boolean }>;
}
