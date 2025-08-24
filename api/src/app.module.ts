import { OrdersGateway } from './orders/orders.gateway';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { OrdersModule } from './orders/orders.module';
import { UploadsModule } from './uploads/uploads.module';
import { UploadsService } from './uploads/uploads.service';

@Module({
  imports: [
    //Envs
    ConfigModule.forRoot({ isGlobal: true }),
    //Db
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    CqrsModule,
    OrdersModule,
    UploadsModule,
  ],
  controllers: [],
  providers: [OrdersGateway, UploadsService],
})
export class AppModule {}
