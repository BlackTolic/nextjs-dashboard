import Pagination from "@/app/ui/invoices/pagination";
import Search from "@/app/ui/search";
import Table from "@/app/ui/invoices/table";
import { CreateInvoice } from "@/app/ui/invoices/buttons";
import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { fetchInvoicesPages } from "@/app/lib/data";

import { Metadata } from "next";
// 嵌套页面中的元数据会覆盖父页面的元数据。
export const metadata: Metadata = {
  title: "Invoices", // 页面标题
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string; // 搜索查询参数
    page?: string; // 当前页码参数
  }>;
}) {
  // 解析搜索参数
  const searchParams = await props.searchParams;
  const query = searchParams?.query || ""; // 获取查询字符串，默认为空
  const currentPage = Number(searchParams?.page) || 1; // 获取当前页码，默认为1
  const totalPages = await fetchInvoicesPages(query); // 获取总页数

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>{" "}
        {/* 页面标题 */}
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." /> {/* 搜索框 */}
        <CreateInvoice /> {/* 创建发票按钮 */}
      </div>
      {/* 使用Suspense实现懒加载，key用于在查询或页码变化时重新渲染 */}
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} /> {/* 发票表格 */}
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} /> {/* 分页组件 */}
      </div>
      {totalPages} {/* 显示总页数 */}
    </div>
  );
}
