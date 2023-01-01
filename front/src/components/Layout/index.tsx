import { FC } from 'react';
import { useWindowWidth } from '@react-hook/window-size';
import { NodeObject } from 'force-graph';

import { OrgRoamGraphReponse } from '../../api';
import { initialVisuals } from '../config';
import { LinksByNodeId, NodeByCite, NodeById } from '../../index';
import { initialFilter, TagColors } from '../config';

import FilesListBar from '../FilesListBar';
import Sidebar from '../Sidebar';

import styles from './Layout.module.scss';

interface LayoutProps {
  graphData: OrgRoamGraphReponse;
  visuals: typeof initialVisuals;
  children: any;
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
  openContextMenu: any;
  filter: typeof initialFilter;
  setFilter: any;
  tagColors: TagColors;
  setTagColors: any;
  macros?: { [key: string]: string };
  attachDir: string;
  useInheritance: boolean;
}

const Layout: FC<LayoutProps> = ({
  graphData,
  visuals,
  children,
  nodeById,
  previewNode,
  setPreviewNode,
  linksByNodeId,
  nodeByCite,
  setSidebarHighlightedNode,
  canUndo,
  canRedo,
  previousPreviewNode,
  nextPreviewNode,
  openContextMenu,
  filter,
  setFilter,
  tagColors,
  setTagColors,
  macros,
  attachDir,
  useInheritance,
}) => {
  const windowWidth = useWindowWidth();

  return (
    <div className={styles.container}>
      <FilesListBar
        windowWidth={windowWidth}
        graphData={graphData}
        visuals={visuals}
      />

      <div>
        {children}
      </div>

      <Sidebar
        nodeById={nodeById}
        previewNode={previewNode}
        setPreviewNode={setPreviewNode}
        linksByNodeId={linksByNodeId}
        nodeByCite={nodeByCite}
        setSidebarHighlightedNode={setSidebarHighlightedNode}
        canUndo={canUndo}
        canRedo={canRedo}
        previousPreviewNode={previousPreviewNode}
        nextPreviewNode={nextPreviewNode}
        openContextMenu={openContextMenu}
        windowWidth={windowWidth}
        filter={filter}
        setFilter={setFilter}
        tagColors={tagColors}
        setTagColors={setTagColors}
        macros={macros}
        attachDir={attachDir}
        useInheritance={useInheritance}
      />
    </div>
  );
};

export default Layout;
