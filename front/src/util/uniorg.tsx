import { FC, useEffect, useState } from 'react';
import { LinksByNodeId, NodeByCite, NodeById } from '../index';
import { ProcessedOrg } from './processOrg';
import { getFileContent } from './urbit';

interface UniOrgProps {
  nodeById: NodeById;
  previewNode: any;
  setPreviewNode: any;
  nodeByCite: NodeByCite;
  setSidebarHighlightedNode: any;
  outline: boolean;
  collapse: boolean;
  linksByNodeId: LinksByNodeId;
  macros?: { [key: string]: string };
  attachDir: string;
  useInheritance: boolean;
}

const UniOrg: FC<UniOrgProps> = ({
  setSidebarHighlightedNode,
  nodeById,
  nodeByCite,
  previewNode,
  setPreviewNode,
  outline,
  collapse,
  linksByNodeId,
  macros,
  attachDir,
  useInheritance,
}) => {
  const [previewText, setPreviewText] = useState<string>('');

  const id = encodeURIComponent(encodeURIComponent(previewNode.id));

  useEffect(() => {
    getFileContent(id)
      .then((res) => res)
      .then((res) => {
        if (res === '') {
          return '(empty node)';
        }

        if (res !== 'error') {
          console.log(res);

          setPreviewText(res);
        }
      })
      .catch((e) => {
        setPreviewText('(could not find node)');

        console.log(e);

        return 'Could not fetch the text for some reason, sorry!\n\n This can happen because you have an id with forward slashes (/) in it.';
      })
  }, [previewNode.id]);

  return previewText && previewNode && (
    <ProcessedOrg
      {...{
        nodeById,
        previewNode,
        setPreviewNode,
        previewText,
        nodeByCite,
        setSidebarHighlightedNode,
        outline,
        collapse,
        linksByNodeId,
        attachDir,
        useInheritance,
      }}
      macros={macros || {}}
    />
  );
};

export default UniOrg;
