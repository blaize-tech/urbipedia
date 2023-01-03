import { FC } from 'react';
import {
    Modal as ModalContainer,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    Button,
} from '@chakra-ui/react';

import ModalCloseButton from '../ModalCloseButton';

import styles from './Modal.module.scss';

interface ModalProps {
  isVisible: boolean;
  onSubmit: () => void;
  onClose: () => void;
  title: string;
  children: any;
}

const Modal: FC<ModalProps> = ({
  isVisible,
  onSubmit,
  onClose,
  title,
  children,
}) => {
  return (
    <ModalContainer isCentered isOpen={isVisible} onClose={onClose}>
      <ModalOverlay className={styles.overlay}/>

      <ModalContent className={styles.container} zIndex="popover">
        <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <ModalCloseButton/>
        </header>

        <section className={styles.content}>
          {children}
        </section>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="link"
            colorScheme="red"
            ml={3}
            onClick={onSubmit}
          >
            Ok
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalContainer>
  );
};

export default Modal;
