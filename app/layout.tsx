import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
// import { initializeApp } from './lib/init';
import { Toaster } from 'react-hot-toast';
import './lib/init/index';

// todo 每次跳转地址，这里都会执行一次
// if (typeof window === 'undefined') {
//   console.log('应用初始化');
//   initializeApp();
// }

export const metadata: Metadata = {
  title: {
    // 支持template语法
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard'
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh')
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Any metadata in layout.js will be inherited by all pages that use it.
    <html lang="en">
      {/*<body>{children}</body>*/}
      {/*更替google的inter字体*/}
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
