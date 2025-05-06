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
    baseUrl: 'https://dev-api.flin.uz/api/NmMfS55',
  }),
  endpoints: (builder) => ({
    getAllOrders: builder.query<getAllOrdersResponse, void>({
      query: () => '/products',
    }),
    getUserBasket: builder.query<BasketResponse, void>({
      query: () => '/cart',
    }),
    getShopInfo: builder.query<ShopResponse, void>({
      query: () => '/shop',
    }),
    getFolders: builder.query<FoldersResponse, void>({
      query: () => '/folders',
    }),
    getUserOrders: builder.query<OrdersResponse, void>({
      query: () => 'https://dev-api.flin.uz/api/L7zoPFw/orders?limit=20',
    }),
    getNewProducts: builder.query<getNewOrderResponse, void>({
      query: () => '/new-products',
    }),
    searchProducts: builder.query<SearchFilterResponse, string>({
      query: (searchTerm) => `/search?s=${encodeURIComponent(searchTerm)}`,
    }),
    changeBasket: builder.mutation<
      changeBasketResponse,
      { products: ChangeBasketProduct[] }
    >({
      query: (body) => ({
        url: '/cart',
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'text/plain',
        },
      }),
    }),
    createOrder: builder.mutation<
      createOrderResponse,
      { products: ChangeBasketProduct[] }
    >({
      query: (body) => ({
        url: '/order/create',
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'text/plain',
        },
      }),
    }),
    createFeedback: builder.mutation<
      createFeedbackResponse,
      { phone: string; email: string; message: string }
    >({
      query: (body) => ({
        url: '/feedback/create',
        method: 'POST',
        body: JSON.stringify(body),
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
