import { getTableColumns } from '../utils';

describe('components/Antd/FileList/utils/getTableColumns', () => {
  const translator = t => t;

  it('returns table columns', () => {
    expect(getTableColumns(true, translator)).toMatchSnapshot(
      'table columns'
    );
  });

  it('returns table columns correctly for non-json validators', () => {
    expect(getTableColumns(true, translator)).toMatchSnapshot(
      'non-json validators columns'
    );
  });
});
