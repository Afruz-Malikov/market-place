import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { productSlice } from './slices/productSlice';
import { api } from './services';
import { basketSlice } from './slices/basketSlice';
import { folderSlice } from './slices/folderSlice';
import { modalsSlice } from './slices/modalSlice';
import { shopSlice } from './slices/shopSlice';
export const store = configureStore({
  reducer: {
    products: productSlice.reducer,
    [api.reducerPath]: api.reducer,
    basket: basketSlice.reducer,
    folders: folderSlice.reducer,
    modals: modalsSlice.reducer,
    shop: shopSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
