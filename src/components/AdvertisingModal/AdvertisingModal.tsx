import style from './advertisingmodal.module.scss';
import CloseIcon from '../../assets/svg/close.svg?react';
import AdvertisingPhoto from '../../assets/image/advertising.png';
import clsx from 'clsx';
import { useEffect } from 'react';
import Title from '../UI/Title/Title';
import Text from '../UI/Text/Text';
import Button from '../UI/Button/Button';
import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { closeAdvertisingModal } from '../../store/slices/modalSlice';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
function AdvertisingModal() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const { isAdvertisingModalOpen: isOpen, AdvertisingModalData } = useSelector(
    (state: RootState) => state.modals,
  );

  const handleClose = () => {
    dispatch(closeAdvertisingModal());
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={clsx(style.modal, isOpen && style.active)}
        key={i18n.language}
      >
        <div className={style.closeIconMobile}>
          <button className={style.closeIconMobile} onClick={handleClose}>
            <CloseIcon />
          </button>
        </div>
        <img src={AdvertisingPhoto} alt="Реклама" className={style.image} />
        <div className={style.info}>
          <div className={style.closeIcon}>
            <button className={style.closeIcon} onClick={handleClose}>
              <CloseIcon />
            </button>
          </div>
          <Title>{AdvertisingModalData?.title}</Title>
          <Text>
            <span
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(AdvertisingModalData?.desc || ''),
              }}
            />
          </Text>
          <Link to={AdvertisingModalData?.link.link || '#'}>
            <Button>{AdvertisingModalData?.link.name}</Button>
          </Link>
        </div>
      </div>
      <div
        className={clsx(style.overlay, isOpen && style.active)}
        onClick={handleClose}
      ></div>
    </>
  );
}

export default AdvertisingModal;
