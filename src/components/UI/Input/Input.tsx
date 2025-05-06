import React, { CSSProperties, ReactElement } from 'react';
import styles from './input.module.scss';
import clsx from 'clsx';

interface InputProps {
  svgStyles?: CSSProperties;
  inputStyles?: CSSProperties;
  Icon?: ReactElement;
  value?: string;
  iconPosition?: 'start' | 'end';
  placeholder: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';
  className?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  autoComplete?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
}

function Input({
  type = 'text',
  placeholder,
  svgStyles,
  inputStyles,
  Icon,
  onChange,
  value,
  iconPosition = 'end',
  className,
  name,
  id,
  disabled,
  readOnly,
  required,
  autoFocus,
  maxLength,
  minLength,
  pattern,
  autoComplete,
  onBlur,
  onFocus,
  onKeyDown,
  onKeyUp,
  onClick,
}: InputProps) {
  return (
    <div className={clsx(styles.input, className)}>
      {Icon && iconPosition === 'start' && (
        <div style={{ ...svgStyles }} className={styles.icon}>
          {Icon}
        </div>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ ...inputStyles }}
        className={styles.inputField}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        autoFocus={autoFocus}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        autoComplete={autoComplete}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onClick={onClick}
      />
      {Icon && iconPosition === 'end' && (
        <div style={{ ...svgStyles }} className={styles.icon}>
          {Icon}
        </div>
      )}
    </div>
  );
}

export default Input;
