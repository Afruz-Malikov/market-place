import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface BasketProduct {
  cat_id: number;
  id: number;
  quantity: string;
}
interface BasketState {
  basket: BasketProduct[];
}
const initialState: BasketState = {
  basket: [],
};
export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    addProductToBasket(
      state,
      action: PayloadAction<{
        id: number;
        quantity: string;
        cat_id: number;
      }>,
    ) {
      const index = state.basket.findIndex(
        (item) => item.id === action.payload.id,
      );

      if (index >= 0) {
        state.basket[index].quantity = action.payload.quantity;
      } else {
        state.basket.push(action.payload);
      }
    },

    setBasket(state, action: PayloadAction<BasketProduct[]>) {
      state.basket = action.payload;
    },
    removeProductFromBasket(state, action: PayloadAction<{ id: number }>) {
      state.basket = state.basket.filter(
        (item) => item.id !== action.payload.id,
      );
    },
  },
});

export const { addProductToBasket, setBasket, removeProductFromBasket } =
  basketSlice.actions;
