import { FC } from 'react';
import { NodeObject } from 'force-graph';
import { useTheme } from '@chakra-ui/react';

import { initialFilter, TagColors } from '../config';
import { getThemeColor } from '../../util/getThemeColor';
import { OrgRoamNode } from '../../api';

import IconHidden from '../../images/icon-hidden.svg';
import IconVisible from '../../images/icon-visible.svg';

import styles from './TagBar.module.scss';

interface TagBarProps {
  filter: typeof initialFilter;
  setFilter: any;
  tagColors: TagColors;
  previewNode: NodeObject;
}

const TagBar: FC<TagBarProps> = ({
  filter,
  setFilter,
  tagColors,
  previewNode,
}) => {
  const theme = useTheme();

  const node = previewNode as OrgRoamNode;

  return node?.tags?.[0] !== null ? (
    <div className={styles.container}>
      {node?.tags?.map((tag: string) => {
        const bl: string[] = filter.tagsBlacklist ?? [];
        const wl: string[] = filter.tagsWhitelist ?? [];
        const blackList: boolean = bl.includes(tag);
        const whiteList = wl.includes(tag);

        return (
          <button
            className={styles.button}
            onClick={() => {
              if (blackList) {
                setFilter((filter: typeof initialFilter) => ({
                  ...filter,
                  tagsBlacklist: filter.tagsBlacklist.filter((t) => t !== tag),
                  tagsWhitelist: [...filter.tagsWhitelist, tag],
                }));

                return;
              }

              if (whiteList) {
                setFilter((filter: typeof initialFilter) => ({
                  ...filter,
                  tagsWhitelist: filter.tagsWhitelist.filter((t) => t !== tag),
                }));

                return;
              }

              setFilter((filter: typeof initialFilter) => ({
                ...filter,
                tagsBlacklist: [...filter.tagsBlacklist, tag],
              }));
            }}
            style={tagColors[tag] ? {
              borderColor: getThemeColor(tagColors[tag], theme),
              color: getThemeColor(tagColors[tag], theme),
            }: undefined}
            type="button"
          >
            <span>{tag}</span>

            {blackList && (
              <img height="20" width="20" src={IconHidden} alt="" />
            )}

            {whiteList && (
              <img height="20" width="20" src={IconVisible} alt="" />
            )}
          </button>
        )
      })}
    </div>
  ) : null;
};

export default TagBar;
