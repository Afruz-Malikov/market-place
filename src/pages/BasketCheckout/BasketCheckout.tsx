import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import Button from '../../components/UI/Button/Button';
import Container from '../../components/UI/Container/Container';
import Subtitle from '../../components/UI/Subtitle/Subtitle';
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
import { Category } from '../../types/Product';

function BasketCheckout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { products } = useSelector((state: RootState) => state.products);
  const basketProducts = useSelector((state: RootState) => state.basket.basket);
  const [createOrder] = useCreateOrderMutation();
  // const findCategoryById = (
  //   categories: Category[],
  //   id: number,
  // ): Category | null => {
  //   for (const category of categories) {
  //     // console.log(category);
  //     if (category.id === id) return category;
  //     if (category.children) {
  //       const found = findCategoryById(category.children, id);
  //       if (found) return found;
  //     }
  //   }
  //   return null;
  // };
  // const basketItemsDetailed = basketProducts
  //   .map((basketItem) => {
  //     const category = findCategoryById(products, basketItem.cat_id);
  //     if (!category) return null;
  //     const product = category.products.find(
  //       (p) => p.product_id === basketItem.id,
  //     );
  //     if (!product) return null;
  //     return {
  //       id: product.product_id,
  //       type: product.product_type,
  //       quantity: Number(basketItem.quantity),
  //       title:
  //         i18n.language in ['kr', 'en', 'ru'] &&
  //         product.translate[i18n.language as 'kr' | 'en' | 'ru']
  //           ? product.translate[i18n.language as 'kr' | 'en' | 'ru']
  //           : product.name,
  //       price: Math.ceil(Number(product.price?.[0]?.p || 0) / 100),
  //       code: product.product_code,
  //       categoryId: category.id,
  //       categoryName: category.name,
  //     };
  //   })
  //   .filter(Boolean);
  const [isLoading, setIsLoading] = useState(false);
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
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (basketProducts.length === 0) {
    return (
      <Container styles={{ flexDirection: 'column', gap: 20 }}>
        <Title>{t('basket_checkout.nothing_to_checkout')}</Title>
        <Link to="/">
          <Button>{t('basket.go_to_shop')}</Button>
        </Link>
      </Container>
    );
  }

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
            {basketProducts.map((item, key) => {
              if (!item) return null;
              return (
                <ProductCard
                  key={item.product_id}
                  id={item.product_id}
                  price={item.price}
                  seriesNumber={item.product_code}
                  quantity={item.quantity}
                  title={item.translate?.[i18n.language] || item.name}
                  photo={item.ava}
                  type={item.product_type}
                  categoryId={item.cat_id}
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
