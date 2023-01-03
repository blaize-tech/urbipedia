import { FC, useContext, useEffect, useState } from 'react';
import { Textarea } from '@chakra-ui/react';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Text,
  ModalFooter,
  Button
} from '@chakra-ui/react';
import { CUIAutoComplete, Item } from 'chakra-ui-autocomplete';
import { ThemeContext } from '../../util/themecontext';
import { OrgRoamGraphReponse, OrgRoamNode } from '../../api';

import Modal from '../Modal';

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
  const { highlightColor } = useContext(ThemeContext);
  const [newContent, setNewContent] = useState(node.content);
  const [showTrigger, setShowTrigger] = useState(false);

  useEffect(() => setShowTrigger(isVisible), [isVisible]);

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
    useState<typeof selectedLinksOptionArrayLinks>(
      selectedLinksOptionArrayLinks
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
      <VStack spacing={4} display="flex" alignItems="flex-start">
        <Text>Edit file:</Text>

        <Textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />

        <CUIAutoComplete
          labelStyleProps={{ fontWeight: 300, fontSize: 14 }}
          items={tagsOptionArray}
          label="Tags:"
          placeholder="Tag"
          onCreateItem={(item) => {
            if (!graphData.tags.includes(item.value)) {
              setSelectedItemsTags((curr) => [...selectedItemsTags, item]);
              tagsOptionArray.push(item);
            }
          }}
          disableCreateItem={false}
          selectedItems={selectedItemsTags}
          onSelectedItemsChange={(changes) => {
            if (changes.selectedItems) {
              setSelectedItemsTags(changes.selectedItems);
            }
          }}
          listItemStyleProps={{ overflow: 'hidden' }}
          highlightItemBg="gray.400"
          toggleButtonStyleProps={{ variant: 'outline' }}
          inputStyleProps={{
            mt: 2,
            height: 8,
            focusBorderColor: highlightColor,
            color: 'gray.800',
            borderColor: 'gray.500',
          }}
          tagStyleProps={{
            justifyContent: 'flex-start',
            fontSize: 10,
            borderColor: highlightColor,
            borderWidth: 1,
            borderRadius: 'md',
            color: highlightColor,
            bg: '',
            height: 4,
            mb: 2,
          }}
          itemRenderer={(selected) => selected.label}
        />

        <CUIAutoComplete
            labelStyleProps={{ fontWeight: 300, fontSize: 14 }}
            items={linksOptionArray}
            label="Links:"
            placeholder="links"
            onCreateItem={(item) => null}
            disableCreateItem={true}
            selectedItems={selectedItemsLinks}
            onSelectedItemsChange={(changes) => {
              if (changes.selectedItems) {
                setSelectedItemsLinks(changes.selectedItems);
              }
            }}
            listItemStyleProps={{ overflow: 'hidden' }}
            highlightItemBg="gray.400"
            toggleButtonStyleProps={{ variant: 'outline' }}
            inputStyleProps={{
              mt: 2,
              height: 8,
              focusBorderColor: highlightColor,
              color: 'gray.800',
              borderColor: 'gray.500',
            }}
            tagStyleProps={{
              justifyContent: 'flex-start',
              fontSize: 10,
              borderColor: highlightColor,
              borderWidth: 1,
              borderRadius: 'md',
              color: highlightColor,
              bg: '',
              height: 4,
              mb: 2,
            }}
            itemRenderer={(selected) => selected.label}
        />
      </VStack>
    </Modal>
  );
};

export default EditFileModal;
