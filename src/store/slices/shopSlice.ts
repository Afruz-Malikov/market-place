import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Shop } from '../../types/Shop';
interface ShopSliceInitialProps {
  shop: Shop | null;
}
const initialState: ShopSliceInitialProps = {
  shop: null,
};
export const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setShopData(state, action: PayloadAction<Shop>) {
      state.shop = action.payload;
    },
  },
});
export const { setShopData } = shopSlice.actions;
