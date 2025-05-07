import { Link, useParams } from 'react-router-dom';
import type { ReactNode } from 'react';

type CustomLinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
};

export const CustomLink = ({
  to,
  children,
  className,
  style,
  onClick,
}: CustomLinkProps) => {
  const { shopId } = useParams<{ shopId: string }>();
  const finalTo = `/shop/${shopId}${to.startsWith('/') ? to : '/' + to}`;

  return (
    <Link to={finalTo} className={className} style={style} onClick={onClick}>
      {children}
    </Link>
  );
};
