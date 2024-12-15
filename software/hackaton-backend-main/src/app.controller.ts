import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { QueryRunnerService } from './db/query-runner.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly queryRunnerService: QueryRunnerService,
  ) {}

  @Get('coefficients')
  async getCoeficientes() {
    return await this.queryRunnerService.getRawData();
  }
}
