import React from 'react'
import {Flex, IconButton, ButtonGroup, Tooltip} from '@chakra-ui/react'
import {PlusSquareIcon, EditIcon, DeleteIcon, CalendarIcon} from '@chakra-ui/icons'

export interface ToolbarProps {
    createNewFile: any
    renameFile: any
    haveSelection: boolean
}

export const Toolbar = (props: ToolbarProps) => {
    const {
        createNewFile,
        renameFile,
        haveSelection,
    } = props
    return (
        <Flex flex="0 1 40px" pb={3} alignItems="center" justifyContent="space-between" pr={1}>
            <Flex>
                <ButtonGroup isAttached>
                    <Tooltip label="Create new">
                        <IconButton
                            _focus={{}}
                            variant="subtle"
                            icon={<PlusSquareIcon/>}
                            aria-label="Create new file"
                            onClick={createNewFile}
                        />
                    </Tooltip>
                    <Tooltip label="Edit selected">
                        <IconButton
                            _focus={{}}
                            variant="subtle"
                            icon={<CalendarIcon/>}
                            aria-label="Edit selected file"
                            disabled={!haveSelection}
                            onClick={() => {
                            }}
                        />
                    </Tooltip>
                    <Tooltip label="Rename selected">
                        <IconButton
                            _focus={{}}
                            variant="subtle"
                            icon={<EditIcon/>}
                            aria-label="Rename selected file"
                            disabled={!haveSelection}
                            onClick={renameFile}
                        />
                    </Tooltip>
                    <Tooltip label="Delete selected">
                        <IconButton
                            _focus={{}}
                            variant="subtle"
                            icon={<DeleteIcon/>}
                            aria-label="Delete selected file"
                            disabled={!haveSelection}
                            onClick={() => {
                            }}
                        />
                    </Tooltip>
                </ButtonGroup>
            </Flex>
        </Flex>
    )
}
