export interface PromotionLink {
  name: string;
  link: string;
}

export interface PromotionInfo {
  title: string;
  desc: string;
  link: PromotionLink;
}

export interface Promotion {
  img: string;
  info: PromotionInfo;
  en: { info: PromotionInfo };
  kr: { info: PromotionInfo };
  ru: { info: PromotionInfo };
}

export interface ShopStatus {
  value: string;
  label: string;
}

export interface CounterpartyInfo {
  id: string;
  name: string;
  pricetype: string;
}

export interface Shop {
  id: string;
  status: ShopStatus;
  main_sale: number;
  store: number;
  folders: number[];
  counterparty: number;
  show_price: 'yes' | 'no';
  counterparty_info: CounterpartyInfo;
  shop_id: number;
  promotion: Promotion;
}
