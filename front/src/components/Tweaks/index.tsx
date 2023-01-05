import { FC, useContext } from 'react';
import { CloseIcon, RepeatClockIcon, SettingsIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
} from '@chakra-ui/react';
import Scrollbars from 'react-custom-scrollbars-2';

import {
  initialPhysics,
  initialFilter,
  initialVisuals,
  initialMouse,
  initialBehavior,
  initialLocal,
  TagColors,
  colorList,
  initialColoring,
} from '../config';
import { ThemeContext } from '../../util/themecontext';
import { usePersistantState } from '../../util/persistant-state';

import IconButton from '../IconButton';
import Modal from '../Modal';
import FilterPanel from './Filter/FilterPanel';
import { PhysicsPanel } from './Physics/PhysicsPanel';
import { BehaviorPanel } from './Behavior/BehaviorPanel';
import { VisualsPanel } from './Visual/VisualsPanel';

import IconTweaks from '../../images/icon-tweaks.svg';
import IconTweaksHover from '../../images/icon-tweaks-hover.svg';
import IconTweaksActive from '../../images/icon-tweaks-active.svg';

interface TweakProps {
  physics: typeof initialPhysics;
  setPhysics: any;
  threeDim: boolean;
  setThreeDim: (newValue: boolean) => void;
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

const Tweaks: FC<TweakProps> = ({
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
  tags,
  tagColors,
  setTagColors,
  coloring,
  setColoring,
  local,
  setLocal,
}) => {
  const [showTweaks, setShowTweaks] = usePersistantState('showTweaks', false);
  const { highlightColor, setHighlightColor } = useContext(ThemeContext);

  return (
    <>
      <IconButton
        ariaLabel="Settings"
        onClick={() => setShowTweaks(true)}
        title="Settings"
        icon={IconTweaks}
        iconHover={IconTweaksHover}
        iconActive={IconTweaksActive}
      />

      {showTweaks && (
        <Modal
          isVisible={showTweaks}
          resetAriaLabel="Reset Defaults"
          resetTitle="Reset settings to defaults"
          onReset={() => {
            setVisuals(initialVisuals);
            setFilter(initialFilter);
            setMouse(initialMouse);
            setPhysics(initialPhysics);
            setBehavior(initialBehavior);
            setColoring(initialColoring);
            setHighlightColor('purple.500');
            setLocal(initialLocal);
          }}
          onClose={() => setShowTweaks(false)}
          onTitleClick={() => setThreeDim(!threeDim)}
          titleTooltip={`Switch to ${threeDim ? '2D' : '3D'} view`}
          title={threeDim ? '3D' : '2D'}
        >
          <Scrollbars
            autoHeight
            autoHeightMax={0.85 * globalThis.innerHeight}
            autoHide
            renderThumbVertical={({ style, ...props }) => (
              <Box
                {...props}
                style={{
                  ...style,
                  borderRadius: 10,
                }}
                bg={highlightColor}
              />
            )}
          >
            <Accordion allowMultiple allowToggle color="black">
              <AccordionItem>
                <AccordionButton>
                  <AccordionIcon marginRight={2} />
                  <Heading size="sm">Filter</Heading>
                </AccordionButton>
                <AccordionPanel>
                  <FilterPanel
                    filter={filter}
                    setFilter={setFilter}
                    tagColors={tagColors}
                    setTagColors={setTagColors}
                    highlightColor={highlightColor}
                    colorList={colorList}
                    tags={tags}
                    {...{ local, setLocal }}
                  />
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton display="flex" justifyContent="space-between">
                  <Box display="flex">
                    <AccordionIcon marginRight={2} />
                    <Heading size="sm">Physics</Heading>
                  </Box>
                </AccordionButton>
                <AccordionPanel>
                  <PhysicsPanel physics={physics} setPhysics={setPhysics} />
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton>
                  <AccordionIcon marginRight={2} />
                  <Heading size="sm">Visual</Heading>
                </AccordionButton>
                <AccordionPanel>
                  <VisualsPanel
                    visuals={visuals}
                    setVisuals={setVisuals}
                    highlightColor={highlightColor}
                    setHighlightColor={setHighlightColor}
                    threeDim={threeDim}
                    {...{
                      coloring,
                      setColoring,
                    }}
                  />
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton>
                  <AccordionIcon marginRight={2} />
                  <Heading size="sm">Behavior</Heading>
                </AccordionButton>
                <AccordionPanel>
                  <BehaviorPanel
                    behavior={behavior}
                    setBehavior={setBehavior}
                    mouse={mouse}
                    setMouse={setMouse}
                  />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Scrollbars>
        </Modal>
      )}
    </>
  );
};

export default Tweaks;
