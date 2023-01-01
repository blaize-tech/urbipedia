import { FC } from 'react';

import IconButton from '../IconButton';

import IconAdd from '../../images/icon-add.svg';
import IconAddHover from '../../images/icon-add-hover.svg';
import IconAddActive from '../../images/icon-add-active.svg';
import IconEdit from '../../images/icon-edit.svg';
import IconEditHover from '../../images/icon-edit-hover.svg';
import IconEditActive from '../../images/icon-edit-active.svg';
import IconRename from '../../images/icon-rename.svg';
import IconRenameHover from '../../images/icon-rename-hover.svg';
import IconRenameActive from '../../images/icon-rename-active.svg';
import IconDelete from '../../images/icon-delete.svg';
import IconDeleteHover from '../../images/icon-delete-hover.svg';
import IconDeleteActive from '../../images/icon-delete-active.svg';

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
      <IconButton
        ariaLabel="Create new file"
        onClick={createNewFile}
        title="Create new"
        icon={IconAdd}
        iconHover={IconAddHover}
        iconActive={IconAddActive}
      />

      <IconButton
        ariaLabel="Edit selected file"
        disabled={!haveSelection}
        onClick={editFile}
        title="Edit selected"
        icon={IconEdit}
        iconHover={IconEditHover}
        iconActive={IconEditActive}
      />

      <IconButton
        ariaLabel="Rename selected file"
        disabled={!haveSelection}
        onClick={renameFile}
        title="Rename selected"
        icon={IconRename}
        iconHover={IconRenameHover}
        iconActive={IconRenameActive}
      />

      <IconButton
        ariaLabel="Delete selected file"
        disabled={!haveSelection}
        onClick={deleteFile}
        title="Delete selected"
        icon={IconDelete}
        iconHover={IconDeleteHover}
        iconActive={IconDeleteActive}
      />
    </div>
  );
};

export default Toolbar;
