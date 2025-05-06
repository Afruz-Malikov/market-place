export interface Folder {
  id: number;
  pid: number;
  name: string;
  product_count: number;
  translate: {
    kr: string;
    en: string;
    ru: string;
  };
  children?: Folder[];
}
