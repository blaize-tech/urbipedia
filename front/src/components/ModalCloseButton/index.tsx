import { FC, MouseEvent } from 'react';
import { callAllHandlers } from '@chakra-ui/shared-utils';
import { useModalContext } from '@chakra-ui/react';

import IconButton from '../IconButton';

import IconClose from '../../images/icon-close.svg';
import IconCloseHover from '../../images/icon-close-hover.svg';
import IconCloseActive from '../../images/icon-close-active.svg';

const ModalCloseButton: FC = () => {
  const { onClose } = useModalContext();

  return (
    <IconButton
      ariaLabel="Close modal"
      onClick={callAllHandlers(onClose, (event: MouseEvent) => {
        event.stopPropagation();
        onClose();
      })}
      title="Close modal"
      icon={IconClose}
      iconHover={IconCloseHover}
      iconActive={IconCloseActive}
    />
  );
};

export default ModalCloseButton;
