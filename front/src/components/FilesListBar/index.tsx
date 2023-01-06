import { FC, useContext, useState } from 'react';
import { useWindowWidth } from '@react-hook/window-size';
import { useTheme, useDisclosure } from '@chakra-ui/react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Resizable } from 're-resizable';
import cn from 'classnames';

import { ThemeContext } from '../../util/themecontext';
import { usePersistantState } from '../../util/persistant-state';
import { OrgRoamGraphReponse } from "../../api";
import { getThemeColor } from "../../util/getThemeColor";
import {
  initialPhysics,
  initialFilter,
  initialVisuals,
  initialMouse,
  initialBehavior,
  initialLocal,
  TagColors,
  initialColoring,
} from '../config';
import {
  urbitCreateFile,
  urbitCreateLinkFileToFile,
  urbitDeleteFile,
  urbitDeleteLinkFileToFile,
  urbitRenameFile,
  urbitUpdateFile,
  urbitUpdateTagsToFile,
} from "../../util/urbit";

import Logo from './Logo';
import Toolbar from './Toolbar';
import ItemList from './ItemList';
import RenameModal from './RenameModal';
import EditFileModal from './EditFileModal';
import Menu from './Menu';

import styles from './FilesListBar.module.scss';

interface FilesListBarProps {
  className: string;
  graphData: OrgRoamGraphReponse;
  visuals: typeof initialVisuals;
  physics: typeof initialPhysics;
  setPhysics: any;
  threeDim: boolean;
  setThreeDim: (value: boolean) => void;
  filter: typeof initialFilter;
  setFilter: any;
  setVisuals: any;
  mouse: typeof initialMouse;
  setMouse: any;
  behavior: typeof initialBehavior;
  setBehavior: any;
  tags: string[];
  tagColors: TagColors;
  setTagColors: any;
  coloring: typeof initialColoring;
  setColoring: any;
  local: typeof initialLocal;
  setLocal: any;
}

const FilesListBar: FC<FilesListBarProps> = ({
  className,
  graphData,
  visuals,
  physics,
  setPhysics,
  threeDim,
  setThreeDim,
  filter,
  setFilter,
  setVisuals,
  mouse,
  setMouse,
  behavior,
  setBehavior,
  tagColors,
  setTagColors,
  coloring,
  setColoring,
  local,
  setLocal,
  tags,
}) => {
  const windowWidth = useWindowWidth();
  const theme = useTheme()
  const {highlightColor} = useContext(ThemeContext)
  const [sidebarWidth, setSidebarWidth] = usePersistantState<number>('sidebarWidth', 400);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1);
  const [currentFileName, setCurrentFileName] = useState<string>('');
    let isOpenRenameDialog, onOpenRenameDialog: () => void, onCloseRenameDialog: () => void;
    {
        const {isOpen, onOpen, onClose} = useDisclosure({defaultIsOpen: false})
        isOpenRenameDialog = isOpen;
        onOpenRenameDialog = onOpen;
        onCloseRenameDialog = onClose;
    }
    let isOpenEditFileModal, onOpenEditFileModal: () => void, onCloseEditFileModal: () => void;
    {
        const {isOpen, onOpen, onClose} = useDisclosure({defaultIsOpen: false})
        isOpenEditFileModal = isOpen;
        onOpenEditFileModal = onOpen;
        onCloseEditFileModal = onClose;
    }

  const createNewFile = async () => {
    const nameExist: Map<string, boolean> = new Map<string, boolean>;
    for (let i = 0; i < graphData.nodes.length; i++) {
      nameExist.set(graphData.nodes[i].file, true);
    }
    let defaultName = "New file";
    for (let i = 1; i < 100; i++) {
      if (!nameExist.has(defaultName + " " + String(i))) {
        defaultName = defaultName + " " + String(i);
        break;
      }
    }
    await urbitCreateFile(defaultName).catch(console.error);
  };

  const onRenameFile = async (name: string) => {
    urbitRenameFile(graphData.nodes[selectedItemIndex].id, name.length ? name : "noname")
      .catch(console.error);
    setCurrentFileName(name);
    onCloseRenameDialog();
  };

  const onEditFile = async (
    content: string,
    tags: Array<string>,
    links: Array<string>
  ) => {
    urbitUpdateFile(graphData.nodes[selectedItemIndex].id, content)
      .catch(console.error);
    urbitUpdateTagsToFile(graphData.nodes[selectedItemIndex].id, tags)
      .catch(console.error);
    const thisNode = graphData.nodes[selectedItemIndex].id;
    graphData.links.map(link => {
      if (link.source == thisNode || link.target == thisNode) {
        urbitDeleteLinkFileToFile(String(link.id)).catch(console.error);
      }
    });
    links.map(idTo => {
            urbitCreateLinkFileToFile(idTo, thisNode).catch(console.error);
        });
    onCloseEditFileModal();
  };

  const renameFile = async () => {
    setCurrentFileName(graphData.nodes[selectedItemIndex].file);
    onOpenRenameDialog();
  };

    const deleteFile = async () => {
        graphData.links.map(link => {
            if (link.source == graphData.nodes[selectedItemIndex].id
                || link.target == graphData.nodes[selectedItemIndex].id) {
                urbitDeleteLinkFileToFile(String(link.id)).catch(console.error);
            }
        });
        urbitDeleteFile(graphData.nodes[selectedItemIndex].id)
            .catch(console.error);
        setSelectedItemIndex(-1);
    };

  const editFile = async () => {
    onOpenEditFileModal();
  };

  return (
    <Resizable
      onResizeStop={(e, direction, ref, d) => {
        setSidebarWidth((curr: number) => curr + d.width)
      }}
      className={cn(styles.container, className)}
      maxWidth={windowWidth - 200}
      minWidth="250px"
      enable={{
        top: false,
        right: true,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      size={{ height: '100vh', width: sidebarWidth }}
    >
      <Logo />

      {
        process.env.REACT_APP_ADMIN === "1" &&
        <Toolbar
            createNewFile={createNewFile}
            editFile={editFile}
            renameFile={renameFile}
            deleteFile={deleteFile}
            haveSelection={(selectedItemIndex >= 0)}
        />
      }

      <Scrollbars autoHide={false}>
        <ItemList
          setSelectedItemIndex={setSelectedItemIndex}
          setCurrentFileName={setCurrentFileName}
          selectedItemIndex={selectedItemIndex}
          list={graphData.nodes}
        />
      </Scrollbars>

      {isOpenRenameDialog && (
        <RenameModal
          name={currentFileName}
          onRename={onRenameFile}
          onClose={onCloseRenameDialog}
          isVisible={isOpenRenameDialog}
        />
      )}

      {isOpenEditFileModal && (
        <EditFileModal
          node={graphData.nodes[selectedItemIndex]}
          onEdit={onEditFile}
          onClose={onCloseEditFileModal}
          graphData={graphData}
          isVisible={isOpenEditFileModal}
        />
      )}

      <Menu
        className={styles.menu}
        visuals={visuals}
        physics={physics}
        setPhysics={setPhysics}
        threeDim={threeDim}
        setThreeDim={setThreeDim}
        filter={filter}
        setFilter={setFilter}
        setVisuals={setVisuals}
        mouse={mouse}
        setMouse={setMouse}
        behavior={behavior}
        setBehavior={setBehavior}
        tagColors={tagColors}
        setTagColors={setTagColors}
        coloring={coloring}
        setColoring={setColoring}
        local={local}
        setLocal={setLocal}
        tags={tags}
      />
    </Resizable>
  );
};

export default FilesListBar;
