import { ROUTES } from '../../../constants/routes';

export interface NavItem {
  label: string;
  path?: string;
  icon?: string;
  children?: NavItem[];
}

export interface NavGroup {
  groupLabel?: string;
  items: NavItem[];
}

export const NAV_CONFIG: NavGroup[] = [
  {
    items: [
      { label: 'Tổng quan', path: ROUTES.DASHBOARD, icon: 'grid' },
      {
        label: 'Đơn hàng',
        icon: 'shopping-cart',
        children: [
          { label: 'Danh sách đơn hàng', path: ROUTES.ORDERS },
          { label: 'Đơn hàng nháp', path: ROUTES.ORDERS_DRAFT },
          { label: 'Trả hàng', path: ROUTES.ORDERS_RETURNS },
          { label: 'Đơn chưa hoàn tất', path: ROUTES.ORDERS_INCOMPLETE },
        ],
      },
      {
        label: 'Vận chuyển',
        icon: 'truck',
        children: [
          { label: 'Tổng quan', path: ROUTES.SHIPPING },
          { label: 'Vận đơn',   path: ROUTES.SHIPPING_WAYBILLS },
        ],
      },
      {
        label: 'Sản phẩm',
        icon: 'box',
        children: [
          { label: 'Danh sách sản phẩm', path: ROUTES.PRODUCTS },
          { label: 'Danh mục sản phẩm', path: ROUTES.PRODUCT_CATEGORIES },
          { label: 'Bảng giá', path: ROUTES.PRICE_LISTS },
        ],
      },
      {
        label: 'Quản lý kho',
        icon: 'warehouse',
        children: [
          { label: 'Tồn kho',        path: ROUTES.INVENTORY },
          { label: 'Nhập hàng',      path: ROUTES.PURCHASE_ORDERS },
          { label: 'Trả hàng nhập',  path: '/inventory/return-orders' },
          
               { label: 'Nhà cung cấp',   path: '/inventory/suppliers' },
        ],
      },
      {
        label: 'Khách hàng',
        icon: 'users',
        children: [
          { label: 'Khách hàng', path: ROUTES.CUSTOMERS },
          { label: 'Nhóm khách hàng', path: ROUTES.CUSTOMER_GROUPS },
        ],
      },
      { label: 'Khuyến mại', path: ROUTES.PROMOTIONS, icon: 'tag' },
      {
        label: 'Báo cáo',
        icon: 'bar-chart',
        children: [
          { label: 'Tổng quan báo cáo', path: ROUTES.REPORTS },
          { label: 'Danh sách báo cáo', path: ROUTES.REPORTS_LIST },
        ],
      },
    ],
  },
  {
    groupLabel: 'Kênh bán hàng',
    items: [
      { label: 'Website', icon: 'globe' },
      { label: 'Facebook', icon: 'facebook' },
      { label: 'Shopee', icon: 'external-link' },
      { label: 'TikTok Shop', icon: 'external-link' },
      {
        label: 'Affiliate',
        icon: 'users',
        path: ROUTES.AFFILIATE,
        children: [
          { label: 'Tổng quan',         path: ROUTES.AFFILIATE },
          { label: 'Cộng tác viên',     path: ROUTES.AFFILIATE_MEMBERS },
          { label: 'Hoa hồng',          path: ROUTES.AFFILIATE_COMMISSIONS },
          { label: 'Link giới thiệu',   path: ROUTES.AFFILIATE_LINKS },
          { label: 'Chính sách',        path: ROUTES.AFFILIATE_POLICIES },
        ],
      },
    ],
  },
  {
    groupLabel: 'Ứng dụng',
    items: [
      { label: 'Cấu hình', path: ROUTES.SETTINGS, icon: 'settings' },
    ],
  },
];
