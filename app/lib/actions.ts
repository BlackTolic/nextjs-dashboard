'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

// 定义发票表单的验证模式
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({ invalid_type_error: 'Please select a customer.' }),
  amount: z.coerce
    .number() // coerce用于将输入值强制转换为数字类型
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.'
  }),
  date: z.string()
});

// 创建发票时使用的验证模式，省略id和date字段
const CreateInvoice = FormSchema.omit({ id: true, date: true });

// 定义状态类型，用于表单错误处理
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

// 创建发票的服务器动作
export async function createInvoice(prevState: State, formData: FormData) {
  // 使用safeParse进行表单验证，它会返回成功或错误对象
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  });

  // 如果验证失败，返回错误信息
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.'
    };
  }

  // 准备数据库插入数据
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100; // 将金额转换为分
  const date = new Date().toISOString().split('T')[0];

  try {
    // 向数据库插入新发票
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.'
    };
  }

  // 重新验证发票列表页面的数据
  revalidatePath('/dashboard/invoices');
  // 重定向到发票列表页面
  redirect('/dashboard/invoices');
}

// 更新发票的验证模式
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// 更新发票的服务器动作
export async function updateInvoice(id: string, formData: FormData): Promise<void> {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  });

  const amountInCents = amount * 100;
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  } catch (error) {
    console.error('Failed to Update Invoice:', error);
  }
}

// 删除发票的服务器动作
export async function deleteInvoice(id: string, formData: FormData): Promise<void> {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
  } catch (error) {
    console.error('Failed to Delete Invoice:', error);
  }
}

// 用户认证的服务器动作
export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      // 处理不同类型的认证错误
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function toggleStockSubscription(stockCode: string) {
  try {
    const session = await auth();
    if (!session?.user?.name) {
      throw new Error('未登录用户');
    }

    // 获取当前用户的订阅列表
    const user = await sql`
      SELECT subscribed_stocks FROM users WHERE id = ${session.user.id} 
    `;

    let subscribedStocks = user.rows[0]?.subscribed_stocks || [];

    // 更新订阅列表
    if (subscribedStocks.includes(stockCode)) {
      subscribedStocks = subscribedStocks.filter((code: string) => code !== stockCode);
    } else {
      subscribedStocks.push(stockCode);
    }

    // 更新数据库
    await sql`
      UPDATE users 
      SET subscribed_stocks = ${JSON.stringify(subscribedStocks)}
      WHERE email = ${session.user.email}
    `;

    return subscribedStocks;
  } catch (error) {
    console.error('更新订阅失败:', error);
    throw new Error('更新订阅失败');
  }
}
