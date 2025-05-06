import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import style from './successcheckoutmodal.module.scss';
import SuccessIcon from '../../assets/svg/check.svg?react';
import Title from '../UI/Title/Title';
import Text from '../UI/Text/Text';
import Button from '../UI/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { closeSuccessCheckoutModal } from '../../store/slices/modalSlice';
function SuccessCheckoutModal() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { successCheckoutAmount, isSuccessCheckoutModalOpen } = useSelector(
    (state: RootState) => state.modals,
  );

  return (
    <>
      <div
        className={clsx(
          style.modal,
          isSuccessCheckoutModalOpen && style.active,
        )}
      >
        <SuccessIcon />
        <Title>{t('success_checkout.thank_you')}</Title>
        <Text>
          {t('success_checkout.order_message', {
            orderId: 1449,
            amount:
              Number(successCheckoutAmount || 0).toLocaleString('ru-RU', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) + ' ₩',
          })}
        </Text>
        <Button
          onClick={() => {
            dispatch(closeSuccessCheckoutModal());
          }}
        >
          {t('success_checkout.order_more')}
        </Button>
      </div>
      <div
        className={clsx(
          style.overlay,
          isSuccessCheckoutModalOpen && style.active,
        )}
        onClick={() => {
          dispatch(closeSuccessCheckoutModal());
        }}
      ></div>
    </>
  );
}

export default SuccessCheckoutModal;
