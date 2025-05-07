import React, { useState } from 'react';
import styles from './Select.module.scss';

import clsx from 'clsx';

interface SelectOption {
  label: string;
  value: string;

  icon?: React.ReactNode;
}

interface SelectProps {
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: SelectOption) => void;
  className?: string;
  value?: SelectOption;
}

function CustomSelect({
  options,
  placeholder = 'Выберите...',
  onChange,
  className,
  value,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<SelectOption | null>(value || null);
  const handleOptionClick = (option: SelectOption) => {
    setSelected(option);
    setIsOpen(false);
    onChange?.(option);
  };

  return (
    <div className={clsx(styles.wrapper, className)}>
      <div className={styles.select} onClick={() => setIsOpen((prev) => !prev)}>
        <span className={styles.selectedOption}>
          {selected ? selected.label : placeholder}
          {/* {selected?.icon && (
            <span className={styles.icon}>{selected.icon}</span>
          )} */}
        </span>
        <svg
          className={`${styles.arrow} ${isOpen ? styles.open : ''}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>

      {isOpen && (
        <ul className={styles.options}>
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className={styles.option}
            >
              <span>{option.label}</span>
              {option.icon && (
                <span className={styles.icon}>{option.icon}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomSelect;
