import React, { ChangeEvent, useState, useEffect } from 'react';
import { Input, Tree as AntTree } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { AntTreeData } from '../LocationUnitList';
import './tree.css';
import { TreeNode } from '../../helpers/types';
import lang from '../../lang';
import { Key } from 'rc-tree/lib/interface';
import { slice } from 'lodash';

interface TreeProp {
  data: TreeNode[];
  selectedNode?: TreeNode;
  onSelect: (node?: TreeNode) => void;
}

interface SelectCallbackInfo {
  event: 'select';
  selected: boolean;
  node: AntTreeData;
  selectedNodes: TreeNode;
  nativeEvent: MouseEvent;
}

interface ExpandCallbackInfo {
  node: AntTreeData;
  expanded: boolean;
  nativeEvent: MouseEvent;
}

export const Tree: React.FC<TreeProp> = (props: TreeProp) => {
  const { data, onSelect, selectedNode } = props;
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [searchExpandedKeys, setSearchExpandedKeys] = useState<Key[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  useEffect(() => {
    const updateExpandedKeys = (keys: Key[]) => setExpandedKeys([...expandedKeys, ...keys]);
    // set expanded and selected keys depending on location tree state and searchValue
    if (selectedNode) {
      let parentPath = selectedNode.getPath();
      parentPath = slice(parentPath, 1, parentPath.length);
      const parentKeys = parentPath.map((node) => node.model.nodeId);
      updateExpandedKeys(parentKeys);
    }
    if (searchValue) {
      let matchedNodes: TreeNode[] = [];
      data.forEach((tree) => {
        const matchedNodesPerTree = tree.all(
          (node) => node.model.node.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
        );
        matchedNodes = [...matchedNodes, ...matchedNodesPerTree];
      });
      // parent keys of matched nodes
      const parentNodeKeys = matchedNodes.map((node) => node.parent.model.nodeId);
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
    const info = (other as unknown) as ExpandCallbackInfo;
    const thisNodeKey = info.node.data.model.nodeId;
    if (info.expanded) {
      setExpandedKeys([...expandedKeys, thisNodeKey]);
    } else {
      const kys = expandedKeys.filter((key) => key !== thisNodeKey);
      setExpandedKeys(kys);
    }
  }

  /** Function to handle event when tree search input changes value
   *
   * @param {ChangeEvent<HTMLInputElement>} event the actual event
   */
  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setSearchValue(value);
  }

  /** process the data before it could be displayed in tree
   *
   * @param {Array<TreeNode[]>} data the tree data to preprocess
   * @returns {object} - returns obj with title, key and children
   */
  const buildTreeData = React.useCallback(
    (data: TreeNode[]): AntTreeData[] => {
      return data.map((item) => {
        const itemTitle = item.model.node.name as string;
        const index = itemTitle.toLowerCase().indexOf(searchValue.toLowerCase());
        const beforeStr = itemTitle.toLowerCase().substr(0, index);
        const afterStr = itemTitle.toLowerCase().substr(index + searchValue.length);
        const title = (
          <span key={item.id} title={itemTitle}>
            {searchValue.length > 0 && index > -1 ? (
              <>
                {beforeStr}
                <span className="searchValue">{searchValue}</span>
                {afterStr}
              </>
            ) : (
              itemTitle
            )}
          </span>
        );

        return {
          // important : we are mixing the antTreeProps with ParsedHierarchyNode
          data: item,
          key: item.model.nodeId,
          title,
          ...(item.children ? { children: buildTreeData(item.children) } : {}),
        } as AntTreeData;
      });
    },
    [searchValue]
  );

  return (
    <div>
      <Input
        className="mb-3"
        placeholder={lang.SEARCH}
        size="large"
        prefix={<SearchOutlined />}
        onChange={onChange}
      />
      <AntTree
        onSelect={(keys: Key[], other) => {
          const info = (other as unknown) as SelectCallbackInfo;
          if (info.selected) {
            onSelect(info.node.data);
          } else {
            const kys = expandedKeys.filter((key) => key !== info.node.data.model.nodeId);
            setExpandedKeys(kys);
            onSelect();
          }
        }}
        autoExpandParent={true}
        selectedKeys={selectedNode ? [selectedNode.model.nodeId] : undefined}
        onExpand={expandHandler}
        expandedKeys={[...expandedKeys, ...searchExpandedKeys]}
        treeData={buildTreeData(data)}
      />
    </div>
  );
};

export default Tree;
