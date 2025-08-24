import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsArray,
  ValidateNested,
  IsObject,
  IsNumber,
  IsPositive,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

class BuyerDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

class ItemDto {
  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsInt()
  @IsPositive()
  qty: number;

  @IsNumber()
  @IsPositive()
  price: number;
}

class AttachmentDto {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  contentType: string;

  @IsInt()
  @IsPositive()
  size: number;

  @IsString()
  @IsNotEmpty()
  storageKey: string;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @IsObject()
  @ValidateNested()
  @Type(() => BuyerDto)
  buyer: BuyerDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => AttachmentDto)
  attachment: AttachmentDto;
}
