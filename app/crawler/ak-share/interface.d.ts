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

// 个股详情
export interface StockDetailPrps {
  symbol: string;
}

// 个股历史行情
export interface StockHistoryQuotePrps {
  symbol: string; // 股票代码 603777
  period?: 'daily' | 'weekly' | 'monthly'; // 周期，可选值：daily', 'weekly', 'monthly
  start_date?: string; // 开始日期 start_date='20210301'; 开始查询的日期
  end_date?: string; // 结束日期 end_date='20210331'; 结束查询的日期
  adjust?: string; // 默认返回不复权的数据; qfq: 返回前复权后的数据; hfq: 返回后复权后的数据
}

// 分析师详情
export interface AnalystDetailPrps {
  analyst_id: string; // analyst_id="11000257131"; 分析师ID, 从 ak.stock_analyst_rank_em() 获取
  indicator?: '最新跟踪成分股' | '历史跟踪成分股' | '历史指数'; //indicator="最新跟踪成分股"; 从 {"最新跟踪成分股", "历史跟踪成分股", "历史指数"} 中选择
}
