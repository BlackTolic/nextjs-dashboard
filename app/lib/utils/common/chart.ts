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
  upper: number | string;
  middle: number | string;
  lower: number | string;
}

export const transformData = (
  data: TransformDataProps[]
): Record<string, Record<string, Omit<TransformDataProps, 'symbol' | 'period'>>> => {
  const result: Record<string, Record<string, Omit<TransformDataProps, 'symbol' | 'period'>>> = {};

  data.forEach(item => {
    const { symbol, period, upper, middle, lower } = item;

    if (!result[symbol]) {
      result[symbol] = {};
    }

    result[symbol][period] = {
      upper,
      middle,
      lower
    };
  });

  return result;
};

export const getSocketSymbol = (socket: string) => {
  return socket.length === 8 ? socket.slice(2) : socket;
};
