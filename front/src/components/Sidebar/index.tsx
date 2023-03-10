import { FC, useEffect, useState } from 'react';
import { useWindowWidth } from '@react-hook/window-size';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { NodeObject } from 'force-graph';
import { Resizable } from 're-resizable';
import { Box } from '@chakra-ui/react';
import cn from 'classnames';

import { OrgRoamNode } from '../../api';
import { LinksByNodeId, NodeByCite, NodeById } from '../../index';
import { usePersistantState } from '../../util/persistant-state';
import { initialFilter, TagColors } from '../config';

import Toolbar from './Toolbar';
import Node from './Node';

import styles from './Sidebar.module.scss';

interface SidebarProps {
  className: string;
  nodeById: NodeById;
  previewNode: NodeObject;
  setPreviewNode: any;
  linksByNodeId: LinksByNodeId;
  nodeByCite: NodeByCite;
  setSidebarHighlightedNode: any;
  canUndo: any;
  canRedo: any;
  previousPreviewNode: any;
  nextPreviewNode: any;
  filter: typeof initialFilter;
  setFilter: any;
  tagColors: TagColors;
  macros?: { [key: string]: string };
  attachDir: string;
  useInheritance: boolean;
}

const Sidebar: FC<SidebarProps> = ({
  className,
  previewNode,
  setPreviewNode,
  nodeById,
  linksByNodeId,
  nodeByCite,
  setSidebarHighlightedNode,
  canUndo,
  canRedo,
  previousPreviewNode,
  nextPreviewNode,
  filter,
  setFilter,
  tagColors,
  macros,
  attachDir,
  useInheritance,
}) => {
  const [previewRoamNode, setPreviewRoamNode] = useState<OrgRoamNode | undefined>();
  const [sidebarWidth, setSidebarWidth] = usePersistantState<number>('sidebarWidth', 400);
  const windowWidth = useWindowWidth();

  useEffect(() => {
    if (previewNode?.id) {
      setPreviewRoamNode(previewNode as OrgRoamNode);
    }
  }, [previewNode?.id]);

  const [justification, setJustification] = usePersistantState('justification', 1);

  return (
    <Resizable
      onResizeStop={(e, direction, ref, d) => {
        setSidebarWidth((curr: number) => curr + d.width);
      }}
      className={cn(styles.container, className)}
      maxWidth={windowWidth - 200}
      minWidth="250px"
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
      size={{ height: '100vh', width: sidebarWidth }}
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
          <Node
            filter={filter}
            setFilter={setFilter}
            tagColors={tagColors}
            previewRoamNode={previewRoamNode}
            setPreviewNode={setPreviewNode}
            previewNode={previewNode}
            nodeById={nodeById}
            nodeByCite={nodeByCite}
            setSidebarHighlightedNode={setSidebarHighlightedNode}
            justification={justification}
            linksByNodeId={linksByNodeId}
            macros={macros}
            attachDir={attachDir}
            useInheritance={useInheritance}
          />
        )}
      </Scrollbars>
    </Resizable>
  );
};

export default Sidebar;
