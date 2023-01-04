import { FC, useState } from 'react';
import { NodeObject } from 'force-graph';
import CSS from 'csstype';

import { LinksByNodeId, NodeByCite, NodeById } from '../../index';
import { OrgRoamNode } from '../../api';
import { usePersistantState } from '../../util/persistant-state';
import { initialFilter, TagColors } from '../config';
import { UniOrg } from '../../util/uniorg';

import { Backlinks } from './Backlinks';
import { TagBar } from './TagBar';

import styles from './Node.module.scss';

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

const justificationList: CSS.Properties[] = [
  { textAlign: 'justify' },
  { textAlign: 'start' },
  { textAlign: 'end' },
  { textAlign: 'center' },
];

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
    <div className={styles.container}>
      {previewRoamNode?.title && (
        <h3 className={styles.title}>{previewRoamNode.title}</h3>
      )}

      <TagBar
        {...{ filter, setFilter, tagColors, setTagColors, previewNode }}
      />

      {previewNode?.id && (
        <div style={justificationList[justification]}>
          <div className={styles.content}>
            <UniOrg
              {...{
                setPreviewNode,
                previewNode,
                nodeByCite,
                setSidebarHighlightedNode,
                outline,
                collapse,
                nodeById,
                linksByNodeId,
                macros,
                attachDir,
                useInheritance,
              }}
            />
          </div>

          <Backlinks
            {...{
              setPreviewNode,
              previewNode,
              nodeById,
              linksByNodeId,
              nodeByCite,
              setSidebarHighlightedNode,
              outline,
              attachDir,
              useInheritance,
            }}
            macros={macros || {}}
          />
        </div>
      )}
    </div>
  );
};

export default Node;
