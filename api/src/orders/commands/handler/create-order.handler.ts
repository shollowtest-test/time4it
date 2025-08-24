import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommand } from '../impl/create-order.command';
import { Order, OrderDocument } from 'src/orders/schema/order.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConflictException } from '@nestjs/common';
import { OrderCreatedEvent } from 'src/orders/events/impl/order-created.event';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateOrderCommand): Promise<{ orderId: string }> {
    const { tenantId, requestId, buyer, items, attachment } = command.dto; // TODO: Wzmonic typowanie

    const existingOrder = await this.orderModel
      .findOne({ tenantId, requestId })
      .exec();
    if (existingOrder) {
      throw new ConflictException(`${requestId} - takie zamówienie istnieje`);
    }

    const total = items.reduce((acc, item) => acc + item.qty * item.price, 0);
    const newOrder = new this.orderModel({
      requestId: requestId,
      tenantId: tenantId,
      buyer: buyer,
      items: items,
      attachment: attachment,
      status: 'PENDING',
      total: total.toFixed(2),
    });

    await newOrder.save();

    //INFO: Koncowa publikacja
    this.eventBus.publish(
      new OrderCreatedEvent(tenantId, newOrder.orderId, newOrder.toObject()),
    );

    return { orderId: newOrder.orderId };
  }
}
