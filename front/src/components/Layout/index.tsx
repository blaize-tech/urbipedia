import { FC } from 'react';
import { NodeObject } from 'force-graph';

import { OrgRoamGraphReponse } from '../../api';
import { LinksByNodeId, NodeByCite, NodeById } from '../../index';
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

import FilesListBar from '../FilesListBar';
import IconButton from '../IconButton';
import Sidebar from '../Sidebar';

import IconExit from '../../images/icon-exit.svg';
import IconExitHover from '../../images/icon-exit-hover.svg';
import IconExitActive from '../../images/icon-exit-active.svg';

import styles from './Layout.module.scss';

interface LayoutProps {
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
  children: any;
  nodeIds: string[];
  onExit: (arr: any) => void;
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
  macros?: { [key: string]: string };
  attachDir: string;
  useInheritance: boolean;
}

const Layout: FC<LayoutProps> = ({
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
  children,
  nodeIds,
  onExit,
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

      <div className={styles.content}>
        {children}
      </div>

      <IconButton
        ariaLabel="Exit local mode"
        className={styles.button}
        disabled={!nodeIds.length}
        onClick={onExit}
        title="Return to main graph"
        icon={IconExit}
        iconHover={IconExitHover}
        iconActive={IconExitActive}
      />

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
        filter={filter}
        setFilter={setFilter}
        tagColors={tagColors}
        macros={macros}
        attachDir={attachDir}
        useInheritance={useInheritance}
      />
    </div>
  );
};

export default Layout;
