import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Inject, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { REDIS_CLIENT } from '../common/redis/redis.module';
import Redis from 'ioredis';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/realtime',
})
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private subscriber: Redis;

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {
    // Create a dedicated Redis subscriber
    this.subscriber = redis.duplicate();
  }

  async afterInit() {
    console.log('🔌 WebSocket Gateway initialized');

    // Subscribe to Redis pub/sub for real-time updates
    try {
      await this.subscriber.subscribe('realtime:events', 'realtime:alerts', 'realtime:pipeline');

      this.subscriber.on('message', (channel: string, message: string) => {
        try {
          const data = JSON.parse(message);

          switch (channel) {
            case 'realtime:events':
              this.server.emit('event.new', data);
              break;
            case 'realtime:alerts':
              this.server.emit('alert.triggered', data);
              break;
            case 'realtime:pipeline':
              this.server.emit('pipeline.status', data);
              break;
          }
        } catch {
          // Ignore parse errors
        }
      });
    } catch (error) {
      console.warn('⚠️ Redis pub/sub connection failed:', (error as Error).message);
    }
  }

  handleConnection(client: Socket) {
    console.log(`🔗 Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`🔌 Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channel: string; projectId: string },
  ) {
    const room = `${data.channel}:${data.projectId}`;
    client.join(room);
    console.log(`📡 Client ${client.id} subscribed to ${room}`);
    return { event: 'subscribed', data: { channel: data.channel, projectId: data.projectId } };
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channel: string; projectId?: string },
  ) {
    const room = data.projectId ? `${data.channel}:${data.projectId}` : data.channel;
    client.leave(room);
    return { event: 'unsubscribed', data: { channel: data.channel } };
  }

  // Emit to specific project room
  emitToProject(projectId: string, event: string, data: unknown) {
    this.server.to(`realtime:${projectId}`).emit(event, data);
  }
}
