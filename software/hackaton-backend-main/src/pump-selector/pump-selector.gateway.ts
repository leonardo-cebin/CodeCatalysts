import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PumpSelectorService } from './pump-selector.service';

@WebSocketGateway({
  namespace: '/pump-selector',
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000, // Aumente o timeout para 60 segundos
  pingInterval: 25000,
})
export class PumpSelectorGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly pumpSelectorService: PumpSelectorService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('chat')
  async handleChat(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket, // Certifique-se de que isso está correto
  ): Promise<void> {
    console.log('Mensagem recebida do cliente:', message);

    try {
      const responseStream = this.pumpSelectorService.streamResponse(message);

      for await (const chunk of responseStream) {
        if (client?.connected) {
          client.emit('response', chunk); // Emite cada parte da resposta
          console.log('Chunk enviado:', chunk);
        } else {
          console.error('Cliente desconectado antes de concluir o envio.');
          break;
        }
      }

      if (client?.connected) {
        client.emit('end', 'Resposta completa');
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      if (client?.connected) {
        client.emit('error', 'Erro ao processar a mensagem');
      }
    }
  }
}
