import style from "./productcard.module.scss";
import NoFoto from "../../assets/image/no-foto.jpeg";
import TrashIcon from "../../assets/svg/trash.svg?react";
import Text from "../UI/Text/Text";
import Subtitle from "../UI/Subtitle/Subtitle";
import InBasketButton from "../InBasketButton/InBasketButton";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { removeProductFromBasket } from "../../store/slices/basketSlice";
import { openProductModal } from "../../store/slices/modalSlice";
import { useChangeBasketMutation } from "../../store/services";
import { useTranslation } from "react-i18next";

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
  type: "bundle" | "product";
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
}: ProductCardProps) {
  const dispatch = useDispatch();
  const { basket } = useSelector((state: RootState) => state.basket);
  const [changeBasket] = useChangeBasketMutation();
  const { t, i18n } = useTranslation(); // Получаем t и i18n для текущего языка

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
        sub_categ_name: subCategoryName || "",
        images: [photo || NoFoto],
      })
    );
  };

  const handleDeleteProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeProductFromBasket({ id: id }));
    const updatedBasket = basket
      .map((item) => ({
        id: item.id.toString(),
        quantity: item.quantity,
      }))
      .filter((item) => Number(item.id) !== id);
    changeBasket({ products: updatedBasket })
      .unwrap()
      .then((v) => console.log(v))
      .catch((error) => {
        console.error("Ошибка при обновлении корзины:", error);
      });
  };

  // Форматирование цены в зависимости от текущего языка
  const formatPrice = (value: number) => {
    return value.toLocaleString(i18n.language, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div
      className={clsx(style.card, isBasketCard && style.basketCard)}
      onClick={!isBasketCard ? handleClick : undefined}
    >
      <div className={clsx(style.info, isBasketCard && style.infoBasket)}>
        <div className={style.infoTextWrapper}>
          <img src={photo || NoFoto} alt={t("product.image_alt")} />
          <div className={style.infoText}>
            {/* {categoryName === 'Новые товары' && (
              <Text className={style.badge}>{t("product.new_badge")}</Text>
            )} */}
            <Subtitle className={style.title}>
              {title} ({quantity} {t("product.units")})
            </Subtitle>
            {type === "bundle" && title && <Text>{seriesNumber}</Text>}
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
            {formatPrice(price)}{" "}
            <span>
              ₩{type !== "product" && `${t("breadcrumbs.kor")}`}
            </span>
          </Subtitle>
          {isBasketCard && (
            <Text>
              {formatPrice(price)}{" "}
              <span>
                ₩{type !== "product" && `${t("breadcrumbs.kor")}`}
              </span>
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
                categoryName={categoryName}
              />
            </div>
          </div>
        ) : (
          <InBasketButton
            id={id}
            isEditable={isEditable}
            productQuantity={Number(quantity)}
            categoryName={categoryName}
          />
        )}
      </div>
    </div>
  );
}

export default ProductCard;