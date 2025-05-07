import { useEffect, useRef, useState } from 'react';
import style from './inbasketbutton.module.scss';
import BasketIcon from '../../assets/svg/basket.svg?react';
import MinusIcon from '../../assets/svg/minus.svg?react';
import PlusIcon from '../../assets/svg/plus.svg?react';
import Button from '../UI/Button/Button';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { removeProductFromBasket } from '../../store/slices/basketSlice';
import { useChangeBasketMutation } from '../../store/services';
import { throttle } from 'lodash';

function InBasketButton({
  productQuantity,
  id,
  isEditable,
  addToBasket,
}: {
  productQuantity: number;
  isEditable?: boolean;
  id: number;
  categoryId: number;
  addToBasket: (newQuantity: number) => void;
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { basket } = useSelector((state: RootState) => state.basket);
  const shopId = useSelector((state: RootState) => state.shop.shop?.id);
  const [quantity, setQuantity] = useState(0);
  const [changeBasket] = useChangeBasketMutation();

  const throttledSyncBasketRef = useRef(
    throttle(async (updatedBasket: { id: string; quantity: string }[]) => {
      try {
        if (!shopId) return;
        await changeBasket({
          products: updatedBasket,
          shopId,
        }).unwrap();
      } catch (error) {
        console.error('Ошибка при обновлении корзины:', error);
      }
    }, 500),
  );

  useEffect(() => {
    const currentProduct = basket.find(
      (item) => Number(item.product_id) === id,
    );
    const inCartQuantity = Number(currentProduct?.quantity_in_cart) || 0;

    let newQuantity = 0;

    if (inCartQuantity > 0 && productQuantity === 0) {
      // Продукт есть в корзине, но на складе закончился — показываем 1
      newQuantity = 1;
    } else if (productQuantity > 0 && inCartQuantity > productQuantity) {
      newQuantity = productQuantity;
    } else {
      newQuantity = inCartQuantity;
    }

    if (newQuantity !== quantity) {
      setQuantity(newQuantity);
    }
  }, [id, basket, productQuantity]);

  const updateQuantity = (newQuantity: number) => {
    setQuantity(newQuantity);

    if (newQuantity > 0) {
      addToBasket(newQuantity);
    } else {
      dispatch(removeProductFromBasket({ id: id }));
    }

    const updatedBasket = basket
      .map((item) => ({
        id: item.product_id.toString(),
        quantity: item.quantity_in_cart,
      }))
      .filter((item) => Number(item.id) !== id)
      .concat({ id: id.toString(), quantity: newQuantity.toString() })
      .filter((item) => Number(item.quantity) > 0);

    throttledSyncBasketRef.current(updatedBasket);
  };

  const handleAdd = () => updateQuantity(1);
  const handleIncrement = () =>
    quantity < productQuantity && updateQuantity(quantity + 1);
  const handleDecrement = () => updateQuantity(quantity > 1 ? quantity - 1 : 0);
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div onClick={stopPropagation}>
      {productQuantity === 0 && quantity === 0 ? (
        <div className={style.outOfStock}>{t('out_of_stock')}</div>
      ) : quantity === 0 ? (
        <Button onClick={handleAdd} className={style.addButton}>
          <BasketIcon /> {t('in_basket')}
        </Button>
      ) : (
        <div className={style.counter}>
          {isEditable ? (
            <>
              <button
                onClick={handleDecrement}
                className={style.counterButton}
                disabled={productQuantity === 0}
              >
                <MinusIcon />
              </button>
              <span className={style.quantity}>{quantity}</span>
              <button
                onClick={handleIncrement}
                className={style.counterButton}
                disabled={quantity >= productQuantity}
              >
                <PlusIcon />
              </button>
            </>
          ) : (
            <span className={style.quantity}>{quantity}</span>
          )}
        </div>
      )}
    </div>
  );
}

export default InBasketButton;
