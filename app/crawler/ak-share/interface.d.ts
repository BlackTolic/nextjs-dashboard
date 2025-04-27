type SixDigitString = string & { readonly __brand: unique symbol };

// 辅助函数用于创建6位字符串
const createSixDigitString: SixDigitString | never = (str: string) => {
  if (/^\d{6}$/.test(str)) {
    return str as SixDigitString;
  }
  throw new Error('字符串必须是6位数字');
};

// 股票行业成交
export interface IndustryTradePrps {
  symbol?: '当月' | '当年';
  date?: SixDigitString;
}
