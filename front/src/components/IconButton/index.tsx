import { FC } from 'react';
import { Tooltip } from '@chakra-ui/react';
import cn from 'classnames';

import styles from './IconButton.module.scss';

interface IconButtonProps {
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  onClick: (arg: any) => void;
  title?: string;
  icon: string;
  iconHover: string;
  iconActive: string;
}

const IconButton: FC<IconButtonProps> = ({
  ariaLabel,
  className,
  disabled,
  onClick,
  title,
  icon,
  iconHover,
  iconActive,
}) => {
  return (
    <Tooltip label={title}>
      <button
        aria-label={ariaLabel}
        className={cn(styles.container, className)}
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        <img
          className={styles.icon}
          height="16"
          width="16"
          src={icon}
          alt={title}
        />

        <img
          className={cn(styles.icon, styles['icon--hover'])}
          height="16"
          width="16"
          src={iconHover}
          alt={title}
        />

        <img
          className={cn(styles.icon, styles['icon--active'])}
          height="16"
          width="16"
          src={iconActive}
          alt={title}
        />
      </button>
    </Tooltip>
  );
};

export default IconButton;
