import { Language } from './Basket';

export interface ProductPrice {
  id: string;
  p: string;
}

export interface Product {
  id: string;
  name: string;
  updated: string;
  product_code: string;
  product_type: 'bundle' | 'product';
  categ_id: number;
  price: ProductPrice[];
  uom: string;
  count_in_pc: string;
  product_id: number;
  quantity: string;
  ava?: string;
  translate: Partial<Record<Language, string>>;
}

export interface Category {
  id: number;
  pid: number;
  name: string;
  ms_id: string;
  translate: Partial<Record<Language, string>>;
  products: Product[];
  children?: Category[];
}
