import { Module } from '@nestjs/common';
import { HeatExchangerService } from './heat-exchanger.service';
import { HeatExchangerGateway } from './heat-exchanger.gateway';

@Module({
  providers: [HeatExchangerGateway, HeatExchangerService],
})
export class HeatExchangerModule {}
