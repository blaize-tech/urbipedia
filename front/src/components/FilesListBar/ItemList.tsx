import { FC } from 'react';
import cn from 'classnames';

import { OrgRoamNode } from '../../api';

import styles from './ItemList.module.scss';

interface ItemListProps {
  setSelectedItemIndex: (arr: number) => void;
  setCurrentFileName: (arr: string) => void;
  selectedItemIndex: number;
  list: OrgRoamNode[];
}

const ItemList: FC<ItemListProps> = ({
  setSelectedItemIndex,
  setCurrentFileName,
  selectedItemIndex,
  list,
}) => {
  return (
    <ul className={styles.container}>
      {list.map(({ id, file }: OrgRoamNode, index: number) => (
        <li className={styles.element} key={id}>
          <button
            className={cn(styles.button, {
              [styles.isActive]: selectedItemIndex === index,
            })}
            onClick={() => {
              setSelectedItemIndex(index);
              setCurrentFileName(file);
            }}
            type="button"
          >
            {file}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ItemList;
