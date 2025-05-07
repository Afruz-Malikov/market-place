import { Language } from './Basket';

export interface Order {
  id: string;
  time: string;
  agent: string;
  sum: number;
  paid: number;
  translate: Partial<Record<Language, string>>;
  shipped: number;
}
