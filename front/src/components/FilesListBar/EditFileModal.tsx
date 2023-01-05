import { FC, useContext, useEffect, useState } from 'react';
import { Item } from 'chakra-ui-autocomplete';
import { OrgRoamGraphReponse, OrgRoamNode } from '../../api';

import Modal from '../Modal';
import Input from '../Input';
import Select from '../Select';

import styles from './EditFileModal.module.scss';

interface EditFileModalProps {
  node: OrgRoamNode;
  onEdit: any;
  onClose: any;
  graphData: OrgRoamGraphReponse;
  isVisible: boolean;
}

const EditFileModal: FC<EditFileModalProps> = ({
  node,
  onEdit,
  onClose,
  graphData,
  isVisible,
}) => {
  const [newContent, setNewContent] = useState(node.content);
  const [showTrigger, setShowTrigger] = useState(false);

  const tagsOptionArray =
    graphData.tags.map((option) => ({ value: option, label: option })) || [];

  const [selectedItemsTags, setSelectedItemsTags] =
    useState<typeof tagsOptionArray>(
      node.tags.map((option) => ({ value: option, label: option })) || [],
    );

  const filesList = new Map<string, string>();

  graphData.nodes.map((node) => filesList.set(node.id, node.file));

  const linksOptionArray = new Array<Item>();

  for (let i = 0; i < graphData.nodes.length; i++) {
    const target = graphData.nodes[i];
    if (node.id !== target.id) {
      linksOptionArray.push({value: target.id, label: target.file});
    }
  }

  const selectedLinksOptionArrayLinks = new Array<Item>();

  for (let i = 0; i < graphData.links.length; i++) {
    const link = graphData.links[i];

    if (link.target === node.id) {
      selectedLinksOptionArrayLinks.push({
        value: link.source,
        label: String(filesList.get(link.source)),
      });
    } else if (link.source === node.id) {
      selectedLinksOptionArrayLinks.push({
        value: link.source,
        label: String(filesList.get(link.target)),
      });
    }
  }

  const [selectedItemsLinks, setSelectedItemsLinks] =
    useState<typeof selectedLinksOptionArrayLinks>(selectedLinksOptionArrayLinks
    );

  return (
    <Modal
      isVisible={isVisible}
      onSubmit={() => {
        onEdit(
          newContent,
          selectedItemsTags.map((item) => item.value),
          selectedItemsLinks.map((item) => item.value),
        );
      }}
      onClose={onClose}
      title={node.file}
    >
      <Input
        className={styles.input}
        type="textarea"
        title="Edit File:"
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
      />

      <Select
        className={styles.input}
        onCreate={(item) => {
          if (!graphData.tags.includes(item.value)) {
            setSelectedItemsTags((curr) => [...selectedItemsTags, item]);
            tagsOptionArray.push(item);
          }
        }}
        onChange={setSelectedItemsTags}
        title="Tags:"
        placeholder="Tag"
        itemList={tagsOptionArray}
        itemListselected={selectedItemsTags}
      />

      <Select
        className={styles.input}
        onChange={setSelectedItemsLinks}
        title="Links:"
        placeholder="links"
        itemList={linksOptionArray}
        itemListselected={selectedItemsLinks}
      />
    </Modal>
  );
};

export default EditFileModal;
