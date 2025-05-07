import clsx from 'clsx';
import Container from '../UI/Container/Container';
import style from './catalogmodal.module.scss';
import Title from '../UI/Title/Title';
import { useEffect, useState } from 'react';
// import AlcoholIcon from '../../assets/svg/alcochol.svg?react';
// import BakaleyaIcon from '../../assets/svg/bakaleya.svg?react';
// import BreadIcon from '../../assets/svg/bread.svg?react';
// import ChildCategoryIcon from '../../assets/svg/child_category.svg?react';
// import BreakfastIcon from '../../assets/svg/breakfast.svg?react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CustomLink } from '../CustomLink/CustomLink';
interface CatalogMenuProps {
  isOpen: boolean;
  onClose: () => void;
}
function CatalogMenu({ isOpen, onClose }: CatalogMenuProps) {
  const { i18n } = useTranslation();
  const { folder } = useSelector((state: RootState) => state.folders);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  const mainCategories = folder[1]?.children ?? [];

  const selectedCategory = mainCategories.find(
    (cat) => cat.id === selectedCategoryId,
  );

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <div className={clsx(style.modal, isOpen && style.active)}>
        <Container className={style.modalContainer}>
          <div className={style.contentWrapper}>
            {mainCategories.length === 0 ? (
              <>
                <div className={style.emptyMessage}>Ничего не найдено</div>
              </>
            ) : (
              <>
                <ul className={style.mainCategories}>
                  {mainCategories.map((category) => {
                    if (category.product_count === 0) return null;
                    return (
                      <li
                        key={category.id}
                        className={clsx(
                          style.mainCategoryItem,
                          category.id === selectedCategoryId &&
                            style.activeCategory,
                        )}
                        onClick={() =>
                          !category.children
                            ? null
                            : setSelectedCategoryId(category.id)
                        }
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setSelectedCategoryId(category.id);
                          }
                        }}
                      >
                        {!category.children ? (
                          <CustomLink
                            to={`/category/${category.id}`}
                            onClick={onClose}
                          >
                            <span>
                              {category.translate?.[i18n.language]
                                ? category.translate[i18n.language]
                                : category.name}
                            </span>
                          </CustomLink>
                        ) : (
                          <span>
                            {category.translate?.[i18n.language]
                              ? category.translate[i18n.language]
                              : category.name}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {selectedCategory &&
                  selectedCategory.children &&
                  selectedCategory?.children?.length > 0 && (
                    <div className={style.subCategories}>
                      <div className={style.subCategoryHeader}>
                        <Title>
                          {' '}
                          {selectedCategory.translate?.[i18n.language]
                            ? selectedCategory.translate[i18n.language]
                            : selectedCategory.name}
                        </Title>
                        <span>{selectedCategory.product_count} Товаров</span>
                      </div>
                      <ul className={clsx(style.subCategoryList)}>
                        {selectedCategory.children.map((subCat) => {
                          if (!subCat.product_count) return null;
                          return (
                            <li
                              key={subCat.id}
                              className={style.subCategoryItem}
                            >
                              <CustomLink
                                to={`/catalog/${subCat.pid}/${subCat.id}`}
                                onClick={onClose}
                              >
                                <span>
                                  {subCat.translate?.[i18n.language]
                                    ? subCat.translate[i18n.language]
                                    : subCat.name}
                                </span>
                                <span>({subCat.product_count})</span>
                              </CustomLink>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
              </>
            )}
          </div>
        </Container>
      </div>
      <div
        className={clsx(style.modalOverlay, isOpen && style.active)}
        onClick={onClose}
      ></div>
    </>
  );
}

export default CatalogMenu;
