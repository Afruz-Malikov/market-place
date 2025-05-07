import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  shop: {},
};
export const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setShopData(state, action) {
      state.shop = action.payload;
    },
  },
});
export const { setShopData } = shopSlice.actions;
