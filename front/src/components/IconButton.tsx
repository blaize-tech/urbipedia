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
}

const IconButton: FC<IconButtonProps> = ({
  ariaLabel,
  className,
  disabled,
  onClick,
  title,
  icon,
}, ref) => {
  return (
    <Tooltip label={title}>
      <button
        aria-label={ariaLabel}
        className={cn(styles.container, className)}
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        <img src={icon} alt={title} height="16" width="16" />
      </button>
    </Tooltip>
  );
};

export default IconButton;
