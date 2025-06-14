'use client';
import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
// import { initializeApp } from './lib/init';

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 初始化应用程序的逻辑，例如设置全局样式、初始化第三方库等
    // initializeApp();
  }, []);

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
