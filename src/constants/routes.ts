export const ROUTES = {
  // Auth
  LOGIN: '/login',

  // Dashboard
  DASHBOARD: '/',

  // Orders
  ORDERS: '/orders',
  ORDERS_DRAFT: '/orders/draft',
  ORDERS_RETURNS: '/orders/returns',
  ORDERS_INCOMPLETE: '/orders/incomplete',
  ORDERS_INCOMPLETE_DETAIL: '/orders/incomplete/:id',
  ORDER_DETAIL: '/orders/:id',
  ORDER_CREATE: '/orders/create',
  ORDER_RETURN: '/orders/:id/return',

  // Products
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  PRODUCT_CREATE: '/products/create',
  PRODUCT_CATEGORIES: '/products/categories',
  PRICE_LISTS: '/products/price-lists',

  // Inventory
  INVENTORY: '/inventory',
  PURCHASE_ORDERS: '/inventory/purchase-orders',
  PURCHASE_ORDER_CREATE: '/inventory/purchase-orders/create',
  PURCHASE_ORDER_DETAIL: '/inventory/purchase-orders/:id',

  // Customers
  CUSTOMERS: '/customers',
  CUSTOMER_DETAIL: '/customers/:id',
  CUSTOMER_GROUPS: '/customers/groups',

  // Shipping
  SHIPPING: '/shipping',
  SHIPPING_WAYBILLS: '/shipping/waybills',

  // Promotions
  PROMOTIONS: '/promotions',

  // Reports
  REPORTS: '/reports',
  REPORTS_LIST: '/reports/list',
  REPORT_REVENUE: '/reports/revenue-time',

  // Affiliate
  AFFILIATE: '/affiliate',
  AFFILIATE_MEMBERS: '/affiliate/members',
  AFFILIATE_COMMISSIONS: '/affiliate/commissions',
  AFFILIATE_LINKS: '/affiliate/links',
  AFFILIATE_POLICIES: '/affiliate/policies',

  // Settings
  SETTINGS: '/settings',
} as const;
