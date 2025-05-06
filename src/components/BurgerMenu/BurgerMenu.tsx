import clsx from 'clsx';
import CatalogIcon from '../../assets/svg/catalog.svg?react';
import BasketIcon from '../../assets/svg/basket.svg?react';
import CloseIcon from '../../assets/svg/close.svg?react';
import PhoneIcon from '../../assets/svg/phone.svg?react';
import OrderIcon from '../../assets/svg/order.svg?react';
import style from './burgermenu.module.scss';
import Title from '../UI/Title/Title';
import Select from '../UI/Select/Select';
import { Link } from 'react-router-dom';
import CatalogModalMobile from '../CatalogModal/CatalogModalMobile';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface BurgerMenuProps {
  isOpen?: boolean;
  onClose?: () => void;
  setCatalogModal: (value: boolean) => void;
}
interface SelectOption {
  label: string;
  value: string;
}
const languageOptions = [
  { value: 'ru', label: 'Ру' },
  { value: 'kr', label: 'Kr' },
  { value: 'en', label: 'En' },
];
function BurgerMenu({ isOpen, onClose }: BurgerMenuProps) {
  const { t, i18n } = useTranslation();
  const [isOpenCatalog, setIsOpenCatalog] = useState(false);
  const handleLanguageChange = (selectedOption: SelectOption): void => {
    i18n.changeLanguage(selectedOption.value);
  };
  const currentLanguage = languageOptions.find(
    (item) => item.value === i18n.language,
  );
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  return (
    <>
      <div
        className={clsx(style.modal, isOpen && style.active, 'burger__modal')}
      >
        <div className={style.closeIconWrapper}>
          <button className={style.closeIcon} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className={style.logo}>
          <Title>{t('header.site_title')}</Title>{' '}
          <Select
            className={style.language}
            options={[
              { value: 'ru', label: 'Ру' },
              { value: 'kr', label: 'Kr' },
              { value: 'en', label: 'En' },
            ]}
            placeholder={currentLanguage?.label}
            value={currentLanguage}
            onChange={(e) => handleLanguageChange(e)}
          />
        </div>
        <div
          className={clsx(style.catalogButton, isOpenCatalog && style.active)}
        >
          <button onClick={() => setIsOpenCatalog((prev) => !prev)}>
            <CatalogIcon /> {t('header.catalog')}{' '}
            {/* Перевод текста для кнопки каталога */}
          </button>
          <CatalogModalMobile isOpen={isOpenCatalog} onClose={onClose} />
        </div>

        <Link to="/basket" onClick={onClose}>
          <button>
            <BasketIcon />
            <span>{t('header.in_basketMobile')}</span>{' '}
            {/* Перевод текста для корзины */}
          </button>
        </Link>
        <Link to="/orders" onClick={onClose}>
          <button>
            <OrderIcon />
            <span>{t('header.orders')}</span> {/* Перевод текста для заказов */}
          </button>
        </Link>
        <Link to={`tel:+82 10-5615-5694`} className={style.phone}>
          <PhoneIcon /> {t('header.phone_number')}{' '}
        </Link>
      </div>
      <div
        className={clsx(style.overlay, isOpen && style.active)}
        onClick={onClose}
      ></div>
    </>
  );
}

export default BurgerMenu;
