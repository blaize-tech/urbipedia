import React, {useContext, useState} from 'react'
import {Textarea} from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader, ModalCloseButton, ModalBody, VStack, Text, ModalFooter, Button
} from '@chakra-ui/react'
import {CUIAutoComplete} from "chakra-ui-autocomplete";
import {ThemeContext} from "../../util/themecontext";

export interface ToolbarProps {
    fileName: string
    content: string
    onEdit: any
    onClose: any
    showModal: boolean
    tags: Array<string>
    allTags: Array<string>
}

export const EditFileModal = (props: ToolbarProps) => {
    const {
        fileName,
        content,
        onEdit,
        onClose,
        showModal,
        tags,
        allTags,
    } = props;
    const {highlightColor} = useContext(ThemeContext)
    const [newContent, setNewContent] = useState(content);
    const [newTags, setNewTags] = useState(tags);

    const optionArray =
        allTags.map((option) => {
            return {value: option, label: option}
        }) || [];

    const [selectedItems, setSelectedItems] = useState<typeof optionArray>(
        tags.map((option) => {
            return {
                value: option,
                label: option,
            }
        }) || [],
    );

    return (
        <Modal
            isCentered
            isOpen={showModal}
            onClose={() => onClose()}
        >
            <ModalOverlay/>
            <ModalContent zIndex="popover">
                <ModalHeader>{fileName}</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <VStack spacing={4} display="flex" alignItems="flex-start">
                        <Text>Edit file:</Text>
                        <Textarea value={newContent} onChange={(e) => {
                            setNewContent(e.target.value);
                        }}/>
                        <CUIAutoComplete
                            labelStyleProps={{fontWeight: 300, fontSize: 14}}
                            items={optionArray}
                            label={`Add tag:`}
                            placeholder=" "
                            onCreateItem={(item) => null}
                            disableCreateItem={true}
                            selectedItems={selectedItems}
                            onSelectedItemsChange={(changes) => {
                                if (changes.selectedItems) {
                                    setNewTags(changes.selectedItems.map((item)=>{
                                        return item.value;
                                    }));
                                    setSelectedItems(changes.selectedItems);
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
                            hideToggleButton
                            itemRenderer={(selected) => selected.label}
                        />
                        <Text>Links:</Text>
                        <Text>Todo</Text>
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
                                onEdit(newContent, newTags);
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
