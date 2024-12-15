import { LmtdEnum } from 'src/data/lmtd';

export class CalculateHeatExchangerDto {
  coeficient: number;
  radius: number;
  pipeLength: number;
  pipeQtd: number;
  T_hot_in: number;
  T_hot_out: number;
  T_cold_in: number;
  T_cold_out: number;
  flowType: LmtdEnum;
  hotInFluid: any;
  coldInFluid: any;
  scale: 'K' | 'C' | 'F';
}
