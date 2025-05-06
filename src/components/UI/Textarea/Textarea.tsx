import { CSSProperties, ChangeEvent } from 'react';
import styles from './textarea.module.scss';
import clsx from 'clsx';

interface TextareaProps {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  textareaStyles?: CSSProperties;
  placeholder: string;
  className?: string;
  id?: string;
}

function Textarea({
  value,
  onChange,
  placeholder,
  textareaStyles,
  id,
  className,
}: TextareaProps) {
  return (
    <textarea
      className={clsx(styles.textarea, className)}
      id={id}
      placeholder={placeholder}
      style={{ ...textareaStyles }}
      value={value}
      onChange={onChange}
    />
  );
}

export default Textarea;
