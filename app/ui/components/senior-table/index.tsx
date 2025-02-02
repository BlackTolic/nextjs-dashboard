'use client';
import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination
} from '@heroui/react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  EllipsisVerticalIcon,
  StarIcon as StarOutline,
  StarIcon as StarSolid
} from '@heroicons/react/24/outline';
import { statusOptions } from './constant';
// import { StockInfo } from '@/app/dashboard/stock-pool/constant';
import { capitalize } from '@/app/lib/utils';

// 定义用户接口
interface User {
  id: number;
  name: string;
  role: string;
  team: string;
  status: string;
  age: string;
  avatar: string;
  email: string;
  [key: string]: string | number;
}

interface IconProps {
  size?: number;
  width?: number;
  height?: number;
  [key: string]: any;
}

// 状态颜色
// type StatusColor = 'success' | 'danger' | 'warning' | 'default' | 'primary' | 'secondary';

// // 定义状态颜色映射
// const statusColorMap: { [key: string]: StatusColor } = {
//   active: 'success',
//   paused: 'danger',
//   vacation: 'warning'
// };

type Key = string | number;
type Selection = 'all' | Set<Key>;

type SortDirection = 'ascending' | 'descending';

interface SortDescriptor {
  column: Key;
  direction: SortDirection;
}

interface Column {
  prop: string;
  label: string;
  sortable: boolean;
}

interface Item {
  [key: string]: string | number;
}

interface PageConfig {
  total: number;
  current: number;
  pageSize: number;
  pageSizes: number[]; // 添加分页选项数组
  service: boolean; // 添加服务端分页标志
}

export interface SeniorTableProps<T> {
  columns: Column[];
  dataSource: T[];
  rowKey: string;
  onRow: (record: T) => { onClick: () => void };
  isOpenSearchFilter: boolean;
  // 默认展示headcolumns
  defaultVisibleColumns?: string[];
  // 分页配置
  pageConfig?: PageConfig;
  onPageChange: (page: number, pageSize: number) => void; // 分页变化回调
  loading?: boolean; // 添加 loading 属性
  subscribed?: string[]; // 已订阅的股票代码列表
  onSubscribe?: (record: T) => void; // 订阅/取消订阅的回调
}

const SeniorTable = <T extends Item>(props: SeniorTableProps<T>) => {
  const {
    columns,
    dataSource,
    rowKey,
    onRow,
    isOpenSearchFilter,
    defaultVisibleColumns,
    pageConfig,
    onPageChange,
    loading,
    subscribed = [], // 默认为空数组
    onSubscribe
  } = props;
  console.log(subscribed, 'subscribed');
  const [filterValue, setFilterValue] = useState('');
  // 选中的行
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  // 可见列
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    !defaultVisibleColumns ? columns.map(x => x.prop) : defaultVisibleColumns
  );
  const [statusFilter, setStatusFilter] = useState<Selection>(new Set([])); // 状态过滤
  // 每页显示行数
  const [rowsPerPage, setRowsPerPage] = useState(50);
  // 排序描述符
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'age',
    direction: 'ascending'
  });
  const [page, setPage] = React.useState(1); // 当前页码
  // 是否开启搜索过滤
  const hasSearchFilter = Boolean(filterValue);
  // 展示自定义列的项
  const headerColumns = useMemo(() => {
    // console.log(visibleColumns, 'visibleColumns');
    return columns.filter(column => visibleColumns.includes(column.prop));
  }, [visibleColumns]);

  // 根据搜索条件和状态过滤用户数据
  const items = useMemo(() => {
    let filteredUsers = [...dataSource];
    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(user => {
        const searchValue = String(user.name).toLowerCase();
        return searchValue.includes(filterValue.toLowerCase());
      });
    }
    if (statusFilter instanceof Set && statusFilter.size > 0) {
      filteredUsers = filteredUsers.filter(user => statusFilter.has(user.status));
    }

    // 前端分页处理
    if (!pageConfig?.service) {
      const start = (page - 1) * (pageConfig?.pageSize || 50);
      const end = start + (pageConfig?.pageSize || 50);
      return filteredUsers.slice(start, end);
    }

    return filteredUsers;
  }, [filterValue, statusFilter, dataSource, pageConfig, page]);

  // const pages = Math.ceil(filteredItems.length / rowsPerPage);
  //
  // const items = useMemo(() => {
  //   const start = (page - 1) * rowsPerPage;
  //   const end = start + rowsPerPage;
  //   console.log(filteredItems, 'filteredItems');
  //   return filteredItems.slice(start, end);
  // }, [page, filteredItems, rowsPerPage]);

  // 排序
  const sortedItems = useMemo(() => {
    return [...items].sort((a: Item, b: Item) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  //渲染单元格内容
  const renderCell = useCallback(
    (item: Item, columnKey: Key) => {
      // console.log(item, columnKey, 'item');
      if (columnKey === 'subscription') {
        const isSubscribed = subscribed.includes(String(item.symbol));
        console.log(subscribed, 'subscribed111');
        return (
          <span key={subscribed ? 'xx' : 'eee'}>
            <button
              onClick={e => {
                e.stopPropagation();
                onSubscribe?.(item as T);
              }}
              className="hover:text-primary-500"
            >
              {isSubscribed ? <StarSolid className="h-5 w-5 text-yellow-400" /> : <StarOutline className="h-5 w-5" />}
            </button>
          </span>
        );
      }
      return item[columnKey];
    },
    [subscribed, onSubscribe]
  );

  React.useEffect(() => {
    console.log('Subscribed list updated:', subscribed);
  }, [subscribed]);

  // const renderCell = (item: Item, columnKey: Key) => {
  //   // console.log(item, columnKey, 'item');
  //   if (columnKey === 'subscription') {
  //     const isSubscribed = subscribed.includes(String(item.symbol));
  //     console.log(subscribed, 'subscribed111');
  //     return (
  //       <span key={subscribed ? 'xx' : 'eee'}>
  //         <button
  //           onClick={e => {
  //             e.stopPropagation();
  //             console.log(subscribed, 'subscribed222');
  //             onSubscribe?.(item as T);
  //           }}
  //           className="hover:text-primary-500"
  //         >
  //           {isSubscribed ? <StarSolid className="h-5 w-5 text-yellow-400" /> : <StarOutline className="h-5 w-5" />}
  //         </button>
  //       </span>
  //     );
  //   }
  //   return item[columnKey];
  // };

  // 每页行数变化处理
  // 特别是当函数作为props传递给子组件时。如果每次渲染都创建新函数，子组件会认为props变化，导致重新渲染，即使实际依赖没有变化。
  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newPageSize = Number(e.target.value);
      setRowsPerPage(newPageSize);
      setPage(1); // 重置内部页码状态
      if (!pageConfig?.service) {
        onPageChange(1, newPageSize); // 前端分页时也通知父组件页码重置
      } else {
        onPageChange(1, newPageSize); // 后端分页时通知父组件
      }
    },
    [onPageChange, pageConfig]
  );

  // 分页变化
  const onPagesChange = useCallback(
    (page: number) => {
      if (pageConfig?.service) {
        onPageChange(page, rowsPerPage);
      } else {
        setPage(page); // 使用内部状态而不是修改 prop
      }
    },
    [onPageChange, rowsPerPage, pageConfig]
  );

  // const onRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) =>{
  //   setRowsPerPage(Number(e.target.value));
  //   setPage(1);
  //   console.log(9999)
  //   changePage && changePage(page,rowsPerPage)
  // }

  // 搜索处理函数
  const onSearchChange = useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  }, []);

  // 清除搜索
  const onClear = useCallback(() => {
    setFilterValue('');
    setPage(1);
  }, []);

  const totalItems = useMemo(() => {
    if (pageConfig?.service) {
      return pageConfig?.total || 0;
    }
    return dataSource.length || 0;
  }, [pageConfig, dataSource]);

  // 表格顶部内容
  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          {/* 搜索框  */}
          {isOpenSearchFilter && (
            <Input
              isClearable
              className="w-full sm:max-w-[44%]"
              classNames={{
                base: 'max-w-full',
                mainWrapper: 'h-full',
                input: 'text-small',
                inputWrapper: 'h-10 bg-default-100 dark:bg-default-50 border-0 hover:bg-default-200',
                clearButton: 'text-default-400 hover:text-default-600'
              }}
              placeholder="搜索股票代码或者名称..."
              size="sm"
              startContent={
                <MagnifyingGlassIcon className="text-default-400 pointer-events-none flex-shrink-0 h-4 w-4" />
              }
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
          )}
          <div className="flex gap-3">
            {/* 自定义列配置 */}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="h-4 w-4" />} variant="flat">
                  自定义列配置
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={keys => {
                  const selectedKeys = Array.from(keys instanceof Set ? keys : new Set()).map(String);
                  setVisibleColumns(selectedKeys);
                }}
              >
                {columns?.map(column => (
                  <DropdownItem key={column.prop} className="capitalize">
                    {capitalize(column.label)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {/* 添加新信息 */}
            <Button color="primary" endContent={<PlusIcon className="h-4 w-4" />}>
              新增
            </Button>
          </div>
        </div>
        {/* 分页 */}
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">总 {totalItems} 条</span>
          <label className="flex items-center text-default-400 text-small">
            每页
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              value={rowsPerPage}
              onChange={onRowsPerPageChange}
            >
              {pageConfig?.pageSizes?.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            条
          </label>
        </div>
      </div>
    );
  }, [filterValue, statusFilter, visibleColumns, onRowsPerPageChange, onSearchChange, hasSearchFilter, pageConfig]);

  // 表格底部内容
  const bottomContent = useMemo(() => {
    if (!pageConfig) return null;
    const pages = Math.ceil((pageConfig.service ? pageConfig.total : dataSource.length) / pageConfig.pageSize);
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys instanceof Set ? `${selectedKeys.size} of ${pageConfig.total} selected` : 'All items selected'}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={pageConfig.current}
          total={pages}
          onChange={onPagesChange}
        />
      </div>
    );
  }, [selectedKeys, pageConfig, onPagesChange]);

  const handleSelectionChange = (keys: Selection) => {
    setSelectedKeys(keys);
  };

  const handleSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
  };

  return (
    <>
      {loading ? (
        <div className="w-full">
          {/* 骨架屏加载效果 */}
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-16 bg-gray-200 rounded mb-2"></div>
            ))}
          </div>
        </div>
      ) : (
        <Table
          isHeaderSticky
          aria-label="Example table with custom cells, pagination and sorting"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={{
            wrapper: 'max-h-[500px]'
          }}
          selectedKeys={selectedKeys}
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={keys => setSelectedKeys(keys)}
          onSortChange={handleSortChange}
        >
          {/* selectionMode="multiple" */}
          <TableHeader columns={[{ prop: 'subscription', label: '我的订阅', sortable: false }, ...headerColumns]}>
            {column => (
              <TableColumn
                key={column.prop}
                align={column.prop === 'actions' ? 'center' : 'start'}
                allowsSorting={column.sortable}
              >
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={'No data found'} items={sortedItems}>
            {item => (
              <TableRow key={item[rowKey]}>
                {columnKey => <TableCell>{renderCell(item, columnKey as Key)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      {JSON.stringify(subscribed, null, 2)}
    </>
  );
};

export default SeniorTable;
