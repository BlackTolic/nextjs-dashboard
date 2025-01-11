import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';
import { readFileSync } from 'fs';
import { join } from 'path';

// 连接数据库
const client = await db.connect();

// 创建并填充用户表
async function seedUsers() {
  // 启用 UUID 扩展
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  
  // 创建用户表，包含 id、姓名、邮箱和密码字段
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  // 并行插入所有用户数据
  // 对每个用户的密码进行哈希处理后存储
  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

// 创建并填充发票表
async function seedInvoices() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  // 创建发票表，包含 id、客户id、金额、状态和日期字段
  await client.sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  // 并行插入所有发票数据
  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => client.sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

// 创建并填充客户表
async function seedCustomers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  // 创建客户表，包含 id、姓名、邮箱和头像URL字段
  await client.sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  // 并行插入所有客户数据
  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => client.sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

// 创建并填充收入表
async function seedRevenue() {
  // 创建收入表，包含月份和收入金额字段
  await client.sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  // 并行插入所有收入数据
  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => client.sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

// 新增执行 schema.sql 的函数
async function executeSchemaSql() {
  try {
    const schemaPath = join(process.cwd(), 'app/lib/db/stock/schema.sql');
    const schemaSql = readFileSync(schemaPath, 'utf8');
    
    // 分割 SQL 语句（假设语句以分号结尾）
    const statements = schemaSql
      .split(';')
      .filter(statement => statement.trim().length > 0);
    
    // 执行每个 SQL 语句
    for (const statement of statements) {
      if (statement.trim()) {
        // 使用 query 方法直接执行 SQL 语句
        await client.query(statement);
      }
    }
    
    console.log('Schema SQL 执行成功');
  } catch (error) {
    console.error('执行 Schema SQL 时出错:', error);
    throw error;
  }
}

// API路由处理函数
export async function GET() {
  try {
    await client.sql`BEGIN`;
    
    // 首先执行 schema.sql
    await executeSchemaSql();
    
    // 然后执行其他数据填充操作
    await seedUsers();
    await seedCustomers();
    await seedInvoices();
    await seedRevenue();
    
    await client.sql`COMMIT`;

    return Response.json({ message: '数据库初始化和填充成功' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
