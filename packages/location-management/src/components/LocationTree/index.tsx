import React, { ChangeEvent, useState, useEffect } from 'react';
import { Input, Tree as AntTree } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { AntTreeProps } from '../LocationUnitList';
import './tree.css';
import { ParsedHierarchyNode } from '../../ducks/locationHierarchy/types';
import { useTranslation } from '../../mls';
import TreeModel from 'tree-model';
import { Key } from 'rc-tree/lib/interface';

/** helper type, shortened form */
export type TreeNode = TreeModel.Node<ParsedHierarchyNode>;

interface SelectCallbackInfo {
  event: 'select';
  selected: boolean;
  node: TreeNode;
  selectedNodes: TreeNode;
  nativeEvent: MouseEvent;
}

interface TreeProp {
  data: TreeNode[];
  selectedNode: TreeNode | undefined;
  onSelect: (item: TreeNode | undefined) => void;
}

interface ExpandCallbackInfo {
  node: TreeNode;
  expanded: boolean;
  nativeEvent: MouseEvent;
}

export const Tree: React.FC<TreeProp> = (props: TreeProp) => {
  const { data, onSelect, selectedNode } = props;
  const { t } = useTranslation();

  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchExpandedKeys, setSearchExpandedKeys] = useState<Key[]>([]);

  useEffect(() => {
    const updateExpandedKeys = (keys: Key[]) => setExpandedKeys([...expandedKeys, ...keys]);
    // set expanded and selected keys depending on location tree state and searchValue
    if (selectedNode) {
      let parentPath = selectedNode.getPath();
      parentPath = parentPath.slice(1, parentPath.length);
      const parentKeys = parentPath.map((node) => node.model.id);
      updateExpandedKeys(parentKeys);
    }
    if (searchValue) {
      let matchedNodes: TreeNode[] = [];
      data.forEach((tree: TreeNode) => {
        const matchedNodesPerTree = tree.all(
          (node) => node.model.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
        );
        matchedNodes = [...matchedNodes, ...matchedNodesPerTree];
      });
      // parent keys of matched nodes
      const parentNodeKeys = matchedNodes
        .map((node: TreeNode) => {
          if (node.parent) {
            return node.parent.model.id;
          }
          return undefined;
        })
        .filter((key) => key !== undefined);
      setSearchExpandedKeys(parentNodeKeys);
    } else {
      setSearchExpandedKeys([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, searchValue, selectedNode]);

  /**
   * @param keys - node keys
   * @param other -
   */
  function expandHandler(keys: Key[], other: unknown) {
    const info = other as unknown as ExpandCallbackInfo;
    const node = info.node.data;
    const location = node.model;
    const thisNodeKey = location.id;
    if (info.expanded) {
      setExpandedKeys([...expandedKeys, thisNodeKey]);
    } else {
      const kys = expandedKeys.filter((key) => key !== thisNodeKey);
      setExpandedKeys(kys);
    }
  }

  /**
   * Function to handle event when tree search input changes value
   *
   * @param {ChangeEvent<HTMLInputElement>} event the actual event
   */
  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setSearchValue(value);
  }

  /**
   * process the data before it could be displayed in tree
   *
   * @param {Array<TreeNode[]>} data the tree data to preprocess
   * @returns {object} - returns obj with title, key and children
   */
  const buildTreeData = React.useCallback(
    (data: TreeNode[]): AntTreeProps[] => {
      return data.map((itemNode) => {
        const item = itemNode.model;
        const itemTitle = item.title;
        const index = itemTitle.toLowerCase().indexOf(searchValue.toLowerCase());
        const beforeStr = itemTitle.toLowerCase().substring(0, index);
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        const afterStr = itemTitle.toLowerCase().substring(index + searchValue.length);
        const title = (
          <span key={item.id} title={itemTitle}>
            {searchValue.length > 0 && index > -1 ? (
              <>
                {beforeStr}
                <span className="searchValue">{searchValue}</span>
                {afterStr}
              </>
            ) : (
              item.title
            )}
          </span>
        );

        return {
          data: itemNode,
          key: item.id,
          title: title,
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          ...(item.children && { children: buildTreeData(itemNode.children) }),
        } as AntTreeProps;
      });
    },
    [searchValue]
  );

  // se we want to support a usecase where a node is selected but can be collapsed
  return (
    <div>
      <Input
        className="mb-3"
        placeholder={t('Search')}
        size="large"
        prefix={<SearchOutlined  />}
        onChange={onChange}
      />
      <AntTree
        autoExpandParent={false}
        selectedKeys={selectedNode ? [selectedNode.model.id] : undefined}
        onExpand={expandHandler}
        expandedKeys={[...expandedKeys, ...searchExpandedKeys]}
        treeData={buildTreeData(data)}
        onSelect={(_: Key[], other) => {
          const info = other as unknown as SelectCallbackInfo;
          const locNode = info.node.data;
          const nodekey = locNode.model.id;
          if (info.selected) {
            setExpandedKeys([...new Set([...expandedKeys, nodekey])]);
            onSelect(locNode);
          } else {
            const kys = expandedKeys.filter((key) => key !== nodekey);
            setExpandedKeys(kys);
            onSelect(undefined);
          }
        }}
      />
    </div>
  );
};

export default Tree;
