import { sql } from '@vercel/postgres';

export interface Thought {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export async function getThoughtById(id: string): Promise<Thought> {
  try {
    const result = await sql`
      SELECT 
        id, 
        title, 
        content, 
        created_at::text, 
        updated_at::text 
      FROM investment_thoughts 
      WHERE id = ${id} AND deleted_at IS NULL
    `;
    return result.rows[0] as Thought;
  } catch (error) {
    console.error('获取投资想法失败:', error);
    throw error;
  }
}
