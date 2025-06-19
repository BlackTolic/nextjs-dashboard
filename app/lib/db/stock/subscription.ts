'use server';
import { sql } from '@vercel/postgres';
import { nextAuth } from '@/auth';
interface Subscription {
  user_id: string;
  stock_symbol: string;
  settings: any;
  updated_at: Date;
  email: string;
}


