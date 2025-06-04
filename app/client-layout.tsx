'use client';
import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { initializeApp } from './lib/init';

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeApp();
    console.log('应用初始111333111');
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
