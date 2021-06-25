import { getTableColumns } from '../utils';

describe('components/UserList/utils/getTableColumns', () => {
  const sortedInfo = {
    column: { title: 'First Name', dataIndex: 'firstName', key: 'firstName', ellipsis: true },
    order: 'ascend',
    field: 'firstName',
    columnKey: 'firstName',
  };

  const langObj = {
    EMAIL: 'Email',
    FIRST_NAME: 'First Name',
    LAST_NAME: 'Last Name',
    USERNAME: 'Username',
  };

  it('builds table columns correctly', () => {
    expect(getTableColumns(undefined, langObj)).toMatchSnapshot('table columns');
  });
  it('builds table columns correctly with sorted info', () => {
    expect(getTableColumns(sortedInfo, langObj)).toMatchSnapshot('table columns with sorted info');
  });
});
