import style from './productcard.module.scss';
import NoFoto from '../../assets/image/no-foto.jpeg';
import TrashIcon from '../../assets/svg/trash.svg?react';
import Text from '../UI/Text/Text';
import Subtitle from '../UI/Subtitle/Subtitle';
import InBasketButton from '../InBasketButton/InBasketButton';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
  addProductToBasket,
  removeProductFromBasket,
} from '../../store/slices/basketSlice';
import { openProductModal } from '../../store/slices/modalSlice';
import { useChangeBasketMutation } from '../../store/services';
import { useTranslation } from 'react-i18next';
import { Language } from '../../types/Basket';

interface ProductCardProps {
  title: string;
  seriesNumber: string;
  photo?: string;
  price: number;
  id: number;
  quantity: string;
  isBasketCard?: boolean;
  isEditable?: boolean;
  categoryName: string;
  categoryId: number;
  subCategoryName?: string;
  type: 'bundle' | 'product';
  translation?: Partial<Record<Language, string>>;
  onClick?: () => void;
}

function ProductCard({
  id,
  title,
  photo,
  price,
  seriesNumber,
  quantity,
  type,
  isBasketCard,
  categoryName,
  categoryId,
  subCategoryName,
  isEditable,
  translation,
}: ProductCardProps) {
  const dispatch = useDispatch();
  const { basket } = useSelector((state: RootState) => state.basket);
  const shopId = useSelector((state: RootState) => state.shop.shop?.id);

  const [changeBasket] = useChangeBasketMutation();
  const { t, i18n } = useTranslation();
  const handleDeleteProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!shopId) return;
    dispatch(removeProductFromBasket({ id: id }));
    const updatedBasket = basket
      .map((item) => ({
        id: item.product_id.toString(),
        quantity: item.quantity_in_cart,
      }))
      .filter((item) => Number(item.id) !== id);
    changeBasket({ products: updatedBasket, shopId })
      .unwrap()
      .catch((error) => {
        console.error('Ошибка при обновлении корзины:', error);
      });
  };

  const formatPrice = (value: number) => {
    return value.toLocaleString(i18n.language, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  const addToBasket = (newQuantity: number) => {
    dispatch(
      addProductToBasket({
        product_id: id,
        price: price,
        product_code: seriesNumber,
        quantity: quantity,
        name: title,
        quantity_in_cart: newQuantity.toString(),
        product_type: type,
        translate: translation || {},
        ava: photo,
        cat_name: categoryName,
        categ_id: categoryId,
      }),
    );
  };
  const handleClick = () => {
    dispatch(
      openProductModal({
        productQuantity: quantity,
        id: id,
        categ_id: categoryId,
        title,
        code: seriesNumber,
        price,
        categ_name: categoryName,
        sub_categ_name: subCategoryName || '',
        images: [photo || NoFoto],
        type: type,
        translate: translation || {},
      }),
    );
  };
  return (
    <div
      className={clsx(style.card, isBasketCard && style.basketCard)}
      onClick={!isBasketCard ? handleClick : undefined}
    >
      <div className={clsx(style.info, isBasketCard && style.infoBasket)}>
        <div className={style.infoTextWrapper}>
          <img src={photo || NoFoto} alt={t('product.image_alt')} />
          <div className={style.infoText}>
            {/* {categoryName === 'Новые товары' && (
              <Text className={style.badge}>{t("product.new_badge")}</Text>
            )} */}
            <Subtitle className={style.title}>
              {title} ({quantity}
              {t('units')})
            </Subtitle>
            {type === 'bundle' && title && <Text>{seriesNumber}</Text>}
          </div>
        </div>
        {isBasketCard && (
          <button className={style.trash} onClick={handleDeleteProduct}>
            <TrashIcon />
          </button>
        )}
      </div>
      <div className={clsx(style.price, isBasketCard && style.basketPrice)}>
        <div className={style.priceTile}>
          <Subtitle>
            {formatPrice(price)}{' '}
            <span>₩{type !== 'product' && `${t('breadcrumbs.kor')}`}</span>
          </Subtitle>
          {isBasketCard && (
            <Text>
              {formatPrice(price)}{' '}
              <span>₩{type !== 'product' && `${t('breadcrumbs.kor')}`}</span>
            </Text>
          )}
        </div>
        {isEditable ? (
          <div className={style.priceButton}>
            <div>
              {isBasketCard && (
                <button className={style.trash} onClick={handleDeleteProduct}>
                  <TrashIcon />
                </button>
              )}
              <InBasketButton
                id={id}
                isEditable={isEditable}
                productQuantity={Number(quantity)}
                categoryId={categoryId}
                addToBasket={addToBasket}
              />
            </div>
          </div>
        ) : (
          <InBasketButton
            id={id}
            isEditable={isEditable}
            productQuantity={Number(quantity)}
            categoryId={categoryId}
            addToBasket={addToBasket}
          />
        )}
      </div>
    </div>
  );
}

export default ProductCard;
