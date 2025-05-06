import React, { CSSProperties } from 'react';
import style from './button.module.scss';
import clsx from 'clsx';
interface ButtonProps {
  children: React.ReactNode;
  backgroundColor?: string;
  styles?: CSSProperties;
  className?: string;
  onClick?: React.MouseEventHandler;
  type?: 'submit' | 'reset' | 'button';
  disabled?: boolean;
}

function Button({
  children,
  backgroundColor,
  styles,
  className,
  type = 'button',
  disabled,
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(style.button, className)}
      style={{ backgroundColor, ...styles }}
    >
      {children}
    </button>
  );
}

export default Button;
