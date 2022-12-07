import React from 'react'
import {Flex, IconButton, ButtonGroup, Tooltip} from '@chakra-ui/react'
import {ChevronLeftIcon, ChevronRightIcon} from '@chakra-ui/icons'

export interface ToolbarProps {
    // setJustification: any
}

export const Toolbar = (props: ToolbarProps) => {
    // const {
    //   // setJustification,
    // } = props
    return (
        <Flex flex="0 1 40px" pb={3} alignItems="center" justifyContent="space-between" pr={1}>
            <Flex>
                <ButtonGroup isAttached>
                    <Tooltip label="Go backward">
                        <IconButton
                            _focus={{}}
                            variant="subtle"
                            icon={<ChevronLeftIcon/>}
                            aria-label="Previous node"
                            disabled={false}
                            onClick={() => {}}
                        />
                    </Tooltip>
                </ButtonGroup>
            </Flex>
        </Flex>
    )
}
