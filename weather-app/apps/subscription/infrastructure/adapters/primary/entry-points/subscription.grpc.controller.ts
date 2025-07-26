import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { SubscriptionService } from '../../../../application/services/subscription.service';
import { SubscriptionDto } from '../../../../../../libs/common/dtos/subscription.dto';
import { Token } from '../../../../../api-gateway/src/modules/subscription-client/interfaces/token.type';
import { GrpcCode } from '../../../../../../libs/common/enums/grpc-codes.enum';
import { SubscriptionFrequency } from '../../../../../../libs/common/enums/subscription-frequency.enum';
import { GetSubscribersByFrequencyResponseDto } from './dto/get-subscibers-by-frequency.dto';
import { Empty } from '../../../../../../libs/common/types/empty.type';
import { SubscribeDto } from '../../../../../../libs/common/dtos/subscribe.dto';
import { Subscription } from '../../../../../../libs/common/models/subscription.entity';
import { SubscriptionRepoDiTokens } from '../../../database/di/di-tokens';

@Controller()
export class SubscriptionGrpcController {
  constructor(
    @Inject(SubscriptionRepoDiTokens.SUBSCRIPTION_SERVICE)
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @GrpcMethod('SubscriptionService', 'Subscribe')
  async subscribe(dto: SubscribeDto): Promise<Empty> {
    try {
      await this.subscriptionService.subscribe(dto);
      return {};
    } catch (err) {
      throw err instanceof RpcException
        ? err
        : new RpcException({
            code: GrpcCode.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
          });
    }
  }

  @GrpcMethod('SubscriptionService', 'Confirm')
  async confirm(req: { token: Token }): Promise<Empty> {
    try {
      await this.subscriptionService.confirm(req.token);
      return {};
    } catch (error) {
      throw error instanceof RpcException
        ? error
        : new RpcException({
            code: GrpcCode.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
          });
    }
  }

  @GrpcMethod('SubscriptionService', 'Unsubscribe')
  async unsubscribe(req: { token: Token }): Promise<Empty> {
    try {
      await this.subscriptionService.unsubscribe(req.token);
      return {};
    } catch (error) {
      throw error instanceof RpcException
        ? error
        : new RpcException({
            code: GrpcCode.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
          });
    }
  }

  @GrpcMethod('SubscriptionService', 'GetSubscribersByFrequency')
  async getSubscribersByFrequency(
    dto: SubscriptionFrequency,
  ): Promise<{ subscribers: Subscription[] }> {
    try {
      const subscribers = await this.subscriptionService.getByFrequency(dto);
      return { subscribers };
    } catch (error) {
      throw error instanceof RpcException
        ? error
        : new RpcException({
            code: GrpcCode.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
          });
    }
  }
}
