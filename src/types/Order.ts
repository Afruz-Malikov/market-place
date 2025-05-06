export interface Order {
  id: string;
  time: string;
  agent: string;
  sum: number;
  paid: number;
  translate: {
    kr: string;
    en: string;
    ru: string;
  };
  shipped: number;
}
