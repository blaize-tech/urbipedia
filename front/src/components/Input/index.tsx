import { FC, ChangeEventHandler } from 'react';
import cn from 'classnames';

interface InputProps {
  className?: string;
  type?: 'text' | 'textarea';
  title: string;
  value?: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

import styles from './Input.module.scss';

const Input: FC<InputProps> = ({ className, type, title, value, onChange }) => {
  return (
    <label className={cn(styles.container, className)}>
      <span className={styles.title}>{title}</span>

      {type === 'textarea' ? (
        <textarea
          className={cn(styles.input, styles['input--textarea'])}
          onChange={onChange}
        >
          {value}
        </textarea>
      ) : (
        <input
          className={styles.input}
          type="text"
          value={value}
          onChange={onChange}
        />
      )}
    </label>
  );
};

export default Input;
