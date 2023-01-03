import { FC } from 'react';
import {
  Modal as ModalContainer,
  ModalOverlay,
  ModalContent,
} from '@chakra-ui/react';

import ModalCloseButton from '../ModalCloseButton';
import Button from '../Button';

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
          <ModalCloseButton />
        </header>

        <section className={styles.content}>
          {children}
        </section>

        <footer className={styles.footer}>
          <Button
            className={styles.button}
            onClick={onSubmit}
            type="submit"
            text="Accept"
          />

          <Button
            className={styles.button}
            onClick={onClose}
            type="button"
            text="Cancel"
          />
        </footer>
      </ModalContent>
    </ModalContainer>
  );
};

export default Modal;
