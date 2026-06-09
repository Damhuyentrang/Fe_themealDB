import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import MainLayout from '../layouts/MainLayout';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import PortalLayout from '../features/portal/layouts/PortalLayout';
import PortalLoginPage from '../features/portal/pages/PortalLoginPage';
import PortalDashboardPage from '../features/portal/pages/PortalDashboardPage';
import PortalLinksPage from '../features/portal/pages/PortalLinksPage';
import PortalCommissionsPage from '../features/portal/pages/PortalCommissionsPage';
import OrderListPage from '../features/orders/pages/OrderListPage';
import CreateOrderPage from '../features/orders/pages/CreateOrderPage';
import ProductListPage from '../features/products/pages/ProductListPage';
import CreateProductPage from '../features/products/pages/CreateProductPage';
import ProductCategoriesPage from '../features/products/pages/ProductCategoriesPage';
import CreateCategoryPage from '../features/products/pages/CreateCategoryPage';
import DraftOrderListPage from '../features/orders/pages/DraftOrderListPage';
import ReportOverviewPage from '../features/reports/pages/ReportOverviewPage';
import OrderDetailPage from '../features/orders/pages/OrderDetailPage';
import CreateReturnOrderPage from '../features/orders/pages/CreateReturnOrderPage';
import ReturnListPage from '../features/orders/pages/ReturnListPage';
import IncompleteOrderListPage from '../features/orders/pages/IncompleteOrderListPage';
import IncompleteOrderDetailPage from '../features/orders/pages/IncompleteOrderDetailPage';
import InventoryPage from '../features/inventory/pages/InventoryPage';
import PurchaseOrderListPage from '../features/inventory/pages/PurchaseOrderListPage';
import CreatePurchaseOrderPage from '../features/inventory/pages/CreatePurchaseOrderPage';
import SupplierListPage from '../features/inventory/pages/SupplierListPage';
import CreateSupplierPage from '../features/inventory/pages/CreateSupplierPage';
import PurchaseReturnListPage from '../features/inventory/pages/PurchaseReturnListPage';
import PromotionsPage from '../features/promotions/pages/PromotionsPage';
import CustomerListPage from '../features/customers/pages/CustomerListPage';
import ShippingOverviewPage from '../features/shipping/pages/ShippingOverviewPage';
import ReportsListPage from '../features/reports/pages/ReportsListPage';
import RevenueReportPage from '../features/reports/pages/RevenueReportPage';
import SettingsPage from '../features/settings/pages/SettingsPage';
import AffiliateOverviewPage from '../features/affiliate/pages/AffiliateOverviewPage';
import AffiliateMembersPage from '../features/affiliate/pages/AffiliateMembersPage';
import AffiliateCommissionsPage from '../features/affiliate/pages/AffiliateCommissionsPage';
import AffiliateLinksPage from '../features/affiliate/pages/AffiliateLinksPage';
import AffiliatePoliciesPage from '../features/affiliate/pages/AffiliatePoliciesPage';
import CreateAffiliateMemberPage from '../features/affiliate/pages/CreateAffiliateMemberPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },

      // Orders
      { path: ROUTES.ORDERS, element: <OrderListPage /> },
      { path: ROUTES.ORDER_CREATE, element: <CreateOrderPage /> },
      { path: ROUTES.ORDER_DETAIL, element: <OrderDetailPage /> },
      { path: ROUTES.ORDER_RETURN, element: <CreateReturnOrderPage /> },
      { path: ROUTES.ORDERS_DRAFT, element: <DraftOrderListPage /> },
      { path: ROUTES.ORDERS_RETURNS, element: <ReturnListPage /> },
      { path: ROUTES.ORDERS_INCOMPLETE, element: <IncompleteOrderListPage /> },
      { path: ROUTES.ORDERS_INCOMPLETE_DETAIL, element: <IncompleteOrderDetailPage /> },

      // Products
      { path: ROUTES.PRODUCTS, element: <ProductListPage /> },
      { path: ROUTES.PRODUCT_CREATE, element: <CreateProductPage /> },
      { path: ROUTES.PRODUCT_CATEGORIES, element: <ProductCategoriesPage /> },
      { path: '/products/categories/create', element: <CreateCategoryPage /> },
      {
        path: ROUTES.PRICE_LISTS,
        element: <div className="p-4 text-gray-500">Bảng giá — coming soon</div>,
      },
      { path: ROUTES.CUSTOMERS,       element: <CustomerListPage /> },
      { path: ROUTES.CUSTOMER_GROUPS, element: <div className="p-4 text-gray-500">Nhóm khách hàng — coming soon</div> },
      { path: ROUTES.INVENTORY, element: <InventoryPage /> },
      { path: ROUTES.PURCHASE_ORDERS, element: <PurchaseOrderListPage /> },
      { path: ROUTES.PURCHASE_ORDER_CREATE, element: <CreatePurchaseOrderPage /> },
      { path: ROUTES.PURCHASE_ORDER_DETAIL, element: <div className="p-4 text-gray-500">Chi tiết đơn nhập hàng — coming soon</div> },
      { path: '/inventory/return-orders', element: <PurchaseReturnListPage /> },
      { path: '/inventory/suppliers', element: <SupplierListPage /> },
      { path: '/inventory/suppliers/create', element: <CreateSupplierPage /> },
      { path: '/inventory/suppliers/:id', element: <div className="p-4 text-gray-500">Chi tiết nhà cung cấp — coming soon</div> },
      { path: ROUTES.SHIPPING,         element: <ShippingOverviewPage /> },
      { path: ROUTES.SHIPPING_WAYBILLS, element: <div className="p-4 text-gray-500">Vận đơn — coming soon</div> },
      { path: ROUTES.PROMOTIONS, element: <PromotionsPage /> },
      { path: ROUTES.REPORTS,        element: <ReportOverviewPage /> },
      { path: ROUTES.REPORTS_LIST,   element: <ReportsListPage /> },
      { path: ROUTES.REPORT_REVENUE, element: <RevenueReportPage /> },
      { path: ROUTES.SETTINGS, element: <SettingsPage /> },

      // Affiliate
      { path: ROUTES.AFFILIATE,             element: <AffiliateOverviewPage /> },
      { path: ROUTES.AFFILIATE_MEMBERS,                   element: <AffiliateMembersPage /> },
      { path: `${ROUTES.AFFILIATE_MEMBERS}/create`,       element: <CreateAffiliateMemberPage /> },
      { path: ROUTES.AFFILIATE_COMMISSIONS, element: <AffiliateCommissionsPage /> },
      { path: ROUTES.AFFILIATE_LINKS,       element: <AffiliateLinksPage /> },
      { path: ROUTES.AFFILIATE_POLICIES,    element: <AffiliatePoliciesPage /> },
    ],
  },

  // Affiliate Portal — separate layout, no MainLayout
  {
    path: '/portal',
    children: [
      { index: true, element: <Navigate to="/portal/login" replace /> },
      { path: 'login', element: <PortalLoginPage /> },
      {
        element: <PortalLayout />,
        children: [
          { path: 'dashboard',   element: <PortalDashboardPage /> },
          { path: 'links',       element: <PortalLinksPage /> },
          { path: 'commissions', element: <PortalCommissionsPage /> },
        ],
      },
    ],
  },
]);
