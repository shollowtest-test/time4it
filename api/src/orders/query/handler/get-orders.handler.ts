import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetOrdersQuery } from '../impl/get-orders.query';
import {
  OrderRead,
  OrderReadDocument,
} from 'src/orders/schema/order-read.schema';

@QueryHandler(GetOrdersQuery)
export class GetOrdersHandler implements IQueryHandler<GetOrdersQuery> {
  constructor(
    @InjectModel(OrderRead.name)
    private readonly orderReadModel: Model<OrderReadDocument>,
  ) {}

  async execute(query: GetOrdersQuery) {
    const {
      tenantId,
      status,
      buyerEmail,
      page = 1,
      limit = 10,
    } = query.filters;
    //TODO: dodać typowanie
    const findQuery: any = { tenantId };
    if (status) findQuery.status = status;
    if (buyerEmail) findQuery.buyerEmail = buyerEmail;

    const items = await this.orderReadModel
      .find(findQuery)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .exec();

    const total = await this.orderReadModel.countDocuments(findQuery);
    return { items, page: Number(page), limit: Number(limit), total };
  }
}
