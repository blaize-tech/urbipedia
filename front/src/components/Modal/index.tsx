import { FC } from 'react';
import {
    Modal as ModalContainer,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
} from '@chakra-ui/react';

interface RenameModalProps {
  isVisible: boolean;
  onSubmit: () => void;
  onClose: () => void;
  title: string;
  children: any;
}

const Modal: FC<RenameModalProps> = ({
  isVisible,
  onSubmit,
  onClose,
  title,
  children,
}) => {
  return (
    <ModalContainer isCentered isOpen={isVisible} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent zIndex="popover">
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          {children}
        </ModalBody>
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
