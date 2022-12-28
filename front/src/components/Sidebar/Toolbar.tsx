import { FC } from 'react';
import { Tooltip } from '@chakra-ui/react';
import { BiAlignJustify, BiAlignLeft, BiAlignMiddle, BiAlignRight } from 'react-icons/bi'

import IconUndo from '../../images/icon-undo.svg';
import IconRedo from '../../images/icon-redo.svg';
import IconAlignJustify from '../../images/icon-align-justify.svg';
import IconAlignLeft from '../../images/icon-align-left.svg';
import IconAlignRight from '../../images/icon-align-right.svg';
import IconAlignCenter from '../../images/icon-align-center.svg';

import styles from './Toolbar.module.scss';

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
    <div className={styles.container}>
      <Tooltip label="Go backward">
        <button
          aria-label="Previous node"
          className={styles.button}
          disabled={!canUndo}
          onClick={previousPreviewNode}
          type="button"
        >
          <img src={IconUndo} alt="Go backward" height="16" width="16" />
        </button>
      </Tooltip>

      <Tooltip label="Go forward">
        <button
          aria-label="Next node"
          className={styles.button}
          disabled={!canRedo}
          onClick={nextPreviewNode}
          type="button"
        >
          <img src={IconRedo} alt="Go forward" height="16" width="16" />
        </button>
      </Tooltip>

      <Tooltip label="Justify content">
        <button
          aria-label="Justify content"
          className={styles.button}
          onClick={() => setJustification((curr: number) => (curr + 1) % 4)}
          type="button"
        >
          {
            [
              <img key="justify" src={IconAlignJustify} alt="Justify content" height="16" width="16" />,
              <img key="left" src={IconAlignLeft} alt="Justify content" height="16" width="16" />,
              <img key="right" src={IconAlignRight} alt="Justify content" height="16" width="16" />,
              <img key="center" src={IconAlignCenter} alt="Justify content" height="16" width="16" />,
            ][justification]
          }
        </button>
      </Tooltip>
    </div>
  );
};

export default Toolbar;
