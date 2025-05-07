import style from './productmodal.module.scss';
import CloseIcon from '../../assets/svg/close.svg?react';
import ShareIcon from '../../assets/svg/share.svg?react';
import Slider from '../UI/Slider/Slider';
import clsx from 'clsx';
import Title from '../UI/Title/Title';
import Text from '../UI/Text/Text';
import Subtitle from '../UI/Subtitle/Subtitle';
import InBasketButton from '../InBasketButton/InBasketButton';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { closeProductModal } from '../../store/slices/modalSlice';
import { addProductToBasket } from '../../store/slices/basketSlice';

function ProductModal() {
  const dispatch = useDispatch();
  const { productModalData, isProductModalOpen } = useSelector(
    (state: RootState) => state.modals,
  );

  useEffect(() => {
    if (isProductModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isProductModalOpen]);
  const addToBasket = (newQuantity: number) => {
    dispatch(
      addProductToBasket({
        product_id: productModalData?.id || 0,
        price: productModalData?.price || 0,
        product_code: productModalData?.code || '',
        quantity: productModalData?.productQuantity || '0',
        name: productModalData?.title || '',
        quantity_in_cart: newQuantity.toString(),
        product_type: productModalData?.type || 'bundle',
        translate: productModalData?.translate || {},
        ava: productModalData?.images[0],
        cat_name: productModalData?.categ_name || '',
        categ_id: productModalData?.categ_id || 0,
      }),
    );
  };
  return (
    <>
      <div className={clsx(style.modal, isProductModalOpen && style.active)}>
        <div>
          <button
            className={style.closeIcon}
            onClick={() => {
              dispatch(closeProductModal());
            }}
          >
            <CloseIcon />
          </button>

          <div className={style.slider}>
            <Slider
              options={[
                <img
                  key="default"
                  src={productModalData?.images[0]}
                  alt="Default slide"
                />,
              ]}
            />
          </div>

          <div className={style.share}>
            <div className={style.categories}>
              <button>{productModalData?.categ_name}</button>{' '}
              {/* <button>{productModalData?.sub_categ_name}</button> */}
            </div>
            <ShareIcon />
          </div>

          <Title className={style.title}>
            {productModalData?.title || 'Без названия'}
          </Title>
          <Text className={style.seriesNumber}>
            {productModalData?.code || 'Нет артикула'}
          </Text>
        </div>

        <div className={style.toBasket}>
          <Subtitle>
            {Number(productModalData?.price || 0).toLocaleString('ru-RU', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
            <span>₩/кор</span>
          </Subtitle>

          <InBasketButton
            addToBasket={addToBasket}
            id={productModalData?.id || 0}
            categoryId={productModalData?.categ_id || 0}
            productQuantity={Number(productModalData?.productQuantity) || 0}
            isEditable
          />
        </div>
      </div>

      <div
        className={clsx(style.overlay, isProductModalOpen && style.active)}
        onClick={() => {
          dispatch(closeProductModal());
        }}
      ></div>
    </>
  );
}

export default ProductModal;
