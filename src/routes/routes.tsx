import { createBrowserRouter, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home/Home';
import Basket from '../pages/Basket/Basket';
import BasketCheckout from '../pages/BasketCheckout/BasketCheckout';
import Order from '../pages/Orders/Order';
import { store } from '../store/store';
import breadCrumbsStyle from '../components/BreadCrumbs/breadcrumbs.module.scss';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Category } from '../types/Product';
import NotFound from '../pages/NotFound/NotFound';

function getTotalProductCount(categories: Category[]): number {
  let total = 0;

  function countInCategory(cat: Category) {
    total += cat.products.length;

    if (cat.children?.length) {
      for (const child of cat.children) {
        countInCategory(child);
      }
    }
  }

  for (const category of categories) {
    countInCategory(category);
  }

  return total;
}

const BreadcrumbsRouteHandler = ({
  breadcrumbKey,
  dopInfo,
}: {
  breadcrumbKey: string;
  dopInfo?: string;
}) => {
  const { t } = useTranslation();
  const translated = t(`breadcrumbs.${breadcrumbKey}`, {
    defaultValue: breadcrumbKey,
  });
  return <>{translated + (dopInfo ? ` ${dopInfo}` : '')}</>;
};

// Компонент-обертка для обработки breadcrumb с поддержкой i18n
const CategoryBreadcrumb = ({
  category,
  subCategory,
  categoryId,
}: {
  category?: Category;
  subCategory?: Category;
  categoryId?: string;
}) => {
  const { i18n } = useTranslation();

  return (
    <>
      {category && (
        <>
          <Link
            className={breadCrumbsStyle.breadcrumb}
            style={{ color: 'black', fontWeight: 400 }}
            to={`/category/${category.id}`}
          >
            {category.translate?.[i18n.language] || category.name}
          </Link>
          {' > '}
        </>
      )}
      {subCategory && (
        <span
          className={clsx(breadCrumbsStyle.breadcrumb, breadCrumbsStyle.active)}
        >
          {subCategory.translate?.[i18n.language] || subCategory.name}
        </span>
      )}
    </>
  );
};

const SingleCategoryBreadcrumb = ({ category }: { category?: Category }) => {
  const { i18n } = useTranslation();

  return (
    <>
      {category && (
        <span
          className={clsx(breadCrumbsStyle.breadcrumb, breadCrumbsStyle.active)}
        >
          {category.translate?.[i18n.language] || category.name}
        </span>
      )}
    </>
  );
};

export const routes = createBrowserRouter([
  {
    element: <Layout />,
    handle: {
      breadcrumb: <BreadcrumbsRouteHandler breadcrumbKey="products" />,
    },
    children: [
      {
        index: true,
        element: <Home />,
        handle: {
          breadcrumb: () => {
            const totalCount = getTotalProductCount(
              store.getState().products.products,
            );
            return (
              <BreadcrumbsRouteHandler
                breadcrumbKey="all_products"
                dopInfo={`(${totalCount})`}
              />
            );
          },
        },
      },
      {
        path: '/catalog/:categoryId/:subCategoryId',
        element: <Home />,
        handle: {
          breadcrumb: ({
            params,
          }: {
            params: { categoryId?: string; subCategoryId?: string };
          }) => {
            const state = store.getState();
            const folder = state.folders.folder;

            if (!folder[1]?.children) return null;

            const category = folder[1].children.find(
              (c) => String(c.id) === params.categoryId,
            );

            const subCategory = category?.children?.find(
              (s) => String(s.id) === params.subCategoryId,
            );

            return (
              <CategoryBreadcrumb
                category={category}
                subCategory={subCategory}
                categoryId={params.categoryId}
              />
            );
          },
        },
      },
      {
        path: '/category/:categoryId',
        element: <Home />,
        handle: {
          breadcrumb: ({ params }: { params: { categoryId?: string } }) => {
            const state = store.getState();
            const folder = state.folders.folder;

            if (!folder[1]?.children) return null;

            const category = folder[1].children.find(
              (c) => String(c.id) === params.categoryId,
            );

            return <SingleCategoryBreadcrumb category={category} />;
          },
        },
      },
      {
        path: '/basket',
        element: <Basket />,
        handle: {
          breadcrumb: <BreadcrumbsRouteHandler breadcrumbKey="basket" />,
        },
        children: [
          {
            path: '/basket/checkout',
            element: <BasketCheckout />,
            handle: {
              breadcrumb: <BreadcrumbsRouteHandler breadcrumbKey="checkout" />,
            },
          },
        ],
      },
      {
        path: '/orders',
        element: <Order />,
        handle: {
          breadcrumb: <BreadcrumbsRouteHandler breadcrumbKey="orders" />,
        },
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
