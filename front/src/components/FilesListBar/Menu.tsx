import { FC } from 'react';

interface MenuProps {
  className: string;
}

const Menu: FC<MenuProps> = ({ className }) => {
  return (
    <ul className={className}>
      <li>
        <label>
        </label>
      </li>
    </ul>
  );
};

export default Menu;
