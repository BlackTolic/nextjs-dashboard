import { Revenue } from "./definitions";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
/**
 * 格式化金额为美元格式
 * @param amount 金额（以分为单位）
 * @returns 格式化后的金额字符串
 */
export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

/**
 * 格式化日期字符串为本地化日期格式
 * @param dateStr 日期字符串
 * @param locale 本地化语言代码，默认为 'en-US'
 * @returns 格式化后的日期字符串
 */
export const formatDateToLocal = (
  dateStr: string,
  locale: string = "en-US",
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

/**
 * 生成 Y 轴标签
 * @param revenue 收入数据数组
 * @returns 包含 Y 轴标签和最高标签值的对象
 */
export const generateYAxis = (revenue: Revenue[]) => {
  // 计算 Y 轴需要显示的标签
  // 基于最高记录并以千为单位
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

/**
 * 生成分页数组
 * @param currentPage 当前页码
 * @param totalPages 总页数
 * @returns 分页数组，可能包含省略号
 */
export const generatePagination = (currentPage: number, totalPages: number) => {
  // 如果总页数小于等于 7，显示所有页码，不显示省略号
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // 如果当前页在前 3 页，显示前 3 页、省略号和最后 2 页
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // 如果当前页在最后 3 页，显示前 2 页、省略号和最后 3 页
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // 如果当前页在中间，显示第 1 页、省略号、当前页及其相邻页、省略号和最后一页
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}