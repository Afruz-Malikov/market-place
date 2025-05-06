import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetAllOrdersQuery,
  useGetFoldersQuery,
  useGetNewProductsQuery,
  useGetShopInfoQuery,
  useGetUserBasketQuery,
} from '../../store/services';
import {
  addNewProductCatalog,
  setOrders,
} from '../../store/slices/productSlice';
import { setBasket } from '../../store/slices/basketSlice';
import { RootState } from '../../store/store';
import { useEffect } from 'react';
import { setFolders } from '../../store/slices/folderSlice';
import AdvertisingModal from '../AdvertisingModal/AdvertisingModal';
import SuccessCheckoutModal from '../SuccessCheckoutModal/SuccessCheckoutModal';
import { openAdvertisingModal } from '../../store/slices/modalSlice';
import { useTranslation } from 'react-i18next';
import { isEqual } from 'lodash';
import spinStyle from '../LoaderTrigger/loadertrigger.module.scss';
function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const basketItems = useSelector((state: RootState) => state.basket.basket);
  const { products, isSearching } = useSelector(
    (state: RootState) => state.products,
  );
  const { data: allProductsData, isLoading: isProductsLoading } =
    useGetAllOrdersQuery(undefined, {
      pollingInterval: 10000,
    });
  const { data: newProductsData, isLoading: isNewProductsLoading } =
    useGetNewProductsQuery();
  const { data: userBasketData, isLoading: isBasketLoading } =
    useGetUserBasketQuery(undefined, {
      skip: basketItems.length > 0,
    });
  const { data: foldersData, isLoading: isFoldersLoading } =
    useGetFoldersQuery();
  const { data: ShopInfo, isLoading: isShopInfoLoading } =
    useGetShopInfoQuery();
  useEffect(() => {
    if (!isProductsLoading && allProductsData?.products) {
      const filteredProducts = allProductsData.products.filter(
        (item) => item.name !== 'АССОРТИ',
      );
      if (!isEqual(products, filteredProducts)) {
        dispatch(setOrders(filteredProducts));
      }
    }
  }, [allProductsData, isProductsLoading, dispatch]);
  useEffect(() => {
    if (!isNewProductsLoading && newProductsData?.products) {
      const formattedNewProductsData = Object.values(newProductsData.products);
      dispatch(addNewProductCatalog(formattedNewProductsData));
    }
  }, [newProductsData, isNewProductsLoading, dispatch]);
  useEffect(() => {
    if (!isBasketLoading && userBasketData?.folders?.length) {
      const formattedBasket = userBasketData.folders.flatMap((folder) =>
        folder.products.map((product) => ({
          cat_id: folder.id,
          id: Number(product.id),
          quantity: product.quantity,
        })),
      );
      dispatch(setBasket(formattedBasket));
    }
  }, [userBasketData, isBasketLoading, dispatch]);
  useEffect(() => {
    if (!isFoldersLoading && foldersData?.folders.length) {
      dispatch(setFolders(foldersData.folders));
    }
  }, [foldersData, isFoldersLoading, dispatch]);
  useEffect(() => {
    if (
      !isShopInfoLoading &&
      ShopInfo?.shop &&
      ShopInfo?.shop.status.value === 'success' &&
      i18n.language
    ) {
      const lang = i18n.language as 'en' | 'kr' | 'ru';
      const advertisingInfo = {
        img: ShopInfo.shop.promotion.img,
        ...(ShopInfo.shop.promotion[lang]
          ? { ...ShopInfo.shop.promotion[lang]?.info }
          : { ...ShopInfo.shop.promotion.info }),
      };
      dispatch(openAdvertisingModal(advertisingInfo));
    }
  }, [ShopInfo, isShopInfoLoading, dispatch]);
  return (
    <>
      <Header />
      <main>
        {(isProductsLoading && isBasketLoading) || isSearching ? (
          <div className={spinStyle.loader}>
            <div className={spinStyle.spinner} />
          </div>
        ) : (
          <>
            <Outlet />
            {/* <AdvertisingModal /> */}
            <SuccessCheckoutModal />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

export default Layout;
