// store/slices/modalsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Language } from '../../types/Basket';

interface ModalsState {
  isProductModalOpen: boolean;
  productModalData: {
    id: number;
    title: string;
    code: string;
    price: number;
    productQuantity: string;
    categ_name: string;
    categ_id: number;
    sub_categ_name?: string;
    images: string[];
    type: 'bundle' | 'product';
    translate: Partial<Record<Language, string>>;
  } | null;
  AdvertisingModalData: {
    img: string;
    title: string;
    desc: string;
    link: {
      name: string;
      link: string;
    };
  } | null;
  isAdvertisingModalOpen: boolean;
  isSuccessCheckoutModalOpen: boolean;
  successCheckoutAmount: number | null;
}

const initialState: ModalsState = {
  isProductModalOpen: false,
  productModalData: null,
  AdvertisingModalData: null,
  isAdvertisingModalOpen: false,
  isSuccessCheckoutModalOpen: false,
  successCheckoutAmount: null,
};

export const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openProductModal(
      state,
      action: PayloadAction<{
        id: number;
        title: string;
        code: string;
        price: number;
        categ_name: string;
        sub_categ_name: string;
        categ_id: number;
        productQuantity: string;
        images: string[];
        type: 'bundle' | 'product';
        translate: Partial<Record<Language, string>>;
      }>,
    ) {
      state.isProductModalOpen = true;
      state.productModalData = action.payload;
    },
    closeProductModal(state) {
      state.isProductModalOpen = false;
      state.productModalData = null;
    },
    openAdvertisingModal(
      state,
      action: PayloadAction<{
        img: string;
        title: string;
        desc: string;
        link: {
          name: string;
          link: string;
        };
      }>,
    ) {
      state.AdvertisingModalData = action.payload;
      state.isAdvertisingModalOpen = true;
    },
    closeAdvertisingModal(state) {
      state.isAdvertisingModalOpen = false;
      state.AdvertisingModalData = null;
    },
    openSuccessCheckoutModal(state, action: PayloadAction<number>) {
      state.isSuccessCheckoutModalOpen = true;
      state.successCheckoutAmount = action.payload;
    },
    closeSuccessCheckoutModal(state) {
      state.isSuccessCheckoutModalOpen = false;
      state.successCheckoutAmount = null;
    },
  },
});

export const {
  openProductModal,
  closeProductModal,
  openAdvertisingModal,
  closeAdvertisingModal,
  openSuccessCheckoutModal,
  closeSuccessCheckoutModal,
} = modalsSlice.actions;

export default modalsSlice.reducer;
