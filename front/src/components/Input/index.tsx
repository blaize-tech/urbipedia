import { FC, ChangeEventHandler } from 'react';
import cn from 'classnames';

interface InputProps {
  type?: 'text' | 'textarea';
  title: string;
  value?: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

import styles from './Input.module.scss';

const Input: FC<InputProps> = ({ type, title, value, onChange }) => {
  return (
    <label className={styles.container}>
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
