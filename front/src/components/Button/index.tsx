import { FC } from 'react';
import cn from 'classnames';

import styles from './Button.module.scss';

interface ButtonProps {
  className: string;
  disabled?: boolean;
  onClick: () => void;
  type?: 'submit' | 'button';
  text: string;
}

const Button: FC<ButtonProps> = ({
  className,
  disabled,
  onClick,
  type,
  text,
}) => {
  return (
    <button
      className={cn(styles.container, className)}
      disabled={disabled}
      onClick={onClick}
      type={type || 'button'}
    >
      {text}
    </button>
  );
};

export default Button;
