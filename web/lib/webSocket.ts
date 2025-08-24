// lib/webSocket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function createSocket(tenantId: string): Socket {
  const roomId = `tenant-${tenantId}`;

  if (socket && socket.connected) {
    return socket;
  }

  socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
    query: {
      tenantId: roomId,
    },
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
