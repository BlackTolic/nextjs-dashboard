'use client';
import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type { KlineData, KlineDataTuple } from '@/app/crawler/stock-crawler';

interface CandlestickChartProps {
  data: KlineDataTuple; // K线数据数组
  symbol: string; // 股票代码
  column: string[]; // 数据列名数组
}

const CandlestickChart = ({ data, symbol, column }: CandlestickChartProps) => {
  const [options, setOptions] = useState({});

  useEffect(() => {
    // 获取各数据列的索引位置
    const openIndex = column.indexOf('open'); // 开盘价列索引
    const closeIndex = column.indexOf('close'); // 收盘价列索引
    const lowIndex = column.indexOf('low'); // 最低价列索引
    const highIndex = column.indexOf('high'); // 最高价列索引
    const timestampIndex = column.indexOf('timestamp'); // 时间戳列索引

    // 转换时间戳为日期字符串
    const categoryData = data.map(item => new Date(Number(item[timestampIndex])).toLocaleDateString());

    // 构建K线图所需的数据格式
    const values = data.map(item => [
      Number(item[openIndex]),
      Number(item[closeIndex]),
      Number(item[lowIndex]),
      Number(item[highIndex])
    ]);
    // console.log(data, 'data');
    // console.log(values, 'values');

    // 获取成交量列的索引
    const volumeIndex = column.indexOf('volume');

    // 提取成交量数据
    const volumes = data.map(item => Number(item[volumeIndex]));

    // 计算各周期移动平均线
    const ma5 = calculateMA(5, data); // 5日均线
    const ma10 = calculateMA(10, data); // 10日均线
    const ma20 = calculateMA(20, data); // 20日均线

    const option = {
      title: {
        text: `${symbol} K线图`,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: function (params: any) {
          const date = params[0].axisValue;
          let res = `<div style="font-size:14px;color:#666;font-weight:400;line-height:1;">日期：${date}<br/>`;
          params.forEach((item: any) => {
            if (item.seriesName === 'K线') {
              res += `开盘：${item.data[1]}<br/>`;
              res += `收盘：${item.data[2]}<br/>`;
              res += `最低：${item.data[3]}<br/>`;
              res += `最高：${item.data[4]}<br/>`;
            } else if (item.seriesName === '成交量') {
              res += `成交量：${item.data}<br/>`;
            } else {
              res += `${item.seriesName}：${item.data}<br/>`;
            }
          });
          return res;
        }
      },
      legend: {
        data: ['K线', 'MA5', 'MA10', 'MA20', '成交量'],
        top: '3%'
      },
      grid: [
        {
          left: '10%',
          right: '10%',
          top: '15%',
          height: '55%'
        },
        {
          left: '10%',
          right: '10%',
          top: '75%',
          height: '15%'
        }
      ],
      xAxis: [
        {
          type: 'category',
          data: categoryData,
          scale: true,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          splitNumber: 20
        },
        {
          type: 'category',
          gridIndex: 1,
          data: categoryData,
          axisLabel: { show: false }
        }
      ],
      yAxis: [
        {
          scale: true,
          splitArea: { show: true }
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false }
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 0,
          end: 100
        },
        {
          show: true,
          xAxisIndex: [0, 1],
          type: 'slider',
          bottom: '0%',
          start: 0,
          end: 100
        }
      ],
      series: [
        {
          name: 'K线',
          type: 'candlestick',
          data: values,
          itemStyle: {
            color: '#ef5350',
            color0: '#26a69a',
            borderColor: '#ef5350',
            borderColor0: '#26a69a'
          }
        },
        {
          name: 'MA5',
          type: 'line',
          data: ma5,
          smooth: true,
          lineStyle: { opacity: 0.5 }
        },
        {
          name: 'MA10',
          type: 'line',
          data: ma10,
          smooth: true,
          lineStyle: { opacity: 0.5 }
        },
        {
          name: 'MA20',
          type: 'line',
          data: ma20,
          smooth: true,
          lineStyle: { opacity: 0.5 }
        },
        {
          name: '成交量',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: volumes,
          itemStyle: {
            color: '#26a69a'
          }
        }
      ]
    };

    setOptions(option);
  }, [data, symbol, column]);

  /**
   * 计算移动平均线
   * @param dayCount 计算周期（天数）
   * @param data K线数据
   * @returns 移动平均线数据数组
   */
  const calculateMA = (dayCount: number, data: number[][]) => {
    const result = [];
    const closeIndex = column.indexOf('close');
    for (let i = 0, len = data.length; i < len; i++) {
      if (i < dayCount - 1) {
        result.push('-');
        continue;
      }
      let sum = 0;
      for (let j = 0; j < dayCount; j++) {
        sum += data[i - j][closeIndex];
      }
      result.push((sum / dayCount).toFixed(2));
    }
    return result;
  };

  return <ReactECharts option={options} style={{ height: '600px' }} />;
};

export default CandlestickChart;
