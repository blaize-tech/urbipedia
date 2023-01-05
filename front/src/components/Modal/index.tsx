import { FC } from 'react';
import {
  Modal as ModalContainer,
  ModalOverlay,
  ModalContent,
  Tooltip,
} from '@chakra-ui/react';
import cn from 'classnames';

import ModalCloseButton from '../ModalCloseButton';
import IconButton from '../IconButton';
import Button from '../Button';

import IconReset from '../../images/icon-reset.svg';
import IconResetHover from '../../images/icon-reset-hover.svg';
import IconResetActive from '../../images/icon-reset-active.svg';

import styles from './Modal.module.scss';

interface ModalProps {
  isVisible: boolean;
  onSubmit?: () => void;
  resetAriaLabel?: string;
  resetTitle?: string;
  onReset?: () => void;
  onClose: () => void;
  onTitleClick?: () => void;
  titleTooltip?: string;
  title: string;
  children: any;
}

const Modal: FC<ModalProps> = ({
  isVisible,
  onSubmit,
  resetAriaLabel,
  resetTitle,
  onReset,
  onClose,
  onTitleClick,
  titleTooltip,
  title,
  children,
}) => {
  return (
    <ModalContainer isCentered isOpen={isVisible} onClose={onClose}>
      <ModalOverlay className={styles.overlay}/>

      <ModalContent className={styles.container} zIndex="popover">
        <header className={styles.header}>
          {titleTooltip ? (
            <Tooltip label={titleTooltip}>
              <h1
                className={cn(styles.title, styles['title--clickable'])}
                onClick={onTitleClick}
              >
                {title}
              </h1>
            </Tooltip>
          ) : (
            <h1
              className={styles.title}
              onClick={onTitleClick}
            >
              {title}
            </h1>
          )}

          {onReset && (
            <IconButton
              ariaLabel={resetAriaLabel}
              className={styles.reset}
              onClick={onReset}
              title={resetTitle}
              icon={IconReset}
              iconHover={IconResetHover}
              iconActive={IconResetActive}
            />
          )}

          <ModalCloseButton />
        </header>

        <section className={styles.content}>
          {children}
        </section>

        {onSubmit && (
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
        )}
      </ModalContent>
    </ModalContainer>
  );
};

export default Modal;
