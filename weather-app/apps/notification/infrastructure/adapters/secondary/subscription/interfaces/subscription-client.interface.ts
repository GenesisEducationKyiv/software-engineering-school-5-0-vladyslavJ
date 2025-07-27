import { SubscriptionDto } from '../../../../../../../libs/common/dtos/subscription.dto';
import { Empty } from '../../../../../../../libs/common/types/empty.type';
import { Token } from '../../../../../../../libs/common/types/token.type';
import { SubscriptionMicroserviceInterface } from '../../../../../../../libs/common/interfaces/subscription-microservice.interface';
import { Subscription } from '../../../../../../../libs/common/models/subscription.entity';
import { SubscriptionFrequency } from '../../../../../../../libs/common/enums/subscription-frequency.enum';

export interface SubscriptionServiceClientInterface extends SubscriptionMicroserviceInterface {
  subscribe(dto: SubscriptionDto): Promise<Empty>;
  confirm(req: { token: Token }): Promise<Empty>;
  unsubscribe(req: { token: Token }): Promise<Empty>;
  getByFrequency(frequency: SubscriptionFrequency): Promise<Subscription[]>;
}
