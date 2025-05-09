import ProductCard from '../../components/ProductCard/ProductCard';
import Button from '../../components/UI/Button/Button';
import Container from '../../components/UI/Container/Container';
// import Subtitle from '../../components/UI/Subtitle/Subtitle';
import Textarea from '../../components/UI/Textarea/Textarea';
import Title from '../../components/UI/Title/Title';
import style from './basketcheckout.module.scss';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { openSuccessCheckoutModal } from '../../store/slices/modalSlice';
import React, { useState } from 'react';
import { setBasket } from '../../store/slices/basketSlice';
import { useCreateOrderMutation } from '../../store/services';
import { CustomLink } from '../../components/CustomLink/CustomLink';
import { useCustomNavigate } from '../../components/CustomNavigate/CustomNavigate';
import { Language } from '../../types/Basket';
// import { Category } from '../../types/Product';

function BasketCheckout() {
  const navigate = useCustomNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const basketProducts = useSelector((state: RootState) => state.basket.basket);
  const shopId = useSelector((state: RootState) => state.shop.shop?.id);

  const [createOrder] = useCreateOrderMutation();
  const [isLoading, setIsLoading] = useState(false);
  if (basketProducts.length === 0) {
    return (
      <Container styles={{ flexDirection: 'column', gap: 20 }}>
        <Title>{t('basket_checkout.nothing_to_checkout')}</Title>

        <CustomLink to="/">
          <Button>{t('basket.go_to_shop')}</Button>
        </CustomLink>
      </Container>
    );
  }
  if (!shopId) return;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const formattedBasket = basketProducts.map((item) => ({
        id: item.product_id.toString(),
        quantity: item.quantity_in_cart,
      }));
      await createOrder({
        products: formattedBasket,
        shopId,
      }).unwrap();
      const totalPrice = basketProducts.reduce(
        (acc, item) =>
          acc + Number(item?.price) * Number(item?.quantity_in_cart),
        0,
      );
      dispatch(setBasket([]));
      navigate('/');
      dispatch(openSuccessCheckoutModal(totalPrice));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Container styles={{ flexDirection: 'column', gap: 31 }}>
        <Title className={style.title}>{t('basket_checkout.title')}</Title>
        <div className={style.wrapper}>
          <form onSubmit={handleSubmit} className={style.form}>
            <label htmlFor="comment">
              {t('basket_checkout.comment_label')}
            </label>
            <Textarea placeholder="" id="comment" />
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? t('basket_checkout.loading')
                : t('basket_checkout.order_button')}
            </Button>
          </form>
          <div className={style.products}>
            {basketProducts.map((item) => {
              if (!item) return null;
              return (
                <ProductCard
                  key={item.product_id}
                  id={item.product_id}
                  price={item.price}
                  seriesNumber={item.product_code}
                  quantity={item.quantity}
                  title={
                    item.translate?.[i18n.language as Language] || item.name
                  }
                  photo={item.ava}
                  type={item.product_type}
                  categoryId={item.categ_id}
                  categoryName={item.cat_name}
                  isBasketCard
                />
              );
            })}
          </div>
        </div>
      </Container>
    </>
  );
}

export default BasketCheckout;
