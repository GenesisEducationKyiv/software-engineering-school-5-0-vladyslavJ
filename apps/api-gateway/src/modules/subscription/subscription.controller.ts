import { Controller, Post, Body, Get, Param, HttpCode } from '@nestjs/common';
import { SubscriptionDto } from '../../../../../libs/common/dtos/subscription.dto';
import { SubscriptionService } from './subscription.service';
import { Token } from '../../../../../libs/common/types/token.type';

@Controller()
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('/subscribe')
  @HttpCode(200)
  async subscribe(@Body() body: SubscriptionDto) {
    return this.subscriptionService.subscribe(body);
  }

  @Get('/confirm/:confirmation_token')
  @HttpCode(200)
  async confirm(@Param('confirmation_token') token: Token) {
    return this.subscriptionService.confirm({ token });
  }

  @Get('/unsubscribe/:unsubscribe_token')
  @HttpCode(200)
  async unsubscribe(@Param('unsubscribe_token') token: Token) {
    return this.subscriptionService.unsubscribe({ token });
  }
}
