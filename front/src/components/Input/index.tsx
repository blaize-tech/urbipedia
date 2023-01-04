import { FC, ChangeEventHandler } from 'react';

interface InputProps {
  title: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

import styles from './Input.module.scss';

const Input: FC<InputProps> = ({ title, value, onChange }) => {
  return (
    <label className={styles.container}>
      <span className={styles.title}>{title}</span>

      <input type="text" value={value} onChange={onChange} />
    </label>
  );
};

export default Input;
