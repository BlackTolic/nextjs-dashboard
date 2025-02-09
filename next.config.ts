import type { NextConfig } from 'next';
// 确保在配置文件开头加载环境变量
const dotenv = require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});
const nextConfig: NextConfig = {
  /* config options here */
  // 开启Partial Prerendering
  // experimental: {
  //     ppr: 'incremental',
  // },
  // env: {
  //   API_KEY: process.env.API_KEY,
  //   DATABASE_URL: process.env.DATABASE_URL
  // }
};

export default nextConfig;
