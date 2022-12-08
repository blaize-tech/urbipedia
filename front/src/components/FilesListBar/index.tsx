import React, {useContext, useState} from 'react'

import {Toolbar} from './Toolbar'

import {Flex, Box, useTheme, useDisclosure} from '@chakra-ui/react'
import {Collapse} from './Collapse'
import {Scrollbars} from 'react-custom-scrollbars-2'

import {ThemeContext} from '../../util/themecontext'
import {Resizable} from 're-resizable'
import {usePersistantState} from '../../util/persistant-state'
import {OrgRoamGraphReponse} from "../../api";
import {getThemeColor} from "../../util/getThemeColor";
import {initialVisuals} from "../config";
import {
    urbitCreateFile, urbitCreateLinkFileToFile,
    urbitDeleteFile, urbitDeleteLinkFileToFile,
    urbitRenameFile,
    urbitUpdateFile,
    urbitUpdateTagsToFile,
} from "../../util/urbit";
import {RenameModal} from "./RenameModal";
import {EditFileModal} from "./EditFileModal";

export interface SidebarProps {
    isOpen: boolean
    onClose: any
    onOpen: any
    windowWidth: number
    graphData: OrgRoamGraphReponse
    visuals: typeof initialVisuals
}

export const FilesListBar = (props: SidebarProps) => {
    const {
        isOpen,
        onOpen,
        onClose,
        windowWidth,
        graphData,
        visuals
    } = props;

    const theme = useTheme()
    const {highlightColor} = useContext(ThemeContext)
    const [sidebarWidth, setSidebarWidth] = usePersistantState<number>('sidebarWidth', 400);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1);
    const [currentFileName, setCurrentFileName] = useState<string>("");
    const [currentFileContent, setCurrentFileContent] = useState<string>("");
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
        await urbitCreateFile(defaultName, "").catch(console.error);
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
        parents: Array<string>,
        children: Array<string>
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
        parents.map(idTo => {
            urbitCreateLinkFileToFile(idTo, thisNode).catch(console.error);
        });
        children.map(idFrom => {
            urbitCreateLinkFileToFile(thisNode, idFrom).catch(console.error);
        });
        setCurrentFileContent(content);
        onCloseEditFileModal();
    };

    const renameFile = async () => {
        setCurrentFileName(graphData.nodes[selectedItemIndex].file);
        onOpenRenameDialog();
    };

    const deleteFile = async () => {
        urbitDeleteFile(graphData.nodes[selectedItemIndex].id)
            .catch(console.error);
        setSelectedItemIndex(-1);
    };

    const editFile = async () => {
        onOpenEditFileModal();
    };

    return (
        <Collapse
            animateOpacity={false}
            dimension="width"
            in={isOpen}
            //style={{ position: 'relative' }}
            unmountOnExit
            startingSize={0}
            style={{height: '100vh'}}
        >
            <Resizable
                size={{height: '100vh', width: sidebarWidth}}
                onResizeStop={(e, direction, ref, d) => {
                    setSidebarWidth((curr: number) => curr + d.width)
                }}
                enable={{
                    top: false,
                    right: false,
                    bottom: false,
                    left: true,
                    topRight: false,
                    bottomRight: false,
                    bottomLeft: false,
                    topLeft: false,
                }}
                minWidth="220px"
                maxWidth={windowWidth - 200}
            >
                <Flex flexDir="column" h="100vh" pl={2} color="black" bg="alt.100" width="100%">
                    <Flex
                        //whiteSpace="nowrap"
                        // overflow="hidden"
                        // textOverflow="ellipsis"
                        pl={2}
                        alignItems="center"
                        color="black"
                        width="100%"
                    >
                        <Flex pt={1} flexShrink={0}>
                            <Toolbar
                                {...{
                                    createNewFile,
                                    editFile,
                                    renameFile,
                                    deleteFile,
                                }}
                                haveSelection={(selectedItemIndex >= 0)}
                            />
                        </Flex>
                    </Flex>
                    <Scrollbars
                        //autoHeight
                        //autoHeightMax={600}
                        autoHide={false}
                        // renderThumbVertical={({style, ...props}) => (
                        //     <Box
                        //         style={{
                        //             ...style,
                        //             borderRadius: 0,
                        //             backgroundColor: highlightColor,
                        //         }}
                        //         //color="alt.100"
                        //         {...props}
                        //     />
                        // )}
                    >
                        {items(filesList)}
                    </Scrollbars>
                </Flex>
            </Resizable>
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
        </Collapse>
    )
}
