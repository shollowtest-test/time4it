//INFO: ORDER-READ-MODEL
//Uproszczony model do odczytu

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
class AttachmentRead {
  @Prop()
  filename: string;
  @Prop()
  storageKey: string;
}

@Schema({
  collection: 'orders_read',
  timestamps: { updatedAt: false },
  versionKey: false,
  toJSON: {
    transform: (doc, ret: any) => {
      delete ret._id;
    },
  },
})
export class OrderRead {
  @Prop({ required: true, unique: true })
  orderId: string;
  @Prop({ required: true })
  tenantId: string;
  @Prop({ required: true })
  buyerEmail: string; // Do filtra
  @Prop({ required: true })
  status: string;
  @Prop()
  total: number;
  @Prop()
  createdAt: Date;
  @Prop({ type: AttachmentRead })
  attachment?: AttachmentRead;
}

export const OrderReadSchema = SchemaFactory.createForClass(OrderRead);

//Indexy do filtrowania - do zastanowanie
OrderReadSchema.index({ tenantId: 1, status: 1, createdAt: -1 });
OrderReadSchema.index({ tenantId: 1, buyerEmail: 1 });

export type OrderReadDocument = OrderRead & Document;
