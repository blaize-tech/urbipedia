import { FC } from 'react';

import IconButton from '../IconButton';

import IconUndo from '../../images/icon-undo.svg';
import IconUndoHover from '../../images/icon-undo-hover.svg';
import IconUndoActive from '../../images/icon-undo-active.svg';
import IconRedo from '../../images/icon-redo.svg';
import IconRedoHover from '../../images/icon-redo-hover.svg';
import IconRedoActive from '../../images/icon-redo-active.svg';
import IconAlignJustify from '../../images/icon-align-justify.svg';
import IconAlignJustifyHover from '../../images/icon-align-justify-hover.svg';
import IconAlignJustifyActive from '../../images/icon-align-justify-active.svg';
import IconAlignLeft from '../../images/icon-align-left.svg';
import IconAlignLeftHover from '../../images/icon-align-left-hover.svg';
import IconAlignLeftActive from '../../images/icon-align-left-active.svg';
import IconAlignRight from '../../images/icon-align-right.svg';
import IconAlignRightHover from '../../images/icon-align-right-hover.svg';
import IconAlignRightActive from '../../images/icon-align-right-active.svg';
import IconAlignCenter from '../../images/icon-align-center.svg';
import IconAlignCenterHover from '../../images/icon-align-center-hover.svg';
import IconAlignCenterActive from '../../images/icon-align-center-active.svg';

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
        iconHover={IconUndoHover}
        iconActive={IconUndoActive}
      />

      <IconButton
        ariaLabel="Next node"
        className={styles.button}
        disabled={!canRedo}
        onClick={nextPreviewNode}
        title="Go forward"
        icon={IconRedo}
        iconHover={IconRedoHover}
        iconActive={IconRedoActive}
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
        iconHover={
          [
            IconAlignJustifyHover,
            IconAlignLeftHover,
            IconAlignRightHover,
            IconAlignCenterHover,
          ][justification]
        }
        iconActive={
          [
            IconAlignJustifyActive,
            IconAlignLeftActive,
            IconAlignRightActive,
            IconAlignCenterActive,
          ][justification]
        }
      />
    </div>
  );
};

export default Toolbar;
