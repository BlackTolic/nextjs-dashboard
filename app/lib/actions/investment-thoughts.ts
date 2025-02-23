'use server';

import { sql } from '@vercel/postgres';
import { nextAuth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { getSession } from 'next-auth/react';

export interface Thought {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export async function addThought(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const session = await nextAuth.auth();
  console.log(session, 'session');
  if (!session?.user?.id) {
    throw new Error('未登录用户');
  }

  try {
    await sql`
      INSERT INTO investment_thoughts (user_id, title, content)
      VALUES (${session.user.id}, ${title}, ${content})
    `;
    revalidatePath('/dashboard/investment-thoughts');
  } catch (error) {
    throw new Error('保存失败');
  }
}

export async function updateThought(id: string, formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const session = await getSession();
  console.log(session, 'session3333');
  if (!session?.user?.id) {
    throw new Error('未登录用户');
  }

  try {
    await sql`
      UPDATE investment_thoughts 
      SET title = ${title}, content = ${content}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND user_id = ${session.user.id}
    `;
    revalidatePath('/dashboard/investment-thoughts');
  } catch (error) {
    throw new Error('更新失败');
  }
}

export async function deleteThought(id: string) {
  const session = await nextAuth.auth();

  if (!session?.user?.id) {
    throw new Error('未登录用户');
  }

  try {
    await sql`
      UPDATE investment_thoughts 
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND user_id = ${session.user.id}
    `;
    revalidatePath('/dashboard/investment-thoughts');
  } catch (error) {
    throw new Error('删除失败');
  }
}

export async function fetchThoughts(): Promise<Thought[]> {
  // const session = await auth();
  // const headersList = await headers();
  // const userId = headersList.get('x-user-id');
  const session = await nextAuth.auth();
  console.log(session, 'session2222');
  if (!session?.user?.id) {
    return [];
  }

  try {
    const result = await sql`
      SELECT id, title, content, created_at, updated_at
      FROM investment_thoughts
      WHERE user_id = ${session.user.id}
      AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return result.rows as Thought[];
  } catch (error) {
    console.error('获取思考列表失败:', error);
    return [];
  }
}
