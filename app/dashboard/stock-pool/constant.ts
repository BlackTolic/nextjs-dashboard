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
  [key: string]: string | number;
}

export interface StockPoolColumn {
  title: string;
  dataIndex: string;
}

export const stockPoolColumns = [
  {
    prop: 'symbol',
    label: '股票代码',
    sortable: true,
  },
  {
    prop: 'name',
    label: '股票名称',
    sortable: true,
  },
  {
    prop: 'industry',
    label: '行业',
    sortable: true,
  },
  {
    prop: 'total_market_value',
    label: '总市值',
    sortable: true,
  },
];
