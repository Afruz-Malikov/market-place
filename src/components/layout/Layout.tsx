import { Outlet, useLocation, useParams } from 'react-router-dom';
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
import SuccessCheckoutModal from '../SuccessCheckoutModal/SuccessCheckoutModal';
import { openAdvertisingModal } from '../../store/slices/modalSlice';
import { useTranslation } from 'react-i18next';
import { isEqual } from 'lodash';
import spinStyle from '../LoaderTrigger/loadertrigger.module.scss';
import { setShopData } from '../../store/slices/shopSlice';

function Layout() {
  const { pathname } = useLocation();
  const { shopId } = useParams();
  const dispatch = useDispatch();
  const { i18n } = useTranslation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  const basketItems = useSelector((state: RootState) => state.basket.basket);
  const { products, isSearching } = useSelector(
    (state: RootState) => state.products,
  );

  const {
    data: ShopInfo,
    isLoading: isShopInfoLoading,
    error: shopInfoError,
  } = useGetShopInfoQuery(shopId!, { skip: !shopId });

  const { data: allProductsData, isLoading: isProductsLoading } =
    useGetAllOrdersQuery(shopId!, {
      pollingInterval: 10000,
      skip: !shopId,
    });

  const { data: newProductsData, isLoading: isNewProductsLoading } =
    useGetNewProductsQuery(shopId!, { skip: !shopId });

  const { data: userBasketData, isLoading: isBasketLoading } =
    useGetUserBasketQuery(shopId!, {
      skip: !shopId || basketItems.length > 0,
    });

  const { data: foldersData, isLoading: isFoldersLoading } = useGetFoldersQuery(
    shopId!,
    { skip: !shopId },
  );

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
    if (
      !isBasketLoading &&
      userBasketData?.folders?.length &&
      ShopInfo?.shop.counterparty_info.pricetype
    ) {
      const formattedBasket = userBasketData.folders
        .flatMap((folder) =>
          folder.products.map((product) => {
            const currentPrice = product.price.find(
              (item) => item.id === ShopInfo?.shop.counterparty_info.pricetype,
            );
            return {
              cat_name: folder.name,
              cat_id: folder.id.toString(),
              ...product,
              price: Math.ceil(Number(currentPrice?.p) || 0 / 100),
            };
          }),
        )
        .filter((item) => Number(item.cat_id) !== 0);
      dispatch(setBasket(formattedBasket));
    }
  }, [
    userBasketData,
    isBasketLoading,
    ShopInfo?.shop.counterparty_info.pricetype,
    dispatch,
  ]);

  useEffect(() => {
    if (!isFoldersLoading && foldersData?.folders.length) {
      dispatch(setFolders(foldersData.folders));
    }
  }, [foldersData, isFoldersLoading, ShopInfo?.shop.id, dispatch]);

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
      dispatch(setShopData(ShopInfo.shop));
    }
  }, [ShopInfo, isShopInfoLoading, dispatch]);
  if (!shopId || isShopInfoLoading)
    return (
      <div className={spinStyle.loader}>
        <div className={spinStyle.spinner} />
      </div>
    );
  if (
    shopInfoError ||
    !ShopInfo?.shop ||
    ShopInfo.shop.status.value !== 'success'
  ) {
    return 'Такого магазина нет';
  }

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
            <SuccessCheckoutModal />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

export default Layout;
