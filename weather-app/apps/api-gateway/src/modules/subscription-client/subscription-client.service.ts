import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { GrpcToObservable } from '../../../../../libs/common/types/observable';
import { SubscriptionServiceClientInterface } from './interfaces/subscription-client.interface';
import { SubscriptionDto } from '../../../../../libs/common/dtos/subscription.dto';
import { Token } from './interfaces/token.type';
import { PackageNames } from '../../common/utils/enums/package-names.enum';
import { Subscription } from '../../../../../libs/common/models/subscription.entity';
import { SubscriptionFrequency } from '../../../../../libs/common/enums/subscription-frequency.enum';
import { Empty } from '../../../../../libs/common/types/empty.type';

@Injectable()
export class SubscriptionServiceClient implements OnModuleInit, SubscriptionServiceClientInterface {
  constructor(@Inject(PackageNames.SUBSCRIPTION_PACKAGE) private readonly client: ClientGrpc) {}
  private serviceClient!: GrpcToObservable<SubscriptionServiceClientInterface>;

  onModuleInit() {
    this.serviceClient =
      this.client.getService<GrpcToObservable<SubscriptionServiceClientInterface>>(
        'SubscriptionService',
      );
  }

  async subscribe(req: SubscriptionDto): Promise<Empty> {
    return lastValueFrom(this.serviceClient.subscribe(req));
  }

  async confirm(req: { token: Token }): Promise<Empty> {
    return lastValueFrom(this.serviceClient.confirm(req));
  }

  async unsubscribe(req: { token: Token }): Promise<Empty> {
    return lastValueFrom(this.serviceClient.unsubscribe(req));
  }

  async getByFrequency(frequency: SubscriptionFrequency): Promise<Subscription[]> {
    return lastValueFrom(this.serviceClient.getByFrequency(frequency));
  }
}
