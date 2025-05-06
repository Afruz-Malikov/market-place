import { Link, Outlet, useLocation } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import Button from '../../components/UI/Button/Button';
import Container from '../../components/UI/Container/Container';
// import Subtitle from '../../components/UI/Subtitle/Subtitle';
import Text from '../../components/UI/Text/Text';
import Title from '../../components/UI/Title/Title';
import style from './backet.module.scss';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Category } from '../../types/Product';
import { useMemo } from 'react';

function Basket() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  // Рекурсивный поиск категории по имени
  const findCategoryByName = (
    categories: Category[],
    name: string,
  ): Category | null => {
    for (const category of categories) {
      if (category.name === name) return category;
      if (category.children) {
        const found = findCategoryByName(category.children, name);
        if (found) return found;
      }
    }
    return null;
  };

  const { products } = useSelector((state: RootState) => state.products);
  const basketProducts = useSelector((state: RootState) => state.basket.basket);

  function getProductLabel(count: number): string {
    const lang = i18n.language;

    if (lang === 'ru') {
      const lastDigit = count % 10;
      const lastTwoDigits = count % 100;

      if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        return `${count} товаров`;
      }

      if (lastDigit === 1) return `${count} товар`;
      if (lastDigit >= 2 && lastDigit <= 4) return `${count} товара`;

      return `${count} товаров`;
    }

    if (lang === 'en') {
      return `${count} product${count === 1 ? '' : 's'}`;
    }

    if (lang === 'kr') {
      return `${count} 상품`;
    }
    return `${count} products`;
  }
  function getPositionLabel(count: number): string {
    const lang = i18n.language;

    if (lang === 'ru') {
      const lastDigit = count % 10;
      const lastTwoDigits = count % 100;

      if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        return `${count} позиций`;
      }

      if (lastDigit === 1) return `${count} позиция`;
      if (lastDigit >= 2 && lastDigit <= 4) return `${count} позиции`;

      return `${count} позиций`;
    }

    if (lang === 'en') {
      return `${count} position${count === 1 ? '' : 's'}`;
    }

    if (lang === 'kr') {
      return `${count} 포지션`; // 또는 항목(항목 = 항목/아이템)
    }

    return `${count} positions`;
  }

  const basketItemsDetailed = useMemo(() => {
    return basketProducts
      .map((basketItem) => {
        const category = findCategoryByName(products, basketItem.cat_name);
        if (!category) return null;
        const product = category.products.find(
          (p) => p.product_id === basketItem.id,
        );
        if (!product) return null;

        return {
          id: product.product_id,
          type: product.product_type,
          quantity: Number(product.quantity),
          quantityInBasket: basketItem.quantity,
          title:
            i18n.language in ['kr', 'en', 'ru'] &&
            product.translate[i18n.language as 'kr' | 'en' | 'ru']
              ? product.translate[i18n.language as 'kr' | 'en' | 'ru']
              : product.name,
          price: Math.ceil(Number(product.price?.[0]?.p || 0) / 100),
          code: product.product_code,
          categoryId: category.id,
          categoryName: category.name,
        };
      })
      .filter(Boolean);
  }, [basketProducts, products, i18n.language]);
  const totalPrice = useMemo(() => {
    return basketItemsDetailed
      .reduce(
        (acc, item) =>
          acc + Number(item?.price) * Number(item?.quantityInBasket),
        0,
      )
      .toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
  }, [basketItemsDetailed]);

  if (location.pathname.includes('checkout')) {
    return <Outlet />;
  }

  if (basketItemsDetailed.length === 0) {
    return (
      <Container styles={{ flexDirection: 'column', gap: 20 }}>
        <Title>{t('basket.empty')}</Title>
        <Link to="/">
          <Button>{t('basket.go_to_shop')}</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container styles={{ flexDirection: 'column', gap: 31 }}>
      <Title className={style.title}>{t('basket.title')}</Title>
      <div className={style.products}>
        <div className={style.productsWrapper}>
          <div className={style.wrapper}>
            {basketItemsDetailed.map((item, key) => {
              if (!item) return null;
              return (
                <ProductCard
                  key={key}
                  type={item.type}
                  id={Number(item.id)}
                  price={item.price}
                  seriesNumber={item.code}
                  quantity={item.quantity.toString()}
                  title={item.title}
                  categoryId={item.categoryId}
                  categoryName={item.categoryName}
                  isBasketCard
                  isEditable
                />
              );
            })}
          </div>
        </div>
        <div className={style.productsSumWrapper}>
          <div className={style.productsSum}>
            <div>
              <Title className={style.productPrice}>{totalPrice} ₩/кор</Title>
              <Text className={style.productCount}>
                {' '}
                {getProductLabel(basketProducts.length)}{' '}
                {getPositionLabel(basketProducts.length)}
              </Text>
            </div>
            <div>
              <Link to="/basket/checkout">
                <Button>{t('basket.checkout_button')}</Button>
              </Link>
              <Text className={style.warningText}>
                {t('basket.warning_text')}
              </Text>
            </div>
          </div>
          <div className={style.productSumMobile}>
            <Title>{t('basket.order_info')}</Title>
            <div className={style.lines}></div>
            <div>
              {' '}
              {getProductLabel(basketProducts.length)}{' '}
              {getPositionLabel(basketProducts.length)}
            </div>
            <div className={style.lines}></div>
            <div className={style.result}>
              <span>{t('basket.total')}:</span>
              <Title className={style.productPrice}>{totalPrice} ₩/кор</Title>
            </div>
            <Link to="/basket/checkout">
              <Button>{t('basket.checkout_button')}</Button>
            </Link>
            <div className={style.warningTextWrapper}>
              <Text className={style.warningText}>
                {t('basket.warning_text')}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Basket;
