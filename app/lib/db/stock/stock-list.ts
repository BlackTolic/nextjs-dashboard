'use server'
import { sql } from '@vercel/postgres';
import { StockInfo } from '../../../dashboard/stock-pool/constant';
import { pollXueqiuStocksList } from '../../../crawler/stock-crawler';

export async function insertStocks(stocks: StockInfo[]) {
  try {
    // console.log(window,'window')
    // 首先清空现有的股票数据
    await sql`TRUNCATE TABLE stocks`;
    
    // 批量插入新的股票数据
    for (const stock of stocks) {
      // console.log(stock,'stock')
      await sql`
        INSERT INTO stocks (
          symbol,//股票代码
          name,//股票名称
          market,//市场
          industry,//行业
          listing_date,//上市日期
          total_share,//总股本
          circulating_share,//流通股本
          total_market_value,//总市值
          circulating_market_value
        ) VALUES (
          ${stock.symbol},
          ${stock.name},
          ${stock.market},
          ${stock.industry},
          ${stock.listingDate},
          ${stock.totalShare},
          ${stock.circulatingShare},
          ${stock.totalMarketValue},
          ${stock.circulatingMarketValue}
        )
      `;
    }
    
    console.log('股票数据插入成功');
    return { success: true };
  } catch (error) {
    console.error('插入股票数据时发生错误:', error);
    return { success: false, error };
  }
}

export async function getStocks(page: number = 1, pageSize: number = 10) {
  try {
    // 计算偏移量
    const offset = (page - 1) * pageSize;
    
    // 获取分页数据
    const stocks = await sql`
      SELECT * FROM stocks
      ORDER BY symbol ASC
      LIMIT ${pageSize}
      OFFSET ${offset}
    `;
    
    // 获取总记录数
    const totalCount = await sql`
      SELECT COUNT(*) FROM stocks
    `;
    
    const total = parseInt(totalCount.rows[0].count);
    const totalPages = Math.ceil(total / pageSize);
    
    return {
      data: stocks.rows,
      pagination: {
        current: page,
        pageSize,
        total,
        totalPages
      }
    };
  } catch (error) {
    console.error('获取股票数据时发生错误:', error);
    throw error;
  }
}

export async function searchStocks(keyword: string) {
  try {
    const stocks = await sql`
      SELECT * FROM stocks
      WHERE 
        symbol ILIKE ${`%${keyword}%`} OR
        name ILIKE ${`%${keyword}%`}
      ORDER BY symbol ASC
      LIMIT 10
    `;
    
    return stocks.rows;
  } catch (error) {
    console.error('搜索股票时发生错误:', error);
    throw error;
  }
}

export async function updateStocksFromXueqiu() {
  try {
    const rawStocks = await pollXueqiuStocksList();
    
    // 转换数据格式
    const stocks: StockInfo[] = rawStocks.map((stock: { 
      symbol: string;
      name: string;
      industry?: string;
      listDate?: string;
      totalShares?: number;
      floatShares?: number;
      marketCapital?: number;
      floatMarketCapital?: number;
    }) => ({
      symbol: stock.symbol,
      name: stock.name,
      market: 'A股',
      industry: (stock as any).industry || '',
      listingDate: (stock as any).listDate || null,
      totalShare: (stock as any).totalShares || 0,
      circulatingShare: (stock as any).floatShares || 0,
      totalMarketValue: (stock as any).marketCapital || 0,
      circulatingMarketValue: (stock as any).floatMarketCapital || 0
    }));
    const result = await insertStocks(stocks);
    
    if (result.success) {
      console.log('成功从雪球更新股票数据');
      return { success: true, count: stocks.length };
    } else {
      console.error('从雪球更新股票数据失败:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('从雪球更新股票数据时发生错误:', error);
    return { success: false, error };
  }
}

// export async function updateStocksFromPolling(stocks: any[]) {
//   try {
//     // 转换数据格式
//     const formattedStocks: StockInfo[] = stocks.map((stock) => ({
//       symbol: stock.symbol,
//       name: stock.name,
//       market: 'A股',
//       industry: stock.industry || '',
//       listingDate: stock.listDate || '',
//       totalShare: stock.totalShares || 0,
//       circulatingShare: stock.floatShares || 0,
//       totalMarketValue: stock.marketCapital || 0,
//       circulatingMarketValue: stock.floatMarketCapital || 0
//     }));

//     // 使用现有的insertStocks函数插入数据
//     const result = await insertStocks(formattedStocks);
    
//     if (result.success) {
//       console.log('成功更新轮询的股票数据');
//       return { success: true, count: formattedStocks.length };
//     } else {
//       console.error('更新轮询的股票数据失败:', result.error);
//       return { success: false, error: result.error };
//     }
//   } catch (error) {
//     console.error('更新轮询的股票数据时发生错误:', error);
//     return { success: false, error };
//   }
// } 