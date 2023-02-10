import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Column, TableLayout } from '..';
import { TABLE_PAGE_SIZE, TABLE_PAGE_SIZE_OPTIONS } from '../../../constants';
import { getConfig, setConfig } from '@opensrp/pkg-config';

interface TableData {
  geographicLevel: number;
  id: string;
  name: string;
}

const columns: Column<TableData>[] = [
  {
    title: 'NAME',
    dataIndex: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'LEVEL',
    dataIndex: 'geographicLevel',
    sorter: (a, b) => a.geographicLevel - b.geographicLevel,
  },
];

const actions = {
  title: 'ACTIONS',
  width: '10%',
  // eslint-disable-next-line react/display-name
  render: () => <span id="Actions">actions</span>,
};

const paginationDefaults = {
  showQuickJumper: true,
  showSizeChanger: true,
  defaultPageSize: TABLE_PAGE_SIZE,
  pageSizeOptions: TABLE_PAGE_SIZE_OPTIONS,
};

describe('Table Layout', () => {
  const tableData: TableData[] = [];
  for (let i = 1; i < 20; i++) {
    tableData.push({
      id: i.toString(),
      name: `Edrward ${i}`,
      geographicLevel: i,
    });
  }

  it('renders without crashing', () => {
    const wrapper = mount(
      <TableLayout datasource={tableData} columns={columns} actions={actions} />
    );

    expect(wrapper.find('Table').first().prop('dataSource')).toMatchObject(tableData);
    expect(wrapper.find('Table').first().prop('columns')).toMatchObject([...columns, actions]); // column passed to table should contain column as well as actions
  });

  it('Must have default settings applied', () => {
    const wrapper = mount(
      <TableLayout datasource={tableData} columns={columns} actions={actions} />
    );

    expect(wrapper.find('Table').first().prop('pagination')).toMatchObject(paginationDefaults);
  });

  it('can override default settings', () => {
    const wrapper = mount(
      <TableLayout
        datasource={tableData}
        id="TestTable"
        persistState={false}
        pagination={false}
        columns={columns}
      />
    );

    expect(wrapper.find('Table').first().prop('pagination')).toBe(false);
  });

  it('Get and Save Value to pkg-config', async () => {
    // When no persistState or id is assigned
    const wrapper = mount(
      <TableLayout
        datasource={tableData}
        id="TestTable"
        persistState={false}
        columns={columns}
        actions={actions}
      />
    );

    await act(async () => {
      wrapper.find('TableLayout').find('.ant-pagination-item-3').simulate('click');
      wrapper.update();
    });

    expect(getConfig('tablespref')).toBeUndefined();

    // get when nothing is stored
    const wrapper1 = mount(
      <TableLayout
        datasource={tableData}
        id="TestTable"
        persistState={true}
        columns={columns}
        actions={actions}
      />
    );

    await act(async () => {
      wrapper1.find('TableLayout').find('.ant-pagination-item-3').simulate('click');
      wrapper1.update();
    });

    expect(getConfig('tablespref')).toMatchObject({
      TestTable: {
        pagination: {
          current: 3,
          pageSize: 5,
        },
      },
    });
  });
});

describe('Table layout pkg config integration', () => {
  const tableData: TableData[] = [];
  for (let i = 1; i < 20; i++) {
    tableData.push({
      id: i.toString(),
      key: i.toString(),
      name: `Edrward ${i}`,
      geographicLevel: i,
    });
  }

  beforeAll(() => {
    setConfig('defaultTablesPageSize', 100);
  });

  it('Picks default page size value from config', () => {
    const wrapper = mount(
      <TableLayout datasource={tableData} columns={columns} actions={actions} />
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((wrapper.find('Table').first().prop('pagination') as any).defaultPageSize).toEqual(100);
  });
});
