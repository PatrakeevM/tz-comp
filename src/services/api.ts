import axios from 'axios';
import type { IProductsResponse } from '../types/product';
import type { IOrderRequest, IOrderResponse } from '../types/order';
import type { IReview } from '../types/review';

// Используем прокси через Vite вместо прямого обращения к API
const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProducts = async (page = 1, pageSize = 20): Promise<IProductsResponse> => {
  const response = await api.get<IProductsResponse>('/products', {
    params: {
      page,
      page_size: pageSize,
    },
  });
  
  return response.data;
};

export const getReviews = async (): Promise<IReview[]> => {
  const response = await api.get<IReview[]>('/reviews');
  return response.data;
};

export const sendOrder = async (orderData: IOrderRequest): Promise<IOrderResponse> => {
  const response = await api.post<IOrderResponse>('/order', orderData);
  return response.data;
}; 