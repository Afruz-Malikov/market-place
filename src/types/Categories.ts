import { Language } from './Basket';

export interface Folder {
  id: number;
  pid: number;
  name: string;
  product_count: number;
  translate: Partial<Record<Language, string>>;
  children?: Folder[];
}
