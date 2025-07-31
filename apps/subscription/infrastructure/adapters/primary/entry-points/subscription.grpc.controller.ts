import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { SubscriptionInputPortInterface } from '../../../../application/ports/subscription.port';
import { Token } from '../../../../../../libs/common/types/token.type';
import { GrpcCode } from '../../../../../../libs/common/enums/grpc-codes.enum';
import { SubscriptionFrequency } from '../../../../../../libs/common/enums/subscription-frequency.enum';
import { Empty } from '../../../../../../libs/common/types/empty.type';
import { SubscriptionDto } from '../../../../../../libs/common/dtos/subscription.dto';
import { SubscriptionRepoDiTokens } from '../../../database/di/di-tokens';
import { SubscriptionMicroserviceInterface } from '../../../../../../libs/common/interfaces/subscription-microservice.interface';
import { SubscriptionModel } from '../../../../../../libs/common/models/subscription.model';

@Controller()
export class SubscriptionGrpcController implements SubscriptionMicroserviceInterface {
  constructor(
    @Inject(SubscriptionRepoDiTokens.SUBSCRIPTION_SERVICE)
    private readonly subscriptionService: SubscriptionInputPortInterface,
  ) {}

  @GrpcMethod('SubscriptionService', 'Subscribe')
  async subscribe(dto: SubscriptionDto): Promise<Empty> {
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

  @GrpcMethod('SubscriptionService', 'GetByFrequency')
  async getByFrequency(dto: {
    frequency: SubscriptionFrequency;
  }): Promise<{ subscriptions: SubscriptionModel[] }> {
    try {
      return { subscriptions: await this.subscriptionService.getByFrequency(dto.frequency) };
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
