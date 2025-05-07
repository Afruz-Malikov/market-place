import clsx from 'clsx';
import style from './breadcrumbs.module.scss';
import { useMatches } from 'react-router-dom';
import Container from '../UI/Container/Container';
import { ReactNode } from 'react';
import { CustomLink } from '../CustomLink/CustomLink';

interface BreadcrumbHandle {
  breadcrumb?: string | ((match: any) => ReactNode);
}

function Breadcrumbs() {
  const matches = useMatches();
  // Вычисляем только отображаемые хлебные крошки
  const crumbs = matches
    .map((match) => {
      const handle = match.handle as BreadcrumbHandle;
      const breadcrumb =
        typeof handle?.breadcrumb === 'function'
          ? handle.breadcrumb(match)
          : handle?.breadcrumb;

      return breadcrumb ? { breadcrumb, pathname: match.pathname } : null;
    })
    .filter(Boolean);
  if (crumbs.length <= 1) return null;

  return (
    <Container className={style.breadcrumbWrapper}>
      <nav>
        {crumbs.map((item, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <span key={index} className={style.breadcrumb}>
              {isLast ? (
                <span className={clsx(style.breadcrumb, style.active)}>
                  {item!.breadcrumb}
                </span>
              ) : (
                <CustomLink to={item!.pathname}>{item!.breadcrumb}</CustomLink>
              )}
              {!isLast && ' > '}
            </span>
          );
        })}
      </nav>
    </Container>
  );
}

export default Breadcrumbs;
