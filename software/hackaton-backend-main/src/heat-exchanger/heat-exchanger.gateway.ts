import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  // OnGatewayDestroy,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger, OnModuleDestroy } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { HeatExchangerService } from './heat-exchanger.service';
import { CalculateHeatExchangerDto } from './dto/calculate-heat-exchanger.dto';

@WebSocketGateway({
  namespace: '/heat-exchanger',
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class HeatExchangerGateway implements OnGatewayInit, OnModuleDestroy {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(HeatExchangerGateway.name);
  private interval: NodeJS.Timeout;

  constructor(private readonly heatExchangerService: HeatExchangerService) {}

  afterInit(): void {
    this.logger.log('WebSocket Gateway inicializado.');
    this.startSensorEmulation();
  }

  onModuleDestroy(): void {
    this.clearSensorEmulation();
    this.logger.log('WebSocket Gateway destruído.');
  }

  private startSensorEmulation(): void {
    // this.logger.log('Iniciando emulação de sensores...');
    this.interval = setInterval(() => {
      const sensorData = {
        temperature: (Math.random() * 30 + 10).toFixed(2),
        humidity: (Math.random() * 50 + 20).toFixed(2),
        timestamp: new Date().toISOString(),
      };

      this.server.emit('sensor-data', sensorData);
      // this.logger.debug(`Sensor data emitido: ${JSON.stringify(sensorData)}`);
    }, 2000);
  }

  private clearSensorEmulation(): void {
    if (this.interval) {
      clearInterval(this.interval);
      // this.logger.log('Emulação de sensores encerrada.');
    }
  }

  @SubscribeMessage('calculate-heat-exchanger')
  handleCalculateHeatExchanger(
    @MessageBody() data: CalculateHeatExchangerDto,
    @ConnectedSocket() client: Socket,
  ): void {
    // this.logger.log('Mensagem recebida para cálculo de trocador de calor.');
    // this.logger.debug(`Dados recebidos: ${JSON.stringify(data)}`);

    const result = this.heatExchangerService.calculate(data);

    client.emit('calculation-result', result);

    // this.logger.debug(`Resultado enviado de volta para o cliente: ${result}`);
  }
}
