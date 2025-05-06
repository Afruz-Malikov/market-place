import React, { CSSProperties } from 'react';
import style from './title.module.scss';
import clsx from 'clsx';
interface TitleProps {
  children: React.ReactNode;
  fontSize?: string;
  color?: string;
  styles?: CSSProperties;
  className?: string;
}

function Title({ children, fontSize, color, styles, className }: TitleProps) {
  return (
    <h1
      className={clsx(style.title, className)}
      style={{ ...styles, fontSize, color }}
    >
      {children}
    </h1>
  );
}

export default Title;
