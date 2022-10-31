import React from 'react';
import { mount } from 'enzyme';
import { ColumnType } from 'antd/lib/table';
import { Table } from '../Table';
import { serverSettings, tree } from './fixtures';
import { Setting } from '../../../ducks/settings';

describe('Settings table view', () => {
  it('renders without crashing', async () => {
    const wrapper = mount(
      <Table
        data={serverSettings}
        tree={tree}
        actioncolumn={{
          title: 'Actions',
          key: 'actions',
          dataIndex: 'actions',
          // eslint-disable-next-line react/display-name
          render: () => <div />,
          width: '10%',
        }}
      />
    );

    expect(wrapper.find('table')).toBeTruthy(); // must have table
    expect(
      (wrapper.find('ColGroup').first().prop('columns') as ColumnType<Setting>[]).map(
        (e) => e.dataIndex
      )
    ).toMatchObject(['label', 'description', 'value', 'inheritedFrom', 'actions']); // must have 5 column in table
  });
});
