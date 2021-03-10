import { getTableColumns } from '../utils';

describe('components/Antd/ReleaseList/utils/getTableColumns', () => {
  const viewReleaseURL = '/releases';

  it('returns table columns', () => {
    expect(getTableColumns(viewReleaseURL)).toMatchSnapshot('table columns');
  });
});
