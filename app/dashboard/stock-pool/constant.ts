export interface StockInfo {
  symbol: string;
  name: string;
  market: string;
  industry: string;
  listingDate: string;
  totalShare: number;
  circulatingShare: number;
  totalMarketValue: number;
  circulatingMarketValue: number;
}

export interface StockPoolColumn {
  title: string;
  dataIndex: string;
}

export const stockPoolColumns: StockPoolColumn[] = [
  {
    title: '股票代码',
    dataIndex: 'symbol',
  },
  {
    title: '股票名称',
    dataIndex: 'name',
  },
  {
    title: '行业',
    dataIndex: 'industry',

  },  
  {
    title: '总市值',
    dataIndex: 'total_market_value',
  },
];


