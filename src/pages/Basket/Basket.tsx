import { Link, Outlet, useLocation } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import Button from '../../components/UI/Button/Button';
import Container from '../../components/UI/Container/Container';
// import Subtitle from '../../components/UI/Subtitle/Subtitle';
import Text from '../../components/UI/Text/Text';
import Title from '../../components/UI/Title/Title';
import style from './backet.module.scss';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Category } from '../../types/Product';
import { useMemo } from 'react';
import { useChangeBasketMutation } from '../../store/services';
import { setBasket } from '../../store/slices/basketSlice';

function Basket() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const basketProducts = useSelector((state: RootState) => state.basket.basket);
  const [changeBasket] = useChangeBasketMutation();
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

    if (lang === 'uz') {
      return `${count} mahsulot`;
    }

    if (lang === 'vi') {
      // Вьетнамский
      return `${count} sản phẩm`; // "sản phẩm" - продукт
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
      return `${count} 포지션`;
    }

    if (lang === 'uz') {
      return `${count} o'rin`;
    }

    if (lang === 'vi') {
      return `${count} vị trí`;
    }
    return `${count} positions`;
  }
  const findCategoryById = (
    categories: Category[],
    id: number,
  ): Category | null => {
    for (const category of categories) {
      if (category.id === id) {
        return category;
      }
      if (category.children) {
        const found = findCategoryById(category.children, id);
        if (found) return found;
      }
    }
    return null;
  };
  const totalPrice = useMemo(() => {
    return basketProducts
      .reduce(
        (acc, item) =>
          acc + Number(item?.price) * Number(item?.quantity_in_cart),
        0,
      )
      .toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
  }, [basketProducts]);

  if (location.pathname.includes('checkout')) {
    return <Outlet />;
  }

  if (basketProducts.length === 0) {
    return (
      <Container styles={{ flexDirection: 'column', gap: 20 }}>
        <Title>{t('basket.empty')}</Title>
        <Link to="/">
          <Button>{t('basket.go_to_shop')}</Button>
        </Link>
      </Container>
    );
  }
  const handleClearBasket = async () => {
    await changeBasket({ products: [] })
      .unwrap()
      .then((v) => console.log(v))
      .catch((err) => console.error(err));
    dispatch(setBasket([]));
  };
  return (
    <Container styles={{ flexDirection: 'column', gap: 31 }}>
      <Title className={style.title}>{t('basket.title')}</Title>
      <div className={style.products}>
        <div className={style.productsWrapper}>
          <div className={style.wrapper}>
            {basketProducts.map((item, key) => {
              console.log(item);
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
                  isEditable
                  isBasketCard
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
              <Button onClick={handleClearBasket} className={style.clearButton}>
                {t('basket.clear_button')}
              </Button>
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
            <Button onClick={handleClearBasket} className={style.clearButton}>
              {t('basket.clear_button')}
            </Button>
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
