import { FC } from 'react';
import cn from 'classnames';

import {
  initialPhysics,
  initialFilter,
  initialVisuals,
  initialMouse,
  initialBehavior,
  initialLocal,
  TagColors,
  initialColoring,
} from '../config';

import Tweaks from '../Tweaks';

import styles from './Menu.module.scss';

interface MenuProps {
  className: string;
  physics: typeof initialPhysics;
  setPhysics: any;
  threeDim: boolean;
  setThreeDim: (value: boolean) => void;
  filter: typeof initialFilter;
  setFilter: any;
  visuals: typeof initialVisuals;
  setVisuals: any;
  mouse: typeof initialMouse;
  setMouse: any;
  behavior: typeof initialBehavior;
  setBehavior: any;
  tags: string[];
  tagColors: TagColors;
  setTagColors: any;
  coloring: typeof initialColoring;
  setColoring: any;
  local: typeof initialLocal;
  setLocal: any;
}

const Menu: FC<MenuProps> = ({
  className,
  physics,
  setPhysics,
  threeDim,
  setThreeDim,
  filter,
  setFilter,
  visuals,
  setVisuals,
  mouse,
  setMouse,
  behavior,
  setBehavior,
  tagColors,
  setTagColors,
  coloring,
  setColoring,
  local,
  setLocal,
  tags,
}) => {
  return (
    <ul className={cn(styles.container, className)}>
      <li className={styles.item}>
        <label className={styles.label}>
          <Tweaks
            visuals={visuals}
            physics={physics}
            setPhysics={setPhysics}
            threeDim={threeDim}
            setThreeDim={setThreeDim}
            filter={filter}
            setFilter={setFilter}
            setVisuals={setVisuals}
            mouse={mouse}
            setMouse={setMouse}
            behavior={behavior}
            setBehavior={setBehavior}
            tagColors={tagColors}
            setTagColors={setTagColors}
            coloring={coloring}
            setColoring={setColoring}
            local={local}
            setLocal={setLocal}
            tags={tags}
          />

          <span className={styles.text}>Settings</span>
        </label>
      </li>
    </ul>
  );
};

export default Menu;
