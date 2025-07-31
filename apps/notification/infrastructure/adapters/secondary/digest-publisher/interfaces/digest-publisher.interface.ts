import { Notification } from '../../../../../../../libs/common/types/notification-request.type';
import { Empty } from '../../../../../../../libs/common/types/empty.type';

export interface DigestPublisherInterface {
  publishDigest(digest: Notification): Promise<Empty>;
}
