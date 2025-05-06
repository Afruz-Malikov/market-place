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
  id: string;
  quantity: string;
}

// export interface BasketProductDetails {
//   id?: string;
//   name: string;
//   updated: string;
//   product_code: string;
//   product_type: string;
//   categ_id: number;
//   price: PriceItem[];
//   uom: string;
//   count_in_pc: string;
//   product_id: number;
//   quantity: string;
// }

// export interface PriceItem {
//   id: string;
//   p: string;
// }
