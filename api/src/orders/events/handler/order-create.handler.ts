import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderCreatedEvent } from '../impl/order-created.event';
import { OrdersGateway } from '../../orders.gateway';
import {
  OrderRead,
  OrderReadDocument,
} from 'src/orders/schema/order-read.schema';

@EventsHandler(OrderCreatedEvent)
export class OrderCreatedHandler implements IEventHandler<OrderCreatedEvent> {
  constructor(
    // INFO:  tylko model do odczytu
    @InjectModel(OrderRead.name)
    private readonly orderReadModel: Model<OrderReadDocument>,
    private readonly gateway: OrdersGateway,
  ) {}

  async handle(event: OrderCreatedEvent) {
    const { orderId, tenantId, orderPayload } = event;

    const projection = new this.orderReadModel({
      orderId,
      tenantId,
      buyerEmail: orderPayload.buyer.email,
      status: 'PENDING',
      total: orderPayload.total,
      createdAt: orderPayload.createdAt,
      attachment: orderPayload.attachment,
    });
    await projection.save();

    //Wysłanie po sockecie Dodania zamówienia ( można by zrobić aby jak zamówienie zostanie dodane wysłać po sockecie)
    // this.gateway.sendOrderCreate(tenantId,);

    // INFO: Symulacja zamiany statusu po czase
    setTimeout(async () => {
      // console.log('zmiana statusu'); debugy
      projection.status = 'PAID';
      await projection.save();
      this.gateway.sendStatusUpdate(tenantId, { orderId, status: 'PAID' });
    }, 15000);
  }
}
