export class GetSubscribersByFrequencyResponseDto {
  email!: string;
  city!: string;
  frequency!: 'hourly' | 'daily';
  unsubscribeToken!: string;
}
