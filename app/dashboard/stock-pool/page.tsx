'use client';

import { lusitana } from '@/app/ui/fonts';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { Suspense } from 'react';
import StockPoolContent from '@/app/dashboard/stock-pool/stock-pool-content';

export default function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl flex items-center gap-2`}>
          <ChartBarIcon className="w-6 h-6" />
          股票池
        </h1>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <StockPoolContent />
      </Suspense>
    </div>
  );
}
