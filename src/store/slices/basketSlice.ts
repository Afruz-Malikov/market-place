import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Language } from '../../types/Basket';
interface BasketSliceProduct {
  ava?: string;
  price: number;
  cat_name: string;
  product_type: 'bundle' | 'product';
  categ_id: number;
  quantity: string;
  product_code: string;
  name: string;
  translate: Partial<Record<Language, string>>;
  product_id: number;
  quantity_in_cart: string;
}
interface BasketState {
  basket: BasketSliceProduct[];
}
const initialState: BasketState = {
  basket: [],
};
export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    addProductToBasket(state, action: PayloadAction<BasketSliceProduct>) {
      const index = state.basket.findIndex(
        (item) => item.product_id === action.payload.product_id,
      );
      console.log(action.payload);
      if (index >= 0) {
        state.basket[index].quantity_in_cart = action.payload.quantity_in_cart;
      } else {
        state.basket.push(action.payload);
      }
    },

    setBasket(state, action: PayloadAction<BasketSliceProduct[]>) {
      state.basket = action.payload;
    },
    removeProductFromBasket(state, action: PayloadAction<{ id: number }>) {
      state.basket = state.basket.filter(
        (item) => item.product_id !== action.payload.id,
      );
    },
  },
});

export const { addProductToBasket, setBasket, removeProductFromBasket } =
  basketSlice.actions;
