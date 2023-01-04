import { FC, useState } from 'react';
import { NodeObject } from 'force-graph';

import { LinksByNodeId, NodeByCite, NodeById } from '../../index';
import { OrgRoamNode } from '../../api';
import { usePersistantState } from '../../util/persistant-state';
import { initialFilter, TagColors } from '../config';

import { TagBar } from './TagBar';
import { Note } from './Note';
import { Title } from './Title';

interface NodeProps {
  filter: typeof initialFilter;
  setFilter: any;
  tagColors: TagColors;
  setTagColors: any;
  previewRoamNode?: OrgRoamNode;
  setPreviewNode: any;
  previewNode: NodeObject;
  nodeById: NodeById;
  nodeByCite: NodeByCite;
  setSidebarHighlightedNode: any;
  justification: number;
  linksByNodeId: LinksByNodeId;
  macros?: { [key: string]: string };
  attachDir: string;
  useInheritance: boolean;
}

const justificationList = ['justify', 'start', 'end', 'center'];

const Node: FC<NodeProps> = ({
  filter,
  setFilter,
  tagColors,
  setTagColors,
  previewRoamNode,
  setPreviewNode,
  previewNode,
  nodeById,
  nodeByCite,
  setSidebarHighlightedNode,
  justification,
  linksByNodeId,
  macros,
  attachDir,
  useInheritance,
}) => {
  const [collapse, setCollapse] = useState(false);

  const [outline, setOutline] = usePersistantState('outline', false);

  return (
    <div>
      <Title previewNode={previewRoamNode} />

      <TagBar
        {...{ filter, setFilter, tagColors, setTagColors, previewNode }}
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
          outline,
          setOutline,
          collapse,
          macros,
          attachDir,
          useInheritance,
        }}
      />
    </div>
  );
};

export default Node;
