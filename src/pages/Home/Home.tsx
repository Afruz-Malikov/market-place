import Container from '../../components/UI/Container/Container';
import ProductCard from '../../components/ProductCard/ProductCard';
import Subtitle from '../../components/UI/Subtitle/Subtitle';
import style from './home.module.scss';
import ProductModal from '../../components/ProductModal/ProductModal';
import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Category } from '../../types/Product';
import { RootState } from '../../store/store';
import LoaderTrigger from '../../components/LoaderTrigger/LoaderTrigger';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Home() {
  const { i18n } = useTranslation();
  const { products, searchFilterResult, isLoading } = useSelector(
    (state: RootState) => state.products,
  );
  const { categoryId, subCategoryId } = useParams();
  const [visibleCountBySection, setVisibleCountBySection] = useState<
    Record<number, number>
  >({});
  const [visibleSectionCount, setVisibleSectionCount] = useState(1);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

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
      return `${count} sản phẩm`;
    }
    return `${count} products`;
  }

  const loadMore = (sectionId: number) => {
    setVisibleCountBySection((prev) => ({
      ...prev,
      [sectionId]: (prev[sectionId] || 10) + 10,
    }));
  };

  const loadMoreSections = () => {
    setVisibleSectionCount((prev) => prev + 3);
  };

  const topLevelSections = useMemo(() => {
    const filteredProducts = !searchFilterResult
      ? products
      : searchFilterResult;

    if (
      !Array.isArray(products) ||
      products.length < 2 ||
      !products[1]?.children
    ) {
      return filteredProducts || [];
    }

    if (categoryId && subCategoryId) {
      const category = products[1].children.find(
        (c) => String(c.id) === categoryId,
      );
      const sub = category?.children?.find(
        (c) => String(c.id) === subCategoryId,
      );
      return sub ? [sub] : [];
    } else if (categoryId) {
      const category = products[1].children.find(
        (c) => String(c.id) === categoryId,
      );
      return category ? [category] : [];
    }

    return filteredProducts || [];
  }, [categoryId, subCategoryId, products, searchFilterResult]);

  const renderSection = (section: Category) => {
    const visibleCount = visibleCountBySection[section.id] || 10;
    const hasProducts = section.products && section.products.length > 0;

    return (
      <div key={section.id}>
        {hasProducts && (
          <Container
            styles={
              section.name === 'Новые товары'
                ? {
                    width: '93.5vw',
                    margin: '0 auto',
                    paddingTop: '50px',
                    paddingBottom: '50px',
                    backgroundColor: '#eef2f9',
                    borderRadius: 30,
                    flexDirection: 'column',
                    paddingRight: 30,
                    paddingLeft: 30,
                    marginBottom: 40,
                  }
                : { flexDirection: 'column' }
            }
          >
            <Subtitle fontSize="23px" className={style['card-title']}>
              {section.translate?.[i18n.language] || section.name}{' '}
              <span>{getProductLabel(section.products.length)}</span>
            </Subtitle>
            <div className={style.wrapper}>
              {section.products.slice(0, visibleCount).map((product) => {
                return (
                  <ProductCard
                    key={product.product_id}
                    id={product.product_id}
                    price={Math.ceil(Number(product.price?.[0]?.p || 0) / 100)}
                    seriesNumber={product.product_code}
                    quantity={product.quantity}
                    title={product.translate?.[i18n.language] || product.name}
                    photo={product.ava}
                    type={product.product_type}
                    isEditable
                    categoryId={section.id}
                    categoryName={section.name}
                    translation={product.translate}
                  />
                );
              })}
            </div>
            {visibleCount < section.products.length && (
              <LoaderTrigger onVisible={() => loadMore(section.id)} />
            )}
          </Container>
        )}
        {section.children?.length > 0 && section.children.map(renderSection)}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Container>
        <div>Loading...</div>
      </Container>
    );
  }

  if (
    !topLevelSections.length ||
    (Array.isArray(searchFilterResult) && searchFilterResult.length === 0)
  ) {
    return (
      <Container>
        <div>Ничего не найдено</div>
      </Container>
    );
  }

  return (
    <section className={style.products}>
      <div className={style.cards}>
        {topLevelSections.slice(0, visibleSectionCount).map(renderSection)}
        {visibleSectionCount < topLevelSections.length && (
          <LoaderTrigger onVisible={loadMoreSections} />
        )}
      </div>
      <ProductModal />
    </section>
  );
}

export default Home;
