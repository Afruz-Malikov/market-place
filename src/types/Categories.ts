export interface Folder {
  id: number;
  pid: number;
  name: string;
  product_count: number;
  children?: Folder[];
}
