'use server';
import { sql } from '@vercel/postgres';

export async function addSubscription(userId: string, stockSymbol: string) {
  try {
    await sql`
      INSERT INTO subscriptions (user_id, stock_symbol)
      VALUES (${userId}, ${stockSymbol})
      ON CONFLICT (user_id, stock_symbol) DO NOTHING
    `;
    return { success: true };
  } catch (error) {
    console.error('添加订阅失败:', error);
    return { success: false, error };
  }
}

export async function removeSubscription(userId: string, stockSymbol: string) {
  try {
    await sql`
      DELETE FROM subscriptions
      WHERE user_id = ${userId} AND stock_symbol = ${stockSymbol}
    `;
    return { success: true };
  } catch (error) {
    console.error('取消订阅失败:', error);
    return { success: false, error };
  }
}

export async function getUserSubscriptions(userId: string) {
  try {
    const result = await sql`
      SELECT s.*, st.name as stock_name
      FROM subscriptions s
      LEFT JOIN stocks st ON s.stock_symbol = st.symbol
      WHERE s.user_id = ${userId}
      ORDER BY s.created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error('获取用户订阅失败:', error);
    throw error;
  }
}
