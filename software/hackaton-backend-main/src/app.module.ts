import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HeatExchangerModule } from './heat-exchanger/heat-exchanger.module';
import { PressureLossModule } from './pressure-loss/pressure-loss.module';
import { PumpSelectorModule } from './pump-selector/pump-selector.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueryRunnerService } from './db/query-runner.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: false, // Evite usar synchronize: true em produção
    }),
    PressureLossModule,
    HeatExchangerModule,
    PumpSelectorModule,
  ],
  controllers: [AppController],
  providers: [AppService, QueryRunnerService],
})
export class AppModule {}
