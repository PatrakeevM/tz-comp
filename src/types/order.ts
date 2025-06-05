export interface ICartItem {
  id: number;
  quantity: number;
}

export interface IOrderRequest {
  phone: string;
  cart: ICartItem[];
}

export interface IOrderResponse {
  success: number;
  error?: string;
} 