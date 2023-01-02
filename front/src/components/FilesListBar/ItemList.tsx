import { FC } from 'react';

import { OrgRoamNode } from '../../api';

interface ItemListProps {
  setSelectedItemIndex: (arr: number) => void;
  setCurrentFileName: (arr: string) => void;
  list: OrgRoamNode[];
}

const ItemList: FC<ItemListProps> = ({
  setSelectedItemIndex,
  setCurrentFileName,
  list,
}) => {
  return (
    <ul>
      {list.map(({ id, file }: OrgRoamNode, index: number) => (
        <li key={id}>
          <button
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
