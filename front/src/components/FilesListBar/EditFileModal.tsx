import React, {useContext, useState} from 'react'
import {Textarea} from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader, ModalCloseButton, ModalBody, VStack, Text, ModalFooter, Button
} from '@chakra-ui/react'
import {CUIAutoComplete, Item} from "chakra-ui-autocomplete";
import {ThemeContext} from "../../util/themecontext";
import {OrgRoamGraphReponse, OrgRoamNode} from "../../api";

export interface ToolbarProps {
    node: OrgRoamNode
    onEdit: any
    onClose: any
    showModal: boolean
    graphData: OrgRoamGraphReponse
}

export const EditFileModal = (props: ToolbarProps) => {
    const {
        onEdit,
        onClose,
        showModal,
        graphData,
        node,
    } = props;
    const {highlightColor} = useContext(ThemeContext)
    const [newContent, setNewContent] = useState(node.content);

    const tagsOptionArray =
        graphData.tags.map((option) => {
            return {value: option, label: option}
        }) || [];

    const [selectedItemsTags, setSelectedItemsTags] = useState<typeof tagsOptionArray>(
        node.tags.map((option) => {
            return {
                value: option,
                label: option,
            }
        }) || [],
    );

    const filesList = new Map<string, string>();
    graphData.nodes.map((node) => {
        filesList.set(node.id, node.file);
    });

    const linksOptionArray = new Array<Item>();
    for (let i = 0; i < graphData.nodes.length; i++) {
        const target = graphData.nodes[i];
        if (node.id !== target.id) {
            linksOptionArray.push({value: target.id, label: target.file});
        }
    }

    const selectedLinksOptionArrayParents = new Array<Item>();
    const selectedLinksOptionArrayChildren = new Array<Item>();
    for (let i = 0; i < graphData.links.length; i++) {
        const link = graphData.links[i];
        if (link.source === node.id) {
            selectedLinksOptionArrayChildren.push({
                value: link.target,
                label: String(filesList.get(link.target)),
            });
        } else if (link.target === node.id) {
            selectedLinksOptionArrayParents.push({
                value: link.source,
                label: String(filesList.get(link.source)),
            });
        }
    }

    const [selectedItemsLinksParents, setSelectedItemsLinksParents] = useState<typeof selectedLinksOptionArrayParents>(selectedLinksOptionArrayParents);
    const [selectedItemsLinksChildren, setSelectedItemsLinksChildren] = useState<typeof selectedLinksOptionArrayChildren>(selectedLinksOptionArrayChildren);

    return (
        <Modal
            isCentered
            isOpen={showModal}
            onClose={() => onClose()}
        >
            <ModalOverlay/>
            <ModalContent zIndex="popover">
                <ModalHeader>{node.file}</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <VStack spacing={4} display="flex" alignItems="flex-start">
                        <Text>Edit file:</Text>
                        <Textarea value={newContent} onChange={(e) => {
                            setNewContent(e.target.value);
                        }}/>
                        <CUIAutoComplete
                            labelStyleProps={{fontWeight: 300, fontSize: 14}}
                            items={tagsOptionArray}
                            label={`Tags:`}
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
                            listItemStyleProps={{overflow: 'hidden'}}
                            highlightItemBg="gray.400"
                            toggleButtonStyleProps={{variant: 'outline'}}
                            inputStyleProps={{
                                mt: 2,
                                height: 8,
                                focusBorderColor: highlightColor,
                                color: 'gray.800',
                                borderColor: 'gray.500',
                            }}
                            tagStyleProps={{
                                justifyContent: 'flex-start',
                                //variant: 'subtle',
                                fontSize: 10,
                                borderColor: highlightColor,
                                borderWidth: 1,
                                borderRadius: 'md',
                                color: highlightColor,
                                bg: '',
                                height: 4,
                                mb: 2,
                                //paddingLeft: 4,
                                //fontWeight: 'bold',
                            }}
                            itemRenderer={(selected) => selected.label}
                        />
                        <CUIAutoComplete
                            labelStyleProps={{fontWeight: 300, fontSize: 14}}
                            items={linksOptionArray}
                            label={`Links parents:`}
                            placeholder="parent"
                            onCreateItem={(item) => null}
                            disableCreateItem={true}
                            selectedItems={selectedItemsLinksParents}
                            onSelectedItemsChange={(changes) => {
                                if (changes.selectedItems) {
                                    setSelectedItemsLinksParents(changes.selectedItems);
                                }
                            }}
                            listItemStyleProps={{overflow: 'hidden'}}
                            highlightItemBg="gray.400"
                            toggleButtonStyleProps={{variant: 'outline'}}
                            inputStyleProps={{
                                mt: 2,
                                height: 8,
                                focusBorderColor: highlightColor,
                                color: 'gray.800',
                                borderColor: 'gray.500',
                            }}
                            tagStyleProps={{
                                justifyContent: 'flex-start',
                                //variant: 'subtle',
                                fontSize: 10,
                                borderColor: highlightColor,
                                borderWidth: 1,
                                borderRadius: 'md',
                                color: highlightColor,
                                bg: '',
                                height: 4,
                                mb: 2,
                                //paddingLeft: 4,
                                //fontWeight: 'bold',
                            }}
                            itemRenderer={(selected) => selected.label}
                        />
                        <CUIAutoComplete
                            labelStyleProps={{fontWeight: 300, fontSize: 14}}
                            items={linksOptionArray}
                            label={`Links children:`}
                            placeholder="children"
                            onCreateItem={(item) => null}
                            disableCreateItem={true}
                            selectedItems={selectedItemsLinksChildren}
                            onSelectedItemsChange={(changes) => {
                                if (changes.selectedItems) {
                                    setSelectedItemsLinksChildren(changes.selectedItems);
                                }
                            }}
                            listItemStyleProps={{overflow: 'hidden'}}
                            highlightItemBg="gray.400"
                            toggleButtonStyleProps={{variant: 'outline'}}
                            inputStyleProps={{
                                mt: 2,
                                height: 8,
                                focusBorderColor: highlightColor,
                                color: 'gray.800',
                                borderColor: 'gray.500',
                            }}
                            tagStyleProps={{
                                justifyContent: 'flex-start',
                                //variant: 'subtle',
                                fontSize: 10,
                                borderColor: highlightColor,
                                borderWidth: 1,
                                borderRadius: 'md',
                                color: highlightColor,
                                bg: '',
                                height: 4,
                                mb: 2,
                                //paddingLeft: 4,
                                //fontWeight: 'bold',
                            }}
                            itemRenderer={(selected) => selected.label}
                        />
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button
                        mr={3}
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="link"
                        colorScheme="red"
                        ml={3}
                        onClick={() => {
                            if (!!onEdit) {
                                onEdit(
                                    newContent,
                                    selectedItemsTags.map((item) => {
                                        return item.value;
                                    }),
                                    selectedItemsLinksParents.map((item) => {
                                        return item.value;
                                    }),
                                    selectedItemsLinksChildren.map((item) => {
                                        return item.value;
                                    })
                                );
                            }
                        }}
                    >
                        Ok
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
