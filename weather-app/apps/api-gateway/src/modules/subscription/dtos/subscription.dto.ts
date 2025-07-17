import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SubscriptionFrequency } from '../../../../../../libs/common/enums/subscription-frequency.enum';

export class SubscriptionDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsEnum(SubscriptionFrequency)
  @IsNotEmpty()
  frequency!: SubscriptionFrequency;
}
