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

// 板块资金排行
export interface BlockFundRankPrps {
  symbol: '北向资金增持行业板块排行' | '北向资金增持概念板块排行' | '北向资金增持地域板块排行';
  indicator: '今日' | '3日' | '5日' | '10日' | '1月' | '1季' | '1年';
}

//股东增减持
export interface StockShareHolderPrps {
  symbol: '全部' | '股东增持' | '股东减持'; // 股票代码 603777
}

// 分红配送
export interface StockDividendPrps {
  date: string; // date="20231231"; choice of {"XXXX0630"| "XXXX1231"}; 从 19901231 开始
}

// 概念资金流
export interface StockConceptFundFlowPrps {
  symbol: '即时' | '3日排行' | '5日排行' | '10日排行' | '20日排行'; // date="20231231"; choice of {"XXXX0630", "XXXX1231"}; 从 19901231 开始
}

// 个股资金流排名
export interface StockFundFlowRankPrps {
  symbol: '今日' | '3日' | '5日' | '10日';
}

// 资产负债表
export interface StockFinancePrps {
  symbol: string; // 股票代码 603777
  indicator: '按报告期' | '按年度' | '按单季度';
}

// 机构推荐池
export interface StockRecommendPoolPrps {
  symbol:
    | '最新投资评级'
    | '上调评级股票'
    | '下调评级股票'
    | '股票综合评级'
    | '首次评级股票'
    | '目标涨幅排名'
    | '机构关注度'
    | '行业关注度'
    | '投资评级选股'; // 股票代码 603777
}

// A 股估值指标
export interface StockValuationPrps {
  symbol: string; // 股票代码 603777
  indicator: '总市值' | '市盈率(TTM)' | '市盈率(静)' | '市净率' | '市现率';
  period: '近一年' | '近三年' | '近五年' | '近十年' | '全部';
}

// 创新高和新低的股票数量
export interface StockHighLowPrps {
  symbol: 'all' | 'sz50' | 'hs300' | 'zz500';
}

// 每日活跃营业部
export interface StockActiveBrokerPrps {
  start_date: string; // start_date="20220311"
  end_date: string; // end_date="20220315"
}

// 雪球股票热度
export interface StockHeatPrps {
  symbol: '本周新增' | '最热门';
}
