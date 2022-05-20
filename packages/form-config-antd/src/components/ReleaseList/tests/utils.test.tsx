import { getTableColumns } from '../utils';

describe('components/Antd/ReleaseList/utils/getTableColumns', () => {
  const translator = t => t

  it('returns table columns', () => {
    expect(getTableColumns(translator)).toMatchSnapshot('table columns');
  });
});
