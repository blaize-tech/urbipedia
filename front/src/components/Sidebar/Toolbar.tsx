import { FC } from 'react';
import { Flex, IconButton, ButtonGroup, Tooltip } from '@chakra-ui/react'
import { BiAlignJustify, BiAlignLeft, BiAlignMiddle, BiAlignRight } from 'react-icons/bi'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { IoIosListBox, IoMdListBox } from 'react-icons/io'

interface ToolbarProps {
  setJustification: any
  justification: number
  previousPreviewNode: any
  canUndo: any
  nextPreviewNode: any
  canRedo: any
}

const Toolbar: FC<ToolbarProps> = ({
  setJustification,
  justification,
  previousPreviewNode,
  canUndo,
  nextPreviewNode,
  canRedo,
}) => {
  return (
    <Flex flex="0 1 40px" pb={3} alignItems="center" justifyContent="space-between" pr={1}>
      <Flex>
        <ButtonGroup isAttached>
          <Tooltip label="Go backward">
            <IconButton
              _focus={{}}
              variant="subtle"
              icon={<ChevronLeftIcon />}
              aria-label="Previous node"
              disabled={!canUndo}
              onClick={() => previousPreviewNode()}
            />
          </Tooltip>
          <Tooltip label="Go forward">
            <IconButton
              _focus={{}}
              variant="subtle"
              icon={<ChevronRightIcon />}
              aria-label="Next node"
              disabled={!canRedo}
              onClick={() => nextPreviewNode()}
            />
          </Tooltip>
        </ButtonGroup>
      </Flex>
      <Flex>
        <Tooltip label="Justify content">
          <IconButton
            variant="subtle"
            aria-label="Justify content"
            icon={
              [
                <BiAlignJustify key="justify" />,
                <BiAlignLeft key="left" />,
                <BiAlignRight key="right" />,
                <BiAlignMiddle key="center" />,
              ][justification]
            }
            onClick={() => setJustification((curr: number) => (curr + 1) % 4)}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default Toolbar;
