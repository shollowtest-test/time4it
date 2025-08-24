//INFO: ORDER-FULL_MODEL

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ _id: false })
class Buyer {
  @Prop() email: string;
  @Prop() name: string;
}

@Schema({ _id: false })
class Item {
  @Prop() sku: string;
  @Prop() qty: number;
  @Prop() price: number;
}

@Schema({ _id: false })
class Attachment {
  @Prop() filename: string;
  @Prop() contentType: string;
  @Prop() size: number;
  @Prop() storageKey: string;
}

@Schema({ collection: 'orders_write', timestamps: true })
export class Order {
  @Prop({ required: true, unique: true, default: () => `ord_${uuidv4()}` })
  orderId: string;

  @Prop({ required: true, index: true })
  tenantId: string;

  //idemKey
  @Prop({ required: true })
  requestId: string;

  @Prop({ required: true, default: 'PENDING' })
  status: 'PENDING' | 'PAID' | 'CANCELLED';

  @Prop({ type: Buyer })
  buyer: Buyer;

  @Prop({ type: [Item] })
  items: Item[];

  @Prop()
  total: number;

  @Prop({ type: Attachment })
  attachment?: Attachment;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ tenantId: 1, requestId: 1 }, { unique: true });

export type OrderDocument = Order & Document;
