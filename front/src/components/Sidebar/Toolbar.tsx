import { FC } from 'react';
import { Tooltip } from '@chakra-ui/react';

import IconButton from '../IconButton';

import IconUndo from '../../images/icon-undo.svg';
import IconRedo from '../../images/icon-redo.svg';
import IconAlignJustify from '../../images/icon-align-justify.svg';
import IconAlignLeft from '../../images/icon-align-left.svg';
import IconAlignRight from '../../images/icon-align-right.svg';
import IconAlignCenter from '../../images/icon-align-center.svg';

import styles from './Toolbar.module.scss';

interface ToolbarProps {
  setJustification: (arg: any) => void;
  justification: number;
  previousPreviewNode: (arg: any) => void;
  canUndo: any;
  nextPreviewNode: (arg: any) => void;
  canRedo: any;
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
      <IconButton
        ariaLabel="Previous node"
        className={styles.button}
        disabled={!canUndo}
        onClick={previousPreviewNode}
        title="Go backward"
        icon={IconUndo}
      />

      <IconButton
        ariaLabel="Next node"
        className={styles.button}
        disabled={!canRedo}
        onClick={nextPreviewNode}
        title="Go forward"
        icon={IconRedo}
      />

      <IconButton
        ariaLabel="Justify content"
        className={styles.button}
        onClick={() => setJustification((curr: number) => (curr + 1) % 4)}
        title="Justify content"
        icon={
          [
            IconAlignJustify,
            IconAlignLeft,
            IconAlignRight,
            IconAlignCenter,
          ][justification]
        }
      />
    </div>
  );
};

export default Toolbar;
