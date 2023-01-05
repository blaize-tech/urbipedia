import { FC, useState } from 'react';
import cn from 'classnames';

interface ItemInterface {
  value: string;
  label: string;
}

interface InputProps {
  className?: string;
  title: string;
  itemList: ItemInterface[];
}

import styles from './Select.module.scss';

const Select: FC<InputProps> = ({ className, title, itemList }) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');

  return (
    <label className={cn(styles.container, className)}>
      <span className={styles.title}>{title}</span>

      <button type="button" onClick={() => setIsOpened(true)}>
        <input
          className={styles.input}
          type="text"
          onChange={(e) => {
            setSearchValue(e.target.value);
            setIsOpened(true);
          }}
        />
      </button>

      {isOpened && (
        <ul>
          {itemList?.map(({ value, label }: ItemInterface) => {
            if (searchValue && value.includes(searchValue)) {
              return (
                <li key={value}>
                  <span>{value}</span>
                </li>
              );
            }

            if (!searchValue) {
              return (
                <li key={value}>
                  <span>{value}</span>
                </li>
              );
            }
          })}
        </ul>
      )}
    </label>
  );
};

export default Select;
