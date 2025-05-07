import { ProductPrice } from './Product';
export type Language = 'ru' | 'en' | 'kr' | 'uz' | 'vi';
export interface ChangeBasketProduct {
  id: string;
  quantity: string;
}
export interface BasketResponse {
  message: string;
  cart: {
    id: string;
  };
  folders: BasketFolder[];
}

export interface BasketFolder {
  id: number;
  name: string;
  products: BasketProduct[];
}

export interface BasketProduct {
  price: ProductPrice[];
  id: string;
  name: string;
  updated: string;
  product_type: 'product' | 'bundle';
  categ_id: number;
  quantity: string;
  product_code: string;
  uom: string;
  ava?: string;
  bundle: number;
  translate: Partial<Record<Language, string>>;
  product_id: number;
  quantity_in_cart: string;
}
