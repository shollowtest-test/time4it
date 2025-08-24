// TODO: dodac class-validator

import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderCommand } from './commands/impl/create-order.command';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersQuery } from './query/impl/get-orders.query';

@Controller('api/orders')
export class OrdersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  create(@Body(new ValidationPipe()) dto: CreateOrderDto) {
    return this.commandBus.execute(new CreateOrderCommand(dto));
  }

  @Get()
  findAll(@Query() query: any) {
    return this.queryBus.execute(new GetOrdersQuery(query));
  }
}
