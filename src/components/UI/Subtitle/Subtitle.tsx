import React, { CSSProperties } from 'react';
import style from './subtitle.module.scss';
import clsx from 'clsx';
interface SubtitleProps {
  children: React.ReactNode;
  fontSize?: string;
  color?: string;
  styles?: CSSProperties;
  className?: string;
}
function Subtitle({
  children,
  fontSize,
  color,
  styles,
  className,
}: SubtitleProps) {
  return (
    <h2
      className={clsx(style.title, className)}
      style={{ ...styles, fontSize, color }}
    >
      {children}
    </h2>
  );
}

export default Subtitle;
