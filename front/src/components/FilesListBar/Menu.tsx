import { FC } from 'react';
import cn from 'classnames';

import styles from './Menu.module.scss';

interface MenuProps {
  className: string;
}

const Menu: FC<MenuProps> = ({ className }) => {
  return (
    <ul className={cn(styles.container, className)}>
      <li className={styles.item}>
        <label>
        </label>
      </li>
    </ul>
  );
};

export default Menu;
