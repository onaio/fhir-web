import { getTableColumns } from '../utils';

const translator = (t) => t;

describe('components/UserList/utils/getTableColumns', () => {
  const sortedInfo = {
    column: { title: 'First Name', dataIndex: 'firstName', key: 'firstName', ellipsis: true },
    order: 'ascend',
    field: 'firstName',
    columnKey: 'firstName',
  };

  it('builds table columns correctly', () => {
    expect(getTableColumns(translator, undefined)).toMatchSnapshot('table columns');
  });
  it('builds table columns correctly with sorted info', () => {
    expect(getTableColumns(translator, sortedInfo)).toMatchSnapshot(
      'table columns with sorted info'
    );
  });
});
