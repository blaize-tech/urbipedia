import { FC } from 'react';
import { NodeObject, LinkObject } from 'force-graph';

import { LinksByNodeId, NodeByCite, NodeById } from '../../index';
import { normalizeLinkEnds } from '../../util/normalizeLinkEnds';
import { OrgRoamNode } from '../../api';

import { PreviewLink } from './Link';

import styles from './Backlinks.module.scss';

interface BacklinksProps {
  previewNode: NodeObject | OrgRoamNode;
  setPreviewNode: any;
  nodeById: NodeById;
  linksByNodeId: LinksByNodeId;
  nodeByCite: NodeByCite;
  setSidebarHighlightedNode: OrgRoamNode;
  outline: boolean;
  attachDir: string;
  useInheritance: boolean;
  macros: { [key: string]: string };
}

const Backlinks: FC<BacklinksProps> = ({
  previewNode,
  setPreviewNode,
  setSidebarHighlightedNode,
  nodeById,
  linksByNodeId,
  nodeByCite,
  outline,
  macros,
  attachDir,
  useInheritance,
}) => {
  const links = linksByNodeId[(previewNode as OrgRoamNode)?.id] ?? [];

  const backLinks = links
    .filter((link: LinkObject) => {
      const [source, target] = normalizeLinkEnds(link);

      return source !== previewNode?.id || target !== previewNode?.id;
    })
    .map((link) => {
      if (link.source == previewNode?.id) {
        return link.target;
      } else {
        return link.source;
      }
    });

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>
        {`Linked references (${backLinks.length})`}
      </h4>

      <ul className={styles.list}>
        {previewNode?.id && backLinks.map((link) => {
          const title = nodeById[link as string]?.title ?? '';

          return (
            <li className={styles.listItem} key={link}>
              <PreviewLink
                linksByNodeId={linksByNodeId}
                nodeByCite={nodeByCite}
                setSidebarHighlightedNode={setSidebarHighlightedNode}
                href={`id:${link as string}`}
                nodeById={nodeById}
                previewNode={previewNode}
                setPreviewNode={setPreviewNode}
                outline={outline}
                noUnderline
                {...{ attachDir, useInheritance, macros }}
              >
                {nodeById[link as string]?.title}
              </PreviewLink>
            </li>
          )})}
      </ul>
    </div>
  );
};

export default Backlinks;
