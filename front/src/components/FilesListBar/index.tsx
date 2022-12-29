import { FC, useContext, useState } from 'react';
import { useTheme, useDisclosure } from '@chakra-ui/react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Resizable } from 're-resizable';

import { ThemeContext } from '../../util/themecontext';
import { usePersistantState } from '../../util/persistant-state';
import { OrgRoamGraphReponse } from "../../api";
import { getThemeColor } from "../../util/getThemeColor";
import { initialVisuals } from "../config";
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
import { Toolbar } from './Toolbar';
import { Collapse } from './Collapse';
import { RenameModal } from "./RenameModal";
import { EditFileModal } from "./EditFileModal";

import styles from './FilesListBar.module.scss';

interface FilesListBarProps {
  windowWidth: number;
  graphData: OrgRoamGraphReponse;
  visuals: typeof initialVisuals;
}

const FilesListBar: FC<FilesListBarProps> = ({
  windowWidth,
  graphData,
  visuals
}) => {
  const theme = useTheme()
  const {highlightColor} = useContext(ThemeContext)
  const [sidebarWidth, setSidebarWidth] = usePersistantState<number>('sidebarWidth', 400);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1);
  const [currentFileName, setCurrentFileName] = useState<string>("");

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

  const items = (list: Array<string>) => {
    return (
      list.map((item, index) => {
        const id = graphData.nodes[index].id;
        return (<div
          key={id}
          onClick={() => {
            for (let i = 0; i < graphData.nodes.length; i++) {
              if (graphData.nodes[index].id === id) {
                setCurrentFileName(graphData.nodes[index].file);
                setSelectedItemIndex(index);
                break;
              }
            }
          }}
          style={{
            width: "100%",
            background: (index !== selectedItemIndex)
              ? getThemeColor(visuals.labelBackgroundColor, theme)
              : getThemeColor(highlightColor, theme),
            margin: "1px",
            paddingLeft: "5px",
          }}
        >{item}</div>)
      })
    )
  };

  const filesList = graphData.nodes.map((node) => {
    return node.file;
  });

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
      className={styles.container}
      maxWidth={windowWidth - 200}
      minWidth="220px"
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

      <Toolbar
        {...{
          createNewFile,
          editFile,
          renameFile,
          deleteFile,
        }}
        haveSelection={(selectedItemIndex >= 0)}
      />

      <Scrollbars autoHide={false}>
        {items(filesList)}
      </Scrollbars>

      {isOpenRenameDialog && (<RenameModal
        name={currentFileName}
        showModal={isOpenRenameDialog}
        onRename={onRenameFile}
        onClose={onCloseRenameDialog}
      />)}

      {isOpenEditFileModal && (<EditFileModal
        showModal={isOpenEditFileModal}
        onEdit={onEditFile}
        onClose={onCloseEditFileModal}
        graphData={graphData}
        node={graphData.nodes[selectedItemIndex]}
      />)}
    </Resizable>
  );
};

export default FilesListBar;
