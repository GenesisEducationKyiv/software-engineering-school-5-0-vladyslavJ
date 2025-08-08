export const SubscriptionField = {
  CONFIRMATION_TOKEN: 'confirmation_token',
  UNSUBSCRIBE_TOKEN: 'unsubscribe_token',
} as const;
export type SubscriptionField = (typeof SubscriptionField)[keyof typeof SubscriptionField];
