import { FC, useState } from 'react';
import { Input } from '@chakra-ui/react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    VStack,
    ModalFooter,
    Button,
} from '@chakra-ui/react';

interface RenameModalProps {
  name: string;
  onRename: any;
  onClose: any;
  showModal: boolean;
}

const RenameModal: FC<RenameModalProps> = ({
  name,
  onRename,
  onClose,
  showModal,
}) => {
  const [value, setValue] = useState(name);

  return (
    <Modal isCentered isOpen={showModal} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent zIndex="popover">
        <ModalHeader>Rename file:</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          <VStack spacing={4} display="flex" alignItems="flex-start">
            <Input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="link"
            colorScheme="red"
            ml={3}
            onClick={() => onRename(value)}
          >
            Ok
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RenameModal;
