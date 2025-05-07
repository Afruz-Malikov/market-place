import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, Product } from '../../types/Product';
interface OrderState {
  products: Category[];
  searchFilterResult: Category[] | [] | null;
  isSearching: boolean;
}

const initialState: OrderState = {
  products: [],
  searchFilterResult: null,
  isSearching: false,
};

export const productSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addNewProductCatalog(state, action: PayloadAction<Product[]>) {
      const newCategory = {
        id: 0,
        pid: 0,
        name: 'Новые товары',
        ms_id: '',
        products: action.payload,
        translate: {
          ru: 'Новые товары',
          en: 'New Products',
          kr: '신상품',
          vi: 'Sản phẩm mới',
          uz: 'Yangi mahsulotlar',
        },
      };
      state.products = state.products.filter(
        (cat) => cat.name !== 'Новые товары',
      );
      state.products.unshift(newCategory);
    },

    setOrders(state, action: PayloadAction<Category[]>) {
      const newCategories = action.payload;
      const newProductCategory = state.products.find(
        (cat) => cat.name === 'Новые товары',
      );
      state.products = newProductCategory
        ? [newProductCategory, ...newCategories]
        : newCategories;
    },
    filterOrders(state, action: PayloadAction<Category[] | null>) {
      state.searchFilterResult = action.payload;
    },
    setIsSearching(state, action: PayloadAction<boolean>) {
      state.isSearching = action.payload;
    },
  },
});
export const { setOrders, filterOrders, setIsSearching, addNewProductCatalog } =
  productSlice.actions;
