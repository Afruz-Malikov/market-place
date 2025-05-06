import { useEffect, useRef, useState } from 'react';
import style from './inbasketbutton.module.scss';
import BasketIcon from '../../assets/svg/basket.svg?react';
import MinusIcon from '../../assets/svg/minus.svg?react';
import PlusIcon from '../../assets/svg/plus.svg?react';
import Button from '../UI/Button/Button';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import {
  addProductToBasket,
  removeProductFromBasket,
} from '../../store/slices/basketSlice';
import { useChangeBasketMutation } from '../../store/services';
import { throttle } from 'lodash';

function InBasketButton({
  productQuantity,
  id,
  isEditable,
  categoryId,
}: {
  productQuantity: number;
  isEditable?: boolean;
  id: number;
  categoryId: number;
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { basket } = useSelector((state: RootState) => state.basket);
  const [quantity, setQuantity] = useState(0);
  const [changeBasket] = useChangeBasketMutation();

  const throttledSyncBasketRef = useRef(
    throttle(async (updatedBasket: { id: string; quantity: string }[]) => {
      try {
        await changeBasket({ products: updatedBasket }).unwrap();
      } catch (error) {
        console.error('Ошибка при обновлении корзины:', error);
      }
    }, 500),
  );

  useEffect(() => {
    const currentProduct = basket.find((item) => Number(item.id) === id);
    const newQuantity = Number(currentProduct?.quantity) || 0;
    if (newQuantity !== quantity) {
      setQuantity(newQuantity);
    }
  }, [id, basket]);

  const updateQuantity = (newQuantity: number) => {
    setQuantity(newQuantity);

    if (newQuantity > 0) {
      dispatch(
        addProductToBasket({
          id: id,
          quantity: newQuantity.toString(),
          cat_id: categoryId,
        }),
      );
    } else {
      dispatch(removeProductFromBasket({ id: id }));
    }

    const updatedBasket = basket
      .map((item) => ({
        id: item.id.toString(),
        quantity: item.quantity,
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
      {quantity === 0 ? (
        <Button onClick={handleAdd} className={style.addButton}>
          <BasketIcon /> {t('in_basket')}
        </Button>
      ) : (
        <div className={style.counter}>
          {isEditable ? (
            <>
              <button onClick={handleDecrement} className={style.counterButton}>
                <MinusIcon />
              </button>
              <span className={style.quantity}>{quantity}</span>
              <button onClick={handleIncrement} className={style.counterButton}>
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
