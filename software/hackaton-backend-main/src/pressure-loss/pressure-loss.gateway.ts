import { WebSocketGateway } from '@nestjs/websockets';
import { PressureLossService } from './pressure-loss.service';

@WebSocketGateway({
  namespace: '/pressure-los',
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class PressureLossGateway {
  constructor(private readonly pressureLossService: PressureLossService) {}
}
