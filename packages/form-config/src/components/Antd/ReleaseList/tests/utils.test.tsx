import { getTableColumns } from '../utils';

describe('components/Antd/ReleaseList/utils/getTableColumns', () => {
  const currentURL = '/releases';

  it('returns table columns', () => {
    expect(getTableColumns(currentURL)).toMatchSnapshot('table columns');
  });
});
