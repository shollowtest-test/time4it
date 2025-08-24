import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { PresignDto } from './dto/presign.dto';

@Controller('api/uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('presign')
  async getPresignedUrl(@Body(new ValidationPipe()) dto: PresignDto) {
    return this.uploadsService.getPresignedUrl(dto);
  }
}
