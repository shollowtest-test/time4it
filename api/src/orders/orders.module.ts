import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateOrderHandler } from './commands/handler/create-order.handler';
import { OrderCreatedHandler } from './events/handler/order-create.handler';
import { GetOrdersHandler } from './query/handler/get-orders.handler';
import { Order, OrderSchema } from './schema/order.schema';
import { OrderRead, OrderReadSchema } from './schema/order-read.schema';
import { OrdersGateway } from './orders.gateway';
import { OrdersController } from './orders.controller';

export const CommandHandlers = [CreateOrderHandler];
export const EventHandlers = [OrderCreatedHandler];
export const QueryHandlers = [GetOrdersHandler];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderRead.name, schema: OrderReadSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersGateway,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
  ],
})
export class OrdersModule {}
