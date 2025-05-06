import clsx from "clsx";
import style from "./catalogmodalmobile.module.scss";
import { useEffect, useState } from "react";
import ForwardArrowIcon from "../../assets/svg/arrow_forward.svg?react";
import BackArrowIcon from "../../assets/svg/arrow_back.svg?react";

import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Folder } from "../../types/Categories";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface CatalogModalMobileProps {
  isOpen?: boolean;
  onClose?: () => void;
}

function CatalogModalMobile({ isOpen, onClose }: CatalogModalMobileProps) {
  const { i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<Folder | null>(null);
  const { folder } = useSelector((state: RootState) => state.folders);
  const mainCategories = folder[1]?.children ?? [];
  useEffect(() => {
    const burgerModal = document.querySelector(
      ".burger__modal"
    ) as HTMLElement | null;

    if (burgerModal) {
      burgerModal.style.overflow = selectedCategory ? "hidden" : "scroll";
    }
  }, [selectedCategory]);

  return (
    <div className={clsx(style.modal, isOpen && style.active)}>
      <div className={style.mainCategoriesWrapper}>
        <ul className={style.mainCategories}>
          {mainCategories.map((category) => {
            return (
              <li
                className={clsx(
                  style.mainCategoryItem,
                  selectedCategory &&
                    selectedCategory.id === category.id &&
                    style.active
                )}
                key={category.id}
              >
                <div
                  className={style.mainCategoryButton}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory?.id === category.id ? null : category
                    )
                  }
                >
                  {category.product_count === 0 ? null : !category.children ? (
                    <>
                      <span className={style.arrow}></span>
                      <Link to={`/category/${category.id}`} onClick={onClose}>
                        <span>
                          {category.translate?.[i18n.language]
                            ? category.translate[i18n.language]
                            : category.name}
                        </span>
                      </Link>
                      <span className={style.arrow}></span>
                    </>
                  ) : (
                    <>
                      <span
                        className={clsx(
                          style.arrow,
                          selectedCategory?.id === category.id && style.active
                        )}
                      >
                        <BackArrowIcon />
                      </span>

                      <span>
                        {category.translate?.[i18n.language]
                          ? category.translate[i18n.language]
                          : category.name}{" "}
                      </span>
                      <span
                        className={clsx(
                          style.arrow,
                          (selectedCategory === null ||
                            selectedCategory?.id !== category.id) &&
                            style.active
                        )}
                      >
                        <ForwardArrowIcon />
                      </span>
                    </>
                  )}
                </div>
                {!category.children ? null : (
                  <div
                    className={clsx(
                      style.subCategories,
                      selectedCategory?.id === category.id && style.active
                    )}
                  >
                    <ul className={style.subCategoryList}>
                      {category.children.map((subCat) => {
                        if (!subCat.product_count) return null;
                        return (
                          <li key={subCat.id} className={style.subCategoryItem}>
                            <Link
                              to={`/catalog/${subCat.pid}/${subCat.id}`}
                              onClick={onClose}
                            >
                              {subCat.translate?.[i18n.language]
                                ? subCat.translate[i18n.language]
                                : subCat.name}{" "}
                              <span className={style.subCount}>
                                ({subCat.product_count})
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default CatalogModalMobile;
