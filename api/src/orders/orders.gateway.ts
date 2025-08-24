/*
TODO: Dodac ogranicznie na Port
*/

import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class OrdersGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string) {
    this.server.emit('events', data);
  }

  handleConnection(client: Socket) {
    const tenantId = client.handshake.query.tenantId;
    if (!tenantId) {
      console.log(`Błąd połączenia client: ${client.id}`);
      client.emit('Cannot establish connection');
      client.disconnect(true);
      return;
    }

    client.join(`${tenantId}`);
    console.log(`klient przydziejlony: ${client.id} / ${tenantId}`);
  }

  //INFO: ackcja do aktualizacji
  sendStatusUpdate(
    tenantId: string,
    payload: { orderId: string; status: string },
  ) {
    this.server.to(`tenant-${tenantId}`).emit('order.updated', payload);
    console.log(`Sent status update to room: tenant-${tenantId}`, payload);
  }

  sendOrderCreate(
    tenantId: string,
    payload: { orderId: string; status: string },
  ) {
    this.server.to(`tenant-${tenantId}`).emit('order.updated', payload);
    console.log(`Sent status update to room: tenant-${tenantId}`, payload);
  }

  handleDisconnect(client: any) {
    console.log('User disconnected');
  }

  afterInit(server: any) {
    console.log('Socket is live');
  }
}
