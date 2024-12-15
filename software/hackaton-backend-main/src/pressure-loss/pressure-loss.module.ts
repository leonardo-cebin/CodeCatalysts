import { Module } from '@nestjs/common';
import { PressureLossService } from './pressure-loss.service';
import { PressureLossGateway } from './pressure-loss.gateway';

@Module({
  providers: [PressureLossGateway, PressureLossService],
})
export class PressureLossModule {}
