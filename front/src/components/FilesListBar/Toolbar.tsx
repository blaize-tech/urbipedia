import { FC } from 'react';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { PlusSquareIcon, EditIcon, DeleteIcon, CalendarIcon } from '@chakra-ui/icons';

interface ToolbarProps {
    createNewFile: any;
    editFile: any;
    renameFile: any;
    deleteFile: any;
    haveSelection: boolean;
}

const Toolbar: FC<ToolbarProps> = ({
    createNewFile,
    editFile,
    renameFile,
    deleteFile,
    haveSelection,
}) => {
  return (
    <div>
      <Tooltip label="Create new">
        <IconButton
          _focus={{}}
          variant="subtle"
          icon={<PlusSquareIcon/>}
          aria-label="Create new file"
          onClick={createNewFile}
        />
      </Tooltip>
      <Tooltip label="Edit selected">
        <IconButton
          _focus={{}}
          variant="subtle"
          icon={<CalendarIcon/>}
          aria-label="Edit selected file"
          disabled={!haveSelection}
          onClick={editFile}
        />
      </Tooltip>
      <Tooltip label="Rename selected">
        <IconButton
          _focus={{}}
          variant="subtle"
          icon={<EditIcon/>}
          aria-label="Rename selected file"
          disabled={!haveSelection}
          onClick={renameFile}
        />
      </Tooltip>
      <Tooltip label="Delete selected">
        <IconButton
          _focus={{}}
          variant="subtle"
          icon={<DeleteIcon/>}
          aria-label="Delete selected file"
          disabled={!haveSelection}
          onClick={deleteFile}
        />
      </Tooltip>
    </div>
  );
};

export default Toolbar;
