// 计算 BOLL 线
export const calculateBOLL = (column: string[], data: number[][], period: number = 20) => {
  const closeIndex = column.indexOf('close');
  const result = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(['-', '-', '-']);
      continue;
    }

    // 计算MA
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += Number(data[i - j][closeIndex]);
    }
    const ma = sum / period;

    // 计算标准差
    let squareSum = 0;
    for (let j = 0; j < period; j++) {
      const diff = Number(data[i - j][closeIndex]) - ma;
      squareSum += diff * diff;
    }
    const std = Math.sqrt(squareSum / period);

    // BOLL线 = MA ± 2 × STD
    result.push([Number(ma.toFixed(2)), Number((ma + 2 * std).toFixed(2)), Number((ma - 2 * std).toFixed(2))]);
  }
  return result[result.length - 1];
};

interface TransformDataProps {
  symbol: string;
  period: string;
  top: number | string;
  middle: number | string;
  bottom: number | string;
}

export const transformData = (
  data: TransformDataProps[]
): Record<string, Record<string, { top: number; middle: number; bottom: number }>> => {
  const result: Record<string, Record<string, { top: number; middle: number; bottom: number }>> = {};

  data.forEach(item => {
    const { symbol, period, top, middle, bottom } = item;

    if (!result[symbol]) {
      result[symbol] = {};
    }

    result[symbol][period] = {
      top,
      middle,
      bottom
    };
  });

  return result;
};
