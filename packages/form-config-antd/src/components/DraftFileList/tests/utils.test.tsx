import { getTableColumns } from '../utils';

describe('components/Antd/DraftFileList/utils/getTableColumns', () => {
  it('builds table columns correctly', () => {
    const translator = t => t

    expect(getTableColumns(translator)).toMatchSnapshot('table columns');
  });
});
