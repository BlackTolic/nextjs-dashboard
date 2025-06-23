import ClientRootLayout from './client-layout';
import { Metadata } from 'next';
import { initializeApp } from './lib/init';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard'
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh')
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  console.log('metadata', 66666666);
  initializeApp();
  return <ClientRootLayout>{children}</ClientRootLayout>;
}
