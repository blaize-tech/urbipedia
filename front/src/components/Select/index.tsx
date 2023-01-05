import { FC, useState, useEffect } from 'react';
import cn from 'classnames';

import IconClose from '../../images/icon-close-active.svg';
import IconSelected from '../../images/icon-selected.svg';

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
        <ul className={styles.tags}>
          {selectedlist.map((item: ItemInterface) => (
            <li
              className={styles.tagsButton}
              onClick={() => onChange(
                selectedlist.filter((element) => element !== item),
              )}
              key={item.value}
            >
              <span className={styles.text}>{item.label}</span>

              <img
                className={styles.icon}
                height="20"
                width="20"
                src={IconClose}
                alt="Delete"
              />
            </li>
          ))}
        </ul>
      )}

      <button
        className={styles.button}
        onClick={() => setIsOpened(!isOpened)}
        type="button"
      >
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
        <ul className={styles.list}>
          {itemList?.map((item: ItemInterface) => {
            if (onCreate && searchValue && !item.value.includes(searchValue)) {
              return (
                <li className={styles.listItem} key={item.value}>
                  <button
                    onClick={() => onCreate({
                      value: searchValue,
                      label: searchValue,
                    })}
                    type="button"
                  >
                    <span className={styles.listItemText}>
                      {`Create ${searchValue}`}
                    </span>
                  </button>
                </li>
              );
            }

            if (searchValue && item.value.includes(searchValue)) {
              return (
                <li className={styles.listItem} key={item.value}>
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
                    {selectedlist.find((element: ItemInterface) => {
                      return element.value === item.value;
                    }) && (
                      <img
                        className={styles.listItemIcon}
                        height="20"
                        width="20"
                        src={IconSelected}
                        alt="Selected"
                      />
                    )}

                    <span className={styles.listItemText}>
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            }

            if (!searchValue) {
              return (
                <li className={styles.listItem} key={item.value}>
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
                    {selectedlist.find((element: ItemInterface) => {
                      return element.value === item.value;
                    }) && (
                      <img
                        className={styles.listItemIcon}
                        height="20"
                        width="20"
                        src={IconSelected}
                        alt="Selected"
                      />
                    )}

                    <span className={styles.listItemText}>
                      {item.label}
                    </span>
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
