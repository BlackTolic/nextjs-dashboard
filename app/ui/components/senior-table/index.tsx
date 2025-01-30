'use client';
import React, { useCallback, useMemo, useState } from 'react';
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
  EllipsisVerticalIcon
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
type StatusColor = 'success' | 'danger' | 'warning' | 'default' | 'primary' | 'secondary';

// 定义状态颜色映射
const statusColorMap: { [key: string]: StatusColor } = {
  active: 'success',
  paused: 'danger',
  vacation: 'warning'
};

// 默认显示的列
const INITIAL_VISIBLE_COLUMNS = ['name', 'role', 'status', 'actions'];

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

interface PageConfig{
  currentPage:string;
  pageSize:string;
  currentPageSize:string;
}

export interface SeniorTableProps<T> {
  columns: Column[];
  dataSource: T[];
  rowKey: string;
  onRow: (record: T) => { onClick: () => void };
  operations: {
    key: string;
    label: (record: T) => string;
    onClick: (record: T) => void;
  }[];
  isOpenSearchFilter: boolean;
  // 默认展示headcolumns
  defaultVisibleColumns?: string[];
  // 分页配置
  pageConfig?:PageConfig;
  changePage?:() => void
}

const SeniorTable = <T extends Item>(props: SeniorTableProps<T>) => {
  const {
    columns,
    dataSource,
    rowKey,
    onRow,
    operations,
    isOpenSearchFilter,
    defaultVisibleColumns
  } = props;
  // 状态管理
  const [filterValue, setFilterValue] = useState(''); // 搜索过滤值
  // 选中的行
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  // 可见列
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    !defaultVisibleColumns ? columns.map(x => x.prop) : defaultVisibleColumns
  );
  const [statusFilter, setStatusFilter] = useState<Selection>(new Set([])); // 状态过滤
  // 每页显示行数
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'age',
    direction: 'ascending'
  }); // 排序描述符
  const [page, setPage] = React.useState(1); // 当前页码
  // 是否开启搜索过滤
  const hasSearchFilter = Boolean(filterValue);

  // 展示自定义列的项
  const headerColumns = useMemo(() => {
    // console.log(visibleColumns, 'visibleColumns');
    return columns.filter(column => visibleColumns.includes(column.prop));
  }, [visibleColumns]);

  // 根据搜索条件和状态过滤用户数据
  const filteredItems = useMemo(() => {
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
    return filteredUsers;
  }, [filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  //
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

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
  const renderCell = useCallback((item: Item, columnKey: Key) => {
    const cellValue = item[columnKey];

    // 简化处理，直接返回单元格值
    return cellValue;
  }, []);

  // 分页控制函数
  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  // 每页行数变化处理
  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

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
                inputWrapper:
                  'h-10 bg-default-100 dark:bg-default-50 border-0 hover:bg-default-200',
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
            {/* 状态栏配置 */}
            {/* <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="h-4 w-4" />} variant="flat">
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={keys => {
                  setStatusFilter(keys instanceof Set ? keys : new Set());
                }}
              >
                {statusOptions.map(status => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown> */}
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
                  const selectedKeys = Array.from(keys instanceof Set ? keys : new Set()).map(
                    String
                  );
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
          <span className="text-default-400 text-small">Total {100} users</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">50</option>
              <option value="10">100</option>
              <option value="15">200</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    onSearchChange,
    hasSearchFilter
  ]);

  // 表格底部内容
  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys instanceof Set
            ? `${selectedKeys.size} of ${filteredItems.length} selected`
            : 'All items selected'}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        {/* <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div> */}
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const handleSelectionChange = (keys: Selection) => {
    setSelectedKeys(keys);
  };

  const handleSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
  };

  return (
    <Table
      isHeaderSticky
      aria-label="Example table with custom cells, pagination and sorting"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: 'max-h-[500px]'
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={keys => setSelectedKeys(keys)}
      onSortChange={handleSortChange}
    >
      <TableHeader columns={headerColumns}>
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
  );
};

export default SeniorTable;
