import { FC, useState, useEffect } from 'react';
import cn from 'classnames';

interface ItemInterface {
  value: string;
  label: string;
}

interface InputProps {
  className?: string;
  onCreate?: (value: ItemInterface) => void;
  onChange: (value: ItemInterface[]) => void;
  title: string;
  placeholder: string;
  itemList: ItemInterface[];
  itemListselected: ItemInterface[];
}

import styles from './Select.module.scss';

const Select: FC<InputProps> = ({
  className,
  onCreate,
  onChange,
  title,
  placeholder,
  itemList,
  itemListselected,
}) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedlist, setSelectedlist] = useState<ItemInterface[]>([]);

  // useEffect is needed to prevent rerender of the itemListselected
  useEffect(() => setSelectedlist(itemListselected), [itemListselected]);

  return (
    <label className={cn(styles.container, className)}>
      <span className={styles.title}>{title}</span>

      {selectedlist.length > 0 && (
        <ul>
          {selectedlist.map((item: ItemInterface) => (
            <li key={item.value}>
              <button
                onClick={() => onChange(
                  selectedlist.filter((element) => element !== item),
                )}
                type="button"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      <button type="button" onClick={() => setIsOpened(!isOpened)}>
        <input
          className={styles.input}
          type="text"
          onChange={(e) => {
            setSearchValue(e.target.value);
            setIsOpened(true);
          }}
          placeholder={placeholder}
        />
      </button>

      {isOpened && (
        <ul>
          {itemList?.map((item: ItemInterface) => {
            if (onCreate && searchValue && !item.value.includes(searchValue)) {
              return (
                <li key={item.value}>
                  <button
                    onClick={() => onCreate({
                      value: searchValue,
                      label: searchValue,
                    })}
                    type="button"
                  >
                    {`Create ${searchValue}`}
                  </button>
                </li>
              );
            }

            if (searchValue && item.value.includes(searchValue)) {
              return (
                <li key={item.value}>
                  <button
                    onClick={() => {
                      if (!selectedlist.includes(item)) {
                        const list = selectedlist;

                        list.push(item);

                        onChange(list);
                      }
                    }}
                    type="button"
                  >
                    {item.label}
                  </button>
                </li>
              );
            }

            if (!searchValue) {
              return (
                <li key={item.value}>
                  <button
                    onClick={() => {
                      if (!selectedlist.find((element: ItemInterface) => {
                        return element.value === item.value;
                      })) {
                        onChange([...selectedlist, item]);

                        setIsOpened(false);
                      }
                    }}
                    type="button"
                  >
                    {item.label}
                  </button>
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
