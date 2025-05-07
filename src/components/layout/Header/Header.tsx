import style from './header.module.scss';
import Container from '../../UI/Container/Container';
import Button from '../../UI/Button/Button';
import Title from '../../UI/Title/Title';
import Text from '../../UI/Text/Text';
import Input from '../../UI/Input/Input';
import CatalogIcon from '../../../assets/svg/catalog.svg?react';
import SearchIcon from '../../../assets/svg/search.svg?react';
import BasketIcon from '../../../assets/svg/basket.svg?react';
import KrFlagIcon from '../../../assets/svg/kr_flag.svg?react';
import EnFlagIcon from '../../../assets/svg/en_flag.svg?react';
import RuFlagIcon from '../../../assets/svg/ru_flag.svg?react';
import ViFlagIcon from '../../../assets/svg/vi_flag.svg?react';
import UzFlagIcon from '../../../assets/svg/uz_flag.svg?react';
import CloseIcon from '../../../assets/svg/close.svg?react';
import Select from '../../UI/Select/Select';
import React, { useCallback, useEffect, useState } from 'react';
import CatalogMenu from '../../CatalogModal/CatalogModal';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../BreadCrumbs/BreadCrumbs';
import clsx from 'clsx';
import { debounce } from 'lodash';
import BurgerMenu from '../../BurgerMenu/BurgerMenu';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import {
  filterOrders,
  setIsSearching,
} from '../../../store/slices/productSlice';
import { useSearchProductsQuery } from '../../../store/services';
import { CustomLink } from '../../CustomLink/CustomLink';

interface SelectOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

const languageOptions = [
  { value: 'ru', label: 'Ru', icon: <RuFlagIcon /> },
  { value: 'kr', label: 'Kr', icon: <KrFlagIcon /> },
  { value: 'en', label: 'En', icon: <EnFlagIcon /> },
  { value: 'vi', label: 'Vi', icon: <ViFlagIcon /> },
  { value: 'uz', label: 'Uz', icon: <UzFlagIcon /> },
];

function Header() {
  const [searchValue, setSearchValue] = useState('');
  const [delayedSearchValue, setDelayedSearchValue] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bask = useSelector(
    (state: RootState) => state.products.searchFilterResult,
  );
  const { basket } = useSelector((state: RootState) => state.basket);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [isBurgerModalOpen, setIsBurgerModalOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (selectedOption: SelectOption): void => {
    i18n.changeLanguage(selectedOption.value);
  };

  const currentLanguage = languageOptions.find(
    (item) => item.value === i18n.language,
  );
  const basketProductsQuantity = basket.length;
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDelayedSearchValue(value);
    }, 500),
    [],
  );

  useEffect(() => {
    debouncedSearch(searchValue);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchValue, debouncedSearch]);

  const { data: searchData, isFetching } = useSearchProductsQuery(
    delayedSearchValue,
    {
      skip: delayedSearchValue.length <= 1,
    },
  );

  useEffect(() => {
    if (searchValue === '' || searchValue === ' ') {
      dispatch(filterOrders(null));
    }
  }, [searchValue, dispatch]);

  useEffect(() => {
    dispatch(setIsSearching(isFetching));
    if (isFetching) return;
    if (searchData?.folders) {
      dispatch(
        filterOrders(
          searchData.folders.filter((item) => item.name !== 'АССОРТИ'),
        ),
      );
    } else if (searchData) {
      console.log(bask);
      dispatch(filterOrders([]));
    }
  }, [searchData, isFetching, dispatch]);
  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleRedirect = () => {
    navigate('/');
  };

  return (
    <>
      <div className={style['header-top']}>
        <Container
          styles={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <CustomLink
            to="/"
            onClick={() => {
              if (searchValue.length > 0) {
                setSearchValue('');
              }
              setIsCatalogOpen(false);
            }}
          >
            <Text color="#B8C0DA" styles={{ fontSize: 15 }}>
              {t('header.top_desc')}
            </Text>
          </CustomLink>
          <div className={style['header-top-desc']}>
            <Text styles={{ fontSize: 12 }} color="#B8C0DA">
              {t('header.work_schedule')}
            </Text>
            <Text color="white" styles={{ fontWeight: 600, fontSize: 14 }}>
              {t('header.phone_number')}
            </Text>
          </div>
        </Container>
      </div>
      <nav
        className={clsx(
          style['header-nav'],
          isSearchBarOpen && style.searchBarOpen,
        )}
      >
        <Container
          styles={{
            position: 'relative',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'white',
          }}
        >
          <div className={style.logo}>
            <div
              className={clsx(style.burgerMenu, true && style.active)}
              onClick={() => setIsBurgerModalOpen(true)}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
            <CustomLink
              to="/"
              onClick={() => {
                if (searchValue.length > 0) {
                  setSearchValue('');
                }
                setIsCatalogOpen(false);
              }}
            >
              <Title>{t('header.site_title')}</Title>
            </CustomLink>
          </div>

          <div className={style['header-nav-search-wrapper']}>
            <Button
              className={style['catalog-button']}
              onClick={() => setIsCatalogOpen((prev) => !prev)}
            >
              <div className={style['icon-wrapper']}>
                <div
                  className={clsx(
                    style.icon,
                    !isCatalogOpen ? style.visible : style.hidden,
                  )}
                >
                  <CatalogIcon />
                </div>
                <div
                  className={clsx(
                    style.icon,
                    isCatalogOpen ? style.visible : style.hidden,
                  )}
                >
                  <CloseIcon />
                </div>
              </div>
              {t('header.catalog')}
            </Button>

            <div className={style['header-nav-search']}>
              <Input
                className={style.searchBar}
                placeholder={t('header.search_placeholder')}
                Icon={<SearchIcon />}
                svgStyles={{ backgroundColor: 'white' }}
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                onBlur={handleRedirect}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRedirect();
                }}
              />
            </div>
          </div>

          <div className={style.headerBasket}>
            <button
              className={style.searchBarButton}
              onClick={() => setIsSearchBarOpen((prev) => !prev)}
            >
              <SearchIcon />
            </button>
            <CustomLink
              to="/basket"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
              onClick={() => setIsCatalogOpen(false)}
            >
              <Button
                styles={{ color: 'black', position: 'relative' }}
                className={style['header-nav-basket']}
                backgroundColor="white"
              >
                <BasketIcon style={{ fill: '#036ce5' }} />
                <span className={style.basketTitle}>
                  {t('header.in_basket')}
                </span>
                <span className={style.count}>{basketProductsQuantity}</span>
              </Button>
            </CustomLink>

            <CustomLink
              to="/orders"
              onClick={() => setIsCatalogOpen(false)}
              className={style.orderButton}
            >
              <Button>
                <span>{t('header.orders')}</span>
              </Button>
            </CustomLink>

            <div className={style['header-nav-language']}>
              <Select
                options={languageOptions}
                placeholder={currentLanguage?.label}
                value={currentLanguage}
                onChange={(e) => handleLanguageChange(e)}
              />
            </div>
          </div>
        </Container>
        <CatalogMenu
          isOpen={isCatalogOpen}
          onClose={() => setIsCatalogOpen(() => false)}
        />
      </nav>
      <Breadcrumbs />

      <BurgerMenu
        isOpen={isBurgerModalOpen}
        setCatalogModal={setIsCatalogOpen}
        onClose={() => setIsBurgerModalOpen(false)}
      />
    </>
  );
}

export default Header;
