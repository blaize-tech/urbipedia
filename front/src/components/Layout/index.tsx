import { FC } from 'react';
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
  return (
    <div className={styles.container}>
      <FilesListBar
        className={styles.sidebar}
        graphData={graphData}
        visuals={visuals}
      />

      <div className={styles.content}>
        {children}
      </div>

      <Sidebar
        className={styles.sidebar}
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
