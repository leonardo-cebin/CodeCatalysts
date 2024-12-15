import { Injectable } from '@nestjs/common';
import { calculateLMTD } from 'src/utils/lmtd';
import { CalculateHeatExchangerDto } from './dto/calculate-heat-exchanger.dto';

@Injectable()
export class HeatExchangerService {
  private area(radius: number, pipeLength: number, pipeQtd: number): number {
    return 2 * Math.PI * radius * pipeLength * pipeQtd;
  }

  private fahrenheitToCelsius(fah) {
    return (fah - 32) / 1.8;
  }

  calculate(payload: CalculateHeatExchangerDto) {
    console.log('payload', payload);

    const transferredHeat =
      payload.scale === 'F'
        ? payload.coeficient *
          this.area(payload.radius / 100, payload.pipeLength, payload.pipeQtd) *
          calculateLMTD(
            this.fahrenheitToCelsius(payload.T_hot_in),
            this.fahrenheitToCelsius(payload.T_hot_out),
            this.fahrenheitToCelsius(payload.T_cold_in),
            this.fahrenheitToCelsius(payload.T_cold_out),
            payload.flowType,
          )
        : payload.coeficient *
          this.area(payload.radius / 100, payload.pipeLength, payload.pipeQtd) *
          calculateLMTD(
            payload.T_hot_in,
            payload.T_hot_out,
            payload.T_cold_in,
            payload.T_cold_out,
            payload.flowType,
          );

    return {
      transferredHeat,
      area: this.area(
        payload.radius / 100,
        payload.pipeLength,
        payload.pipeQtd,
      ),
      hotFlow: Math.abs(
        ((payload.T_hot_in - payload.T_hot_out) *
          payload.hotInFluid.specific_heat) /
          transferredHeat,
      ),
      coldFlow: Math.abs(
        ((payload.T_cold_in - payload.T_cold_out) *
          payload.coldInFluid.specific_heat) /
          transferredHeat,
      ),
    };
  }
}
