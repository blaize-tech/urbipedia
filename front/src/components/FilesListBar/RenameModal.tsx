import { FC, useState } from 'react';
import { Input } from '@chakra-ui/react';
import { VStack } from '@chakra-ui/react';

import Modal from '../Modal';

interface RenameModalProps {
  name: string;
  onRename: any;
  onClose: any;
  isVisible: boolean;
}

const RenameModal: FC<RenameModalProps> = ({
  name,
  onRename,
  onClose,
  isVisible,
}) => {
  const [value, setValue] = useState(name);

  return (
    <Modal
      isVisible={isVisible}
      onSubmit={() => onRename(value)}
      onClose={onClose}
      title="Rename file"
    >
      <VStack spacing={4} display="flex" alignItems="flex-start">
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </VStack>
    </Modal>
  );
};

export default RenameModal;
