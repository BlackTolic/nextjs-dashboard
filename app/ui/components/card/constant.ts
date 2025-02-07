export const subscriptions = [
  {
    id: '1',
    title: '基础订阅',
    description: '适合个人投资者的基础数据分析套餐',
    maxValue: 1000,
    minValue: 100,
    chartData: {
      labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
      values: [120, 150, 180, 220, 250, 280]
    },
    selectedOptions: {
      showMaxValue: true,
      showMinValue: false,
      showChart: true
    }
  },
  {
    id: '2',
    title: '专业订阅',
    description: '为专业交易者提供的高级数据分析套餐',
    maxValue: 5000,
    minValue: 500,
    chartData: {
      labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
      values: [520, 650, 780, 920, 1050, 1280]
    },
    selectedOptions: {
      showMaxValue: true,
      showMinValue: true,
      showChart: true
    }
  },
  {
    id: '3',
    title: '企业订阅',
    description: '为机构投资者定制的全方位数据分析解决方案',
    maxValue: 10000,
    minValue: 1000,
    chartData: {
      labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
      values: [1200, 1500, 1800, 2200, 2500, 2800]
    },
    selectedOptions: {
      showMaxValue: true,
      showMinValue: true,
      showChart: true
    }
  }
];

export interface Subscription {
  id: string;
  title: string;
  description: string;
  maxValue: number;
  minValue: number;
  chartData?: {
    labels: string[];
    values: number[];
  };
  selectedOptions: {
    showMaxValue: boolean;
    showMinValue: boolean;
    showChart: boolean;
  };
}
