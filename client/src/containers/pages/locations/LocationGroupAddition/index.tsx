import * as React from 'react';
import { Select } from 'antd';
import { OptionType } from 'antd/lib/select';

interface Props {}

export const LocationUnitGroupAdd: React.FC<Props> = (props: Props) => {
  return (
    <>
      <Select
        showSearch
        placeholder="Select a person"
        optionFilterProp="children"
        filterOption={(input: string, option: any) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Select.Option value="jack">Jack</Select.Option>
        <Select.Option value="lucy">Lucy</Select.Option>
        <Select.Option value="tom">Tom</Select.Option>
      </Select>
    </>
  );
};

export default LocationUnitGroupAdd;
