import { Module } from '@nestjs/common';
import { PumpSelectorService } from './pump-selector.service';
import { PumpSelectorGateway } from './pump-selector.gateway';
import { QueryRunnerService } from 'src/db/query-runner.service';

@Module({
  providers: [PumpSelectorGateway, PumpSelectorService, QueryRunnerService],
})
export class PumpSelectorModule {}
