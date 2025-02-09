'use server';

import { sql } from '@vercel/postgres';
import { auth } from '@/auth';

interface BollSettings {
  daily: {
    enabled: boolean;
    lines: {
      upper: { enabled: boolean; offset: number };
      middle: { enabled: boolean; offset: number };
      lower: { enabled: boolean; offset: number };
    };
  };
  weekly: {
    enabled: boolean;
    lines: {
      upper: { enabled: boolean; offset: number };
      middle: { enabled: boolean; offset: number };
      lower: { enabled: boolean; offset: number };
    };
  };
  monthly: {
    enabled: boolean;
    lines: {
      upper: { enabled: boolean; offset: number };
      middle: { enabled: boolean; offset: number };
      lower: { enabled: boolean; offset: number };
    };
  };
}

interface SubscriptionSettings {
  stockSymbol: string;
  isSubscribed: boolean;
  bollSettings: {
    daily: {
      enabled: boolean;
      lines: {
        upper: { enabled: boolean; offset: number };
        middle: { enabled: boolean; offset: number };
        lower: { enabled: boolean; offset: number };
      };
    };
    weekly: {
      enabled: boolean;
      lines: {
        upper: { enabled: boolean; offset: number };
        middle: { enabled: boolean; offset: number };
        lower: { enabled: boolean; offset: number };
      };
    };
    monthly: {
      enabled: boolean;
      lines: {
        upper: { enabled: boolean; offset: number };
        middle: { enabled: boolean; offset: number };
        lower: { enabled: boolean; offset: number };
      };
    };
  };
  profitLossRatio: {
    buyPrice: number;
    ratio: number;
  };
}

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
    console.log(settingsJson, 'settingsJson');
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

export async function getSubscriptionSettings(stockSymbol: string) {
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

    const result = await sql`
      SELECT settings
      FROM subscriptions
      WHERE user_id = ${session.user.id} AND stock_symbol = ${stockSymbol}
    `;

    if (result.rows.length === 0) {
      return null;
    }

    return JSON.parse(result.rows[0].settings);
  } catch (error) {
    console.error('获取订阅设置失败:', error);
    throw error;
  }
}
