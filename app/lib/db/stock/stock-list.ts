'use server';
import { sql } from '@vercel/postgres';
import { StockInfo } from '../../../dashboard/stock-pool/constant';
import { pollXueqiuStocksList } from '../../../crawler/stock-crawler';

export async function insertStocks(stocks: StockInfo[]) {
  try {
    const batchSize = 100; // 每批处理的数据量
    const batches = [];

    // 将数据分批
    for (let i = 0; i < stocks.length; i += batchSize) {
      batches.push(stocks.slice(i, i + batchSize));
    }

    // 处理每一批数据
    for (const batch of batches) {
      const placeholders = batch
        .map(
          (_, i) =>
            `($${i * 9 + 1}, $${i * 9 + 2}, $${i * 9 + 3}, $${i * 9 + 4}, $${i * 9 + 5}, $${i * 9 + 6}, $${i * 9 + 7}, $${i * 9 + 8}, $${i * 9 + 9})`
        )
        .join(',');

      const values = batch.flatMap(stock => [
        stock.symbol,
        stock.name,
        stock.market,
        stock.industry,
        stock.listingDate,
        stock.totalShare,
        stock.circulatingShare,
        stock.totalMarketValue,
        stock.circulatingMarketValue
      ]);

      await sql.query(
        `
        INSERT INTO stocks (
          symbol, name, market, industry, listing_date,
          total_share, circulating_share, total_market_value, circulating_market_value
        )
        VALUES ${placeholders}
        ON CONFLICT (symbol) DO UPDATE SET
          name = EXCLUDED.name,
          market = EXCLUDED.market,
          industry = EXCLUDED.industry,
          listing_date = EXCLUDED.listing_date,
          total_share = EXCLUDED.total_share,
          circulating_share = EXCLUDED.circulating_share,
          total_market_value = EXCLUDED.total_market_value,
          circulating_market_value = EXCLUDED.circulating_market_value
        `,
        values
      );

      console.log(`成功插入/更新 ${batch.length} 条数据`);
    }

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

export async function updateStocksFromXueqiu(rawStocks: any[]) {
  try {
    // const rawStocks = await pollXueqiuStocksList();
    // console.log(rawStocks, 'rawStocks');
    // 转换数据格式
    const stocks: StockInfo[] = rawStocks.map(
      (stock: {
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
      })
    );
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

export async function getAllStocks() {
  try {
    const stocks = await sql`
      SELECT * FROM stocks
      ORDER BY symbol ASC
    `;

    return {
      data: stocks.rows
    };
  } catch (error) {
    console.error('获取所有股票数据时发生错误:', error);
    throw error;
  }
}
