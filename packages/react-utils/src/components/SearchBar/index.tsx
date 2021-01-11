import React, { ChangeEvent } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Space } from 'antd';

/** SearchBar props interface  */
export interface SearchBarDefaultProps {
  placeholder?: string;
  size?: 'large';
}

/** function type for custom onChangeHandler functions */
export type OnChangeType = (event: ChangeEvent<HTMLInputElement>) => void;

/** search bar props interface */
export interface SearchBarProps extends SearchBarDefaultProps {
  onChangeHandler: OnChangeType;
}

const SearchBar = (props: SearchBarProps) => {
  const { placeholder, size, onChangeHandler } = props;

  return (
    <Space style={{ marginBottom: 16, float: 'left' }}>
      <h5>
        <Input
          placeholder={placeholder}
          size={size}
          prefix={<SearchOutlined />}
          onChange={onChangeHandler}
        />
      </h5>
    </Space>
  );
};

export { SearchBar };
