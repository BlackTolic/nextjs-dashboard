'use server';

import { sql } from '@vercel/postgres';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { removeSubscription } from '@/app/lib/db/stock/subscription';

// 订阅设置
interface BollLine {
  enabled: boolean;
  offset: number;
}

interface BollPeriod {
  upper: BollLine;
  middle: BollLine;
  lower: BollLine;
}

interface SubscriptionSettings {
  stockSymbol: string;
  isSubscribed: boolean;
  bollSettings: {
    daily: BollPeriod;
    weekly: BollPeriod;
    monthly: BollPeriod;
  };
  profitLossRatio: {
    buyPrice: number;
    ratio: number;
  };
}

// 保存订阅设置
export async function saveSubscriptionSettings(settings: SubscriptionSettings) {
  try {
    // const session = await auth();
    //todo
    const session = {
      user: {
        id: '410544b2-4001-4271-9855-fec4b6a6442a'
      }
    };
    if (!session?.user?.id) {
      throw new Error('未登录用户');
    }

    const { stockSymbol, ...settingsData } = settings;
    const settingsJson = JSON.stringify(settingsData);
    await sql`
      INSERT INTO subscriptions (user_id, stock_symbol, settings, updated_at)
      VALUES (${session.user.id}, ${stockSymbol}, ${settingsJson}::jsonb, NOW())
      ON CONFLICT (user_id, stock_symbol) 
      DO UPDATE SET
        settings = ${settingsJson}::jsonb,
        updated_at = NOW()
    `;
    return { success: true };
  } catch (error) {
    console.error('保存订阅设置失败:', error);
    return { success: false, error: '保存订阅设置失败' };
  }
}

// 获取订阅设置
export async function getSubscriptionSettings(stockSymbol: string) {
  try {
    const session = {
      user: {
        id: '410544b2-4001-4271-9855-fec4b6a6442a'
      }
    };
    if (!session?.user?.id) {
      throw new Error('未登录用户');
    }

    const result = await sql`
      SELECT settings
      FROM subscriptions
      WHERE user_id = ${session.user.id} AND stock_symbol = ${stockSymbol}
    `;

    if (result.rows.length === 0) {
      return null;
    }

    // 数据库返回的是 JSON 对象，直接返回
    return result.rows[0].settings;
  } catch (error) {
    console.error('获取订阅设置失败:', error);
    throw error;
  }
}

/**
 * 获取所有用户的订阅设置
 */
export async function getAllSubscriptionSettings() {
  try {
    // 查询数据库获取所有订阅记录
    const result = await sql`
      SELECT 
        user_id, 
        stock_symbol,
        settings,
        updated_at
      FROM subscriptions
    `;
    // 格式化返回结果
    return result.rows.map(row => ({
      userId: row.user_id,
      stockSymbol: row.stock_symbol,
      settings: row.settings,
      updatedAt: row.updated_at,
      email: row.email
    }));
  } catch (error) {
    console.error('获取全部订阅设置失败:', error);
    throw new Error('获取订阅数据时发生错误');
  }
}

// 删除订阅的服务器动作
export async function removeSubscriptionAction(prevState: any, formData: FormData) {
  const stockSymbol = formData.get('stockSymbol') as string;

  try {
    const session = {
      user: {
        id: '410544b2-4001-4271-9855-fec4b6a6442a'
      }
    };

    if (!session?.user?.id) {
      throw new Error('未登录用户');
    }

    const result = await removeSubscription(session.user.id, stockSymbol);

    if (result.success) {
      revalidatePath('/dashboard/subscriptions');
      return { success: true };
    } else {
      return { success: false, error: '删除失败' };
    }
  } catch (error) {
    console.error('删除订阅失败:', error);
    return { success: false, error: '删除失败，请重试' };
  }
}
