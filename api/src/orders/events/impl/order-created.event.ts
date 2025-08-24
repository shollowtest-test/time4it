export class OrderCreatedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly orderId: string,
    public readonly orderPayload: any,
  ) {}
}
