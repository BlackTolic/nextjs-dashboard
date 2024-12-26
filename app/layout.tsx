import '@/app/ui/global.css'
import { inter } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
      {/*<body>{children}</body>*/}
      {/*更替google的inter字体*/}
      <body className={`${inter.className} antialiased`}>{children}</body>
      </html>
  );
}
