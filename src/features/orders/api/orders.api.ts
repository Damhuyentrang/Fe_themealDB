import apiClient from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../constants/api';
import type { Order, OrderFilters } from '../types/order.types';
import type { PaginatedResponse } from '../../../types/common.types';

export const ordersApi = {
  getList: async (filters: Partial<OrderFilters>): Promise<PaginatedResponse<Order>> => {
    const { data } = await apiClient.get(API_ENDPOINTS.ORDERS.LIST, { params: filters });
    return data;
  },

  getDetail: async (id: string): Promise<Order> => {
    const { data } = await apiClient.get(API_ENDPOINTS.ORDERS.DETAIL(id));
    return data;
  },

  create: async (payload: Partial<Order>): Promise<Order> => {
    const { data } = await apiClient.post(API_ENDPOINTS.ORDERS.CREATE, payload);
    return data;
  },

  update: async (id: string, payload: Partial<Order>): Promise<Order> => {
    const { data } = await apiClient.put(API_ENDPOINTS.ORDERS.UPDATE(id), payload);
    return data;
  },

  exportFile: async (filters: Partial<OrderFilters>): Promise<Blob> => {
    const { data } = await apiClient.get(API_ENDPOINTS.ORDERS.EXPORT, {
      params: filters,
      responseType: 'blob',
    });
    return data;
  },
};
