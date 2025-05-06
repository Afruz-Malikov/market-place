import React, { CSSProperties } from 'react';
import style from './text.module.scss';
import clsx from 'clsx';
interface TextProps {
  children: React.ReactNode;
  fontSize?: string;
  color?: string;
  styles?: CSSProperties;
  className?: string;
}
function Text({ children, fontSize, color, styles, className }: TextProps) {
  return (
    <p
      className={clsx(style.text, className)}
      style={{ ...styles, fontSize, color }}
    >
      {children}
    </p>
  );
}

export default Text;
