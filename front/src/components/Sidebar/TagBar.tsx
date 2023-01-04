import { FC } from 'react';
import { NodeObject } from 'force-graph';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Flex, Tag, TagLabel, TagRightIcon } from '@chakra-ui/react';

import { initialFilter, TagColors } from '../config';
import { OrgRoamNode } from '../../api';

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
  const node = previewNode as OrgRoamNode;

  return node?.tags?.[0] !== null ? (
    <Flex mb={2} flexWrap="wrap">
      {node?.tags?.map?.((tag: string) => {
        const bl: string[] = filter.tagsBlacklist ?? []
        const wl: string[] = filter.tagsWhitelist ?? []
        const blackList: boolean = bl.includes(tag)
        const whiteList = wl.includes(tag)
        return (
          <Tag
            tabIndex={0}
            mr={2}
            mt={2}
            cursor="pointer"
            onClick={() => {
              if (blackList) {
                setFilter((filter: typeof initialFilter) => ({
                  ...filter,
                  tagsBlacklist: filter.tagsBlacklist.filter((t) => t !== tag),
                  tagsWhitelist: [...filter.tagsWhitelist, tag],
                }))
                return
              }
              if (whiteList) {
                setFilter((filter: typeof initialFilter) => ({
                  ...filter,
                  tagsWhitelist: filter.tagsWhitelist.filter((t) => t !== tag),
                }))
                return
              }

              setFilter((filter: typeof initialFilter) => ({
                ...filter,
                tagsBlacklist: [...filter.tagsBlacklist, tag],
              }))
            }}
            size="sm"
            key={tag}
            variant="outline"
            colorScheme={tagColors[tag]?.replaceAll(/(.*?)\..*/g, '$1') || undefined}
          >
            <TagLabel>{tag}</TagLabel>
            {blackList ? (
              <TagRightIcon as={ViewOffIcon} />
            ) : whiteList ? (
              <TagRightIcon as={ViewIcon} />
            ) : null}
          </Tag>
        )
      })}
    </Flex>
  ) : null;
};

export default TagBar;
