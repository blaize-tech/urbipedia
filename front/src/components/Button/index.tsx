import { FC } from 'react';
import cn from 'classnames';

import styles from './Button.module.scss';

interface ButtonProps {
  className: string;
  onClick: () => void;
  type?: 'submit' | 'button';
  text: string;
}

const Button: FC<ButtonProps> = ({ className, onClick, type, text }) => {
  return (
    <button
      className={cn(styles.container, className)}
      onClick={onClick}
      type={type || 'button'}
    >
      {text}
    </button>
  );
};

export default Button;
