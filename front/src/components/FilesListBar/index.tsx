import React, {useContext} from 'react'

import {Toolbar} from './Toolbar'

import {Flex, Box, IconButton} from '@chakra-ui/react'
import {Collapse} from './Collapse'
import {Scrollbars} from 'react-custom-scrollbars-2'
import {BiDotsVerticalRounded} from 'react-icons/bi'

import {ThemeContext} from '../../util/themecontext'
import {Resizable} from 're-resizable'
import {usePersistantState} from '../../util/persistant-state'
import {OrgRoamGraphReponse} from "../../api";

export interface SidebarProps {
    isOpen: boolean
    onClose: any
    onOpen: any
    windowWidth: number
    graphData: OrgRoamGraphReponse
}

const FilesListBar = (props: SidebarProps) => {
    const {
        isOpen,
        onOpen,
        onClose,
        windowWidth,
        graphData,
    } = props;

    const {highlightColor} = useContext(ThemeContext)
    const [sidebarWidth, setSidebarWidth] = usePersistantState<number>('sidebarWidth', 400)

    const items = (list: Array<string>) => {
        return (
            list.map((item) => {
                return (<div>{item}</div>)
            })
        )
    };

    const filesList = graphData.nodes.map((node) => {
        return node.file;
    });

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
                            <Toolbar/>
                        </Flex>
                        <Flex flexDir="row" ml="auto">
                            <IconButton
                                // eslint-disable-next-line react/jsx-no-undef
                                m={1}
                                icon={<BiDotsVerticalRounded/>}
                                aria-label="Options"
                                variant="subtle"
                                onClick={(e) => {
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
