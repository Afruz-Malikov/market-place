import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Category, Product } from '../../types/Product';
import { BasketResponse, ChangeBasketProduct } from '../../types/Basket';
import { Folder } from '../../types/Categories';
import { Shop } from '../../types/Shop';
import { Order } from '../../types/Order';

interface getAllOrdersResponse {
  message: string;
  products: Category[];
}
interface getNewOrderResponse {
  message: string;
  products: Product[];
}
export interface FoldersResponse {
  message: string;
  folders: Folder[];
}
interface changeBasketResponse {
  message: string;
  cart: ChangeBasketProduct[];
}
interface createOrderResponse {
  message: string;
  order_name: string;
  order_sum: number;
}
interface createFeedbackResponse {
  message: string;
  feedback_id: number;
}
interface ShopResponse {
  message: string;
  shop: Shop;
}
interface OrdersResponse {
  message: string;
  orders: Order[];
}
interface SearchFilterResponse {
  message: string;
  folders?: Category[];
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dev-api.flin.uz/api/',
  }),
  endpoints: (builder) => ({
    getAllOrders: builder.query<getAllOrdersResponse, string>({
      query: (shopId) => `${shopId}/products`,
    }),
    getUserBasket: builder.query<BasketResponse, string>({
      query: (shopId) => `${shopId}/cart`,
    }),
    getShopInfo: builder.query<ShopResponse, string>({
      query: (shopId) => `${shopId}/shop`,
    }),
    getFolders: builder.query<FoldersResponse, string>({
      query: (shopId) => `${shopId}/folders`,
    }),
    getUserOrders: builder.query<OrdersResponse, string>({
      query: (shopId) => `${shopId}/orders?limit=20`,
    }),
    getNewProducts: builder.query<getNewOrderResponse, string>({
      query: (shopId) => `${shopId}/new-products`,
    }),
    searchProducts: builder.query<
      SearchFilterResponse,
      { shopId: string; searchTerm: string }
    >({
      query: ({ shopId, searchTerm }) =>
        `${shopId}/search?s=${encodeURIComponent(searchTerm)}`,
    }),
    changeBasket: builder.mutation<
      changeBasketResponse,
      { shopId: string; products: ChangeBasketProduct[] }
    >({
      query: ({ shopId, products }) => ({
        url: `${shopId}/cart`,
        method: 'POST',
        body: JSON.stringify({ products }),
        headers: {
          'Content-Type': 'text/plain',
        },
      }),
    }),
    createOrder: builder.mutation<
      createOrderResponse,
      { shopId: string; products: ChangeBasketProduct[] }
    >({
      query: ({ shopId, products }) => ({
        url: `${shopId}/order/create`,
        method: 'POST',
        body: JSON.stringify({ products }),
        headers: {
          'Content-Type': 'text/plain',
        },
      }),
    }),
    createFeedback: builder.mutation<
      createFeedbackResponse,
      { shopId: string; phone: string; email: string; message: string }
    >({
      query: ({ shopId, ...rest }) => ({
        url: `${shopId}/feedback/create`,
        method: 'POST',
        body: JSON.stringify(rest),
        headers: {
          'Content-Type': 'text/plain',
        },
      }),
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useChangeBasketMutation,
  useGetUserBasketQuery,
  useGetFoldersQuery,
  useCreateOrderMutation,
  useCreateFeedbackMutation,
  useGetShopInfoQuery,
  useGetUserOrdersQuery,
  useSearchProductsQuery,
  useGetNewProductsQuery,
} = api;
