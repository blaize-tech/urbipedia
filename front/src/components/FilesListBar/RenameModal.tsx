import { FC, useState } from 'react';

import Modal from '../Modal';
import Input from '../Input';

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
      <Input
        title="Edit Name:"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Modal>
  );
};

export default RenameModal;
