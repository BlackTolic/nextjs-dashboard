'use client';

import clsx from 'clsx';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  baseUrl: string;
  queryParams?: Record<string, string>;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  totalPages,
  currentPage,
  baseUrl,
  queryParams = {},
  onPageChange,
}: PaginationProps) {
  // 生成页码数组，显示当前页附近的页码
  const generatePageNumbers = () => {
    const pages = [];
    const showPages = 5; // 显示的页码数量

    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  // 构建带查询参数的URL
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(queryParams);
    params.set('page', page.toString());
    // return `${baseUrl}?${params.toString()}`;
    return `${baseUrl}`;
  };

  const pages = generatePageNumbers();

  return (
    <div className="inline-flex">
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        className={clsx('flex items-center justify-center px-3 py-2 border rounded-l-md', {
          'text-gray-300 cursor-not-allowed': currentPage <= 1,
          'hover:bg-gray-50': currentPage > 1,
        })}
        aria-disabled={currentPage <= 1}
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => page !== currentPage && onPageChange(page)}
          className={clsx('flex items-center justify-center px-3 py-2 border-t border-b', {
            'bg-blue-50 text-blue-600 border-blue-600': page === currentPage,
            'hover:bg-gray-50': page !== currentPage,
          })}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        className={clsx('flex items-center justify-center px-3 py-2 border rounded-r-md', {
          'text-gray-300 cursor-not-allowed': currentPage >= totalPages,
          'hover:bg-gray-50': currentPage < totalPages,
        })}
        aria-disabled={currentPage >= totalPages}
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
