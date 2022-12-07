import React, {useContext, useState} from 'react'

import {Toolbar} from './Toolbar'

import {Flex, Box, useTheme} from '@chakra-ui/react'
import {Collapse} from './Collapse'
import {Scrollbars} from 'react-custom-scrollbars-2'

import {ThemeContext} from '../../util/themecontext'
import {Resizable} from 're-resizable'
import {usePersistantState} from '../../util/persistant-state'
import {OrgRoamGraphReponse} from "../../api";
import {getThemeColor} from "../../util/getThemeColor";
import {initialVisuals} from "../config";
import {urbitCreateFile} from "../../util/urbit";

export interface SidebarProps {
    isOpen: boolean
    onClose: any
    onOpen: any
    windowWidth: number
    graphData: OrgRoamGraphReponse
    visuals: typeof initialVisuals
}

const FilesListBar = (props: SidebarProps) => {
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
    const [sidebarWidth, setSidebarWidth] = usePersistantState<number>('sidebarWidth', 400)
    const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1)

    const items = (list: Array<string>) => {
        return (
            list.map((item, index) => {
                return (<div
                    onClick={() => {
                        setSelectedItemIndex(index);
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
        await urbitCreateFile("NewFile", "").catch(console.error);
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
                            <Toolbar{...{
                                createNewFile
                            }}
                            />
                        </Flex>
                    </Flex>
                    <Scrollbars
                        //autoHeight
                        //autoHeightMax={600}
                        autoHide
                        renderThumbVertical={({style, ...props}) => (
                            <Box
                                style={{
                                    ...style,
                                    borderRadius: 0,
                                    // backgroundColor: highlightColor,
                                }}
                                //color="alt.100"
                                {...props}
                            />
                        )}
                    >
                        {items(filesList)}
                    </Scrollbars>
                </Flex>
            </Resizable>
        </Collapse>
    )
}

export default FilesListBar
