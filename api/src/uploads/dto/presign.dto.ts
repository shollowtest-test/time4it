import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class PresignDto {
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  contentType: string;

  @IsNumber()
  @IsNotEmpty()
  size: number;
}
