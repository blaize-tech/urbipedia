import React, {useContext, useState} from 'react'
import {
    Flex,
    IconButton,
    ButtonGroup,
    Tooltip,
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader, ModalCloseButton, ModalBody, VStack, Text, ModalFooter, Button
} from '@chakra-ui/react'
import {PlusSquareIcon, EditIcon, DeleteIcon, CalendarIcon} from '@chakra-ui/icons'
import {deleteNodeInEmacs} from "../../util/webSocketFunctions";

export interface ToolbarProps {
    name: string
    onRename: any
    onClose: any
    showModal: boolean
}

export const RenameModal = (props: ToolbarProps) => {
    const {
        name,
        onRename,
        onClose,
        showModal,
    } = props;
    const [value, setValue] = useState(name);
    return (
        <Modal isCentered isOpen={showModal} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent zIndex="popover">
                <ModalHeader>Rename file:</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <VStack spacing={4} display="flex" alignItems="flex-start">
                        <input type="text" value={value} onChange={(e) => {
                            setValue(e.target.value);
                        }}/>
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
                            if (!!onRename) {
                                onRename(value);
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
