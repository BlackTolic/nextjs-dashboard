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
  Pagination,
} from '@heroui/react';
import { statusOptions } from './constant';
// import { StockInfo } from '@/app/dashboard/stock-pool/constant';

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

// 首字母大写的工具函数
export function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';
}

interface IconProps {
  size?: number;
  width?: number;
  height?: number;
  [key: string]: any;
}

// 加号图标
export const PlusIcon = ({ size = 24, width, height, ...props }: IconProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size || height}
      role="presentation"
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      >
        <path d="M6 12h12" />
        <path d="M12 18V6" />
      </g>
    </svg>
  );
};

// 垂直点图标
export const VerticalDotsIcon = ({ size = 24, width, height, ...props }: IconProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size || height}
      role="presentation"
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        fill="currentColor"
      />
    </svg>
  );
};

// 搜索图标
export const SearchIcon = (props: IconProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

// 向下箭头图标
export const ChevronDownIcon = ({ strokeWidth = 1.5, ...otherProps }) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...otherProps}
    >
      <path
        d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

// 状态颜色
type StatusColor = 'success' | 'danger' | 'warning' | 'default' | 'primary' | 'secondary';

// 定义状态颜色映射
const statusColorMap: { [key: string]: StatusColor } = {
  active: 'success',
  paused: 'danger',
  vacation: 'warning',
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

export interface SeniorTableProps<T = any> {
  columns: Column[];
  dataSource: T[];
  rowKey: string;
  onRow: (record: T) => { onClick: () => void };
  operations: {
    key: string;
    label: (record: T) => string;
    onClick: (record: T) => void;
  }[];
}

const SeniorTable = <T extends Item>(props: SeniorTableProps<T>) => {
  const { columns, dataSource, rowKey, onRow, operations } = props;
  console.log(columns, 'columns');
  // 状态管理
  const [filterValue, setFilterValue] = useState(''); // 搜索过滤值
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([])); // 选中的行
  const [visibleColumns, setVisibleColumns] = useState<string[]>(INITIAL_VISIBLE_COLUMNS); // 可见列
  const [statusFilter, setStatusFilter] = useState<Selection>(new Set([])); // 状态过滤
  const [rowsPerPage, setRowsPerPage] = useState(5); // 每页显示行数
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'age',
    direction: 'ascending',
  }); // 排序描述符
  const [page, setPage] = React.useState(1); // 当前页码
  // 是否开启搜索过滤
  const hasSearchFilter = Boolean(filterValue);
  //
  const headerColumns = useMemo(() => {
    return columns.filter((column) => visibleColumns.includes(column.prop));
  }, [visibleColumns]);

  // 根据搜索条件和状态过滤用户数据
  const filteredItems = useMemo(() => {
    let filteredUsers = [...dataSource];
    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (statusFilter instanceof Set && statusFilter.size > 0) {
      filteredUsers = filteredUsers.filter((user) => statusFilter.has(user.status));
    }
    return filteredUsers;
  }, [filterValue, statusFilter]);
  const pages = Math.ceil(filteredItems.length / rowsPerPage);
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
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="搜索股票代码或者名称..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            {/* 状态栏配置 */}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={(keys) => {
                  setStatusFilter(keys instanceof Set ? keys : new Set());
                }}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {/* 自定义列配置 */}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={new Set(visibleColumns)}
                selectionMode="multiple"
                onSelectionChange={(keys) => {
                  const selectedKeys = Array.from(keys instanceof Set ? keys : new Set()).map(
                    String
                  );
                  setVisibleColumns(selectedKeys);
                }}
              >
                {columns?.map((column) => (
                  <DropdownItem key={column.prop} className="capitalize">
                    {capitalize(column.label)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {/* 添加新信息 */}
            <Button color="primary" endContent={<PlusIcon />}>
              Add New
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
    hasSearchFilter,
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
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
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
        wrapper: 'max-h-[382px]',
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={(keys) => {
        setSelectedKeys(keys instanceof Set ? keys : new Set());
      }}
      onSortChange={handleSortChange}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
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
        {(item) => (
          <TableRow key={item[rowKey]}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey as Key)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default SeniorTable;
