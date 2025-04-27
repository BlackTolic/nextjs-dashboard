import {
  HomeIcon,
  DocumentDuplicateIcon,
  UserGroupIcon,
  ChartBarIcon,
  LightBulbIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

export const links = [
  { name: '首页', href: '/dashboard', icon: HomeIcon },
  { name: '股票池', href: '/dashboard/stock-pool', icon: ChartBarIcon },
  { name: '行业分析', href: '/dashboard/industry-analysis', icon: BuildingOfficeIcon },
  { name: '我的订阅', href: '/dashboard/subscriptions', icon: DocumentDuplicateIcon },
  { name: '投资思考', href: '/dashboard/investment-thoughts', icon: LightBulbIcon }
  // { name: '用户管理', href: '/dashboard/users', icon: UserGroupIcon }
];
