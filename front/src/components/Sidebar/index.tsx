import React, { useContext, useEffect, useRef, useState } from 'react'

import Toolbar from './Toolbar'
import { TagBar } from './TagBar'
import { Note } from './Note'
import { Title } from './Title'

import { VStack, Box } from '@chakra-ui/react'
import { Scrollbars } from 'react-custom-scrollbars-2'

import { NodeObject } from 'force-graph'
import { OrgRoamNode } from '../../api'
import { ThemeContext } from '../../util/themecontext'
import { LinksByNodeId, NodeByCite, NodeById, Scope } from '../../index'
import { Resizable } from 're-resizable'
import { usePersistantState } from '../../util/persistant-state'
import { initialFilter, TagColors } from '../config'

export interface SidebarProps {
  isOpen: boolean
  onClose: any
  onOpen: any
  nodeById: NodeById
  previewNode: NodeObject
  setPreviewNode: any
  linksByNodeId: LinksByNodeId
  nodeByCite: NodeByCite
  setSidebarHighlightedNode: any
  canUndo: any
  canRedo: any
  resetPreviewNode: any
  previousPreviewNode: any
  nextPreviewNode: any
  openContextMenu: any
  scope: Scope
  setScope: any
  windowWidth: number
  filter: typeof initialFilter
  setFilter: any
  tagColors: TagColors
  setTagColors: any
  macros?: { [key: string]: string }
  attachDir: string
  useInheritance: boolean
}

const Sidebar = (props: SidebarProps) => {
  const {
    isOpen,
    onOpen,
    onClose,
    previewNode,
    setPreviewNode,
    nodeById,
    linksByNodeId,
    nodeByCite,
    setSidebarHighlightedNode,
    canUndo,
    canRedo,
    resetPreviewNode,
    previousPreviewNode,
    nextPreviewNode,
    openContextMenu,
    scope,
    setScope,
    windowWidth,
    filter,
    setFilter,
    tagColors,
    setTagColors,
    macros,
    attachDir,
    useInheritance,
  } = props

  const { highlightColor } = useContext(ThemeContext)
  const [previewRoamNode, setPreviewRoamNode] = useState<OrgRoamNode | undefined>()
  const [sidebarWidth, setSidebarWidth] = usePersistantState<number>('sidebarWidth', 400)

  useEffect(() => {
    if (!previewNode?.id) {
      onClose()
      return
    }
    onOpen()
    setPreviewRoamNode(previewNode as OrgRoamNode)
  }, [previewNode?.id])

  const [justification, setJustification] = usePersistantState('justification', 1)
  const [outline, setOutline] = usePersistantState('outline', false)
  const justificationList = ['justify', 'start', 'end', 'center']
  const [collapse, setCollapse] = useState(false)

  return (
    <Resizable
      size={{ height: '100vh', width: sidebarWidth }}
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
      <Toolbar
        setJustification={setJustification}
        justification={justification}
        previousPreviewNode={previousPreviewNode}
        canUndo={canUndo}
        nextPreviewNode={nextPreviewNode}
        canRedo={canRedo}
      />

      <Scrollbars
        autoHide
        renderThumbVertical={({ style, ...props }) => (
          <Box
            style={{
              ...style,
              borderRadius: 0,
            }}
            {...props}
          />
        )}
      >
        {previewRoamNode && (
          <VStack
            flexGrow={1}
            // overflowY="scroll"
            alignItems="left"
            bg="alt.100"
            paddingLeft={4}
          >
            <Title previewNode={previewRoamNode} />
            <TagBar
              {...{ filter, setFilter, tagColors, setTagColors, openContextMenu, previewNode }}
            />
            <Note
              {...{
                setPreviewNode,
                previewNode,
                nodeById,
                nodeByCite,
                setSidebarHighlightedNode,
                justification,
                justificationList,
                linksByNodeId,
                openContextMenu,
                outline,
                setOutline,
                collapse,
                macros,
                attachDir,
                useInheritance,
              }}
            />
          </VStack>
        )}
      </Scrollbars>
    </Resizable>
  )
}

export default Sidebar
