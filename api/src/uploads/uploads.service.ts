import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';

// Definiujemy typ DTO dla serwisu
export interface GetPresignedUrlDto {
  tenantId: string;
  filename: string;
  contentType: string;
  size: number;
}

@Injectable()
export class UploadsService {
  private readonly minioClient: Minio.Client;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    //Walidacja. ale jest
    const endpoint = this.configService.get<string>('MINIO_ENDPOINT');
    const port = this.configService.get<string>('MINIO_PORT');
    const accessKey = this.configService.get<string>('MINIO_ACCESS_KEY');
    const secretKey = this.configService.get<string>('MINIO_SECRET_KEY');
    const bucketName = this.configService.get<string>('MINIO_BUCKET');

    if (!endpoint || !port || !accessKey || !secretKey || !bucketName) {
      throw new Error(
        'Missing MinIO configuration. Please check your .env file.',
      );
    }

    this.minioClient = new Minio.Client({
      endPoint: endpoint,
      port: parseInt(port, 10), // Dodajemy radix `10` dla `parseInt` - to dobra praktyka
      useSSL: false,
      accessKey: accessKey,
      secretKey: secretKey,
    });

    this.bucketName = bucketName;
  }

  async getPresignedUrl(dto: GetPresignedUrlDto) {
    const { tenantId, filename, contentType, size } = dto;

    // Waldacja typów
    const allowedContentTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedContentTypes.includes(contentType)) {
      throw new BadRequestException(
        `Content type ${contentType} is not allowed.`,
      );
    }

    //Walidacja rozmiaru
    const maxFileSize = parseInt(
      this.configService.get<string>('MAX_UPLOAD_FILE_SIZE_BYTES', '5242880'),
    );
    if (size > maxFileSize) {
      const maxFileSizeMB = (maxFileSize / 1024 / 1024).toFixed(2);
      throw new BadRequestException(
        `File size of ${size} bytes exceeds the limit of ${maxFileSizeMB} MB.`,
      );
    }

    const uniqueFilename = `${uuidv4()}-${filename}`;
    const objectName = `tenants/${tenantId}/uploads/${uniqueFilename}`;

    // Link będzie ważny przez 5 minut (300 sekund)
    const expiresIn = 5 * 60;

    try {
      // Tym generuje url-a do puta
      const url = await this.minioClient.presignedPutObject(
        this.bucketName,
        objectName,
        expiresIn,
      );

      return {
        url,
        storageKey: objectName,
        expiresInSeconds: expiresIn,
        headers: { 'Content-Type': contentType },
      };
    } catch (error) {
      console.error('Błąd generowanie linku:', error);
      throw new Error('Nie wygenerowano link.');
    }
  }
}
