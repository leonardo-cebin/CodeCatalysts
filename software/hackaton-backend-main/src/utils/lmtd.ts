import { LmtdEnum } from 'src/data/lmtd';

export function calculateLMTD(
  T_hot_in: number,
  T_hot_out: number,
  T_cold_in: number,
  T_cold_out: number,
  flowType: LmtdEnum,
) {
  // Calcula as diferenças de temperatura
  let deltaT1, deltaT2;
  if (flowType === LmtdEnum.OPPOSITE) {
    // Sentidos opostos
    deltaT1 = T_hot_in - T_cold_out;
    deltaT2 = T_hot_out - T_cold_in;
  } else if (flowType === LmtdEnum.PARALLEL) {
    // Sentidos paralelos
    deltaT1 = T_hot_in - T_cold_in;
    deltaT2 = T_hot_out - T_cold_out;
  } else {
    throw new Error("Tipo de fluxo inválido. Use 'opposite' ou 'parallel'.");
  }

  // Verifica se deltaT1 e deltaT2 são válidos
  if (deltaT1 === deltaT2) {
    return deltaT1; // Evita divisão por zero (LMTD é igual a deltaT)
  }

  // Calcula o LMTD
  const lmtd = (deltaT1 - deltaT2) / Math.log(deltaT1 / deltaT2);

  // Retorna o LMTD
  return lmtd;
}
