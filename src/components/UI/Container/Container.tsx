import React, { CSSProperties, ReactNode } from 'react';
import style from './container.module.scss';
import clsx from 'clsx';

interface ContainerProps {
  children: ReactNode;
  styles?: CSSProperties;
  className?: string;
}

function Container({
  children,
  styles,
  className,
}: ContainerProps): React.ReactElement {
  return (
    <div className={clsx(style.container, className)} style={{ ...styles }}>
      {children}
    </div>
  );
}

export default Container;
