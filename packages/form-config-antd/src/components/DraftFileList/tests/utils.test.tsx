import { getTableColumns } from '../utils';

describe('components/Antd/DraftFileList/utils/getTableColumns', () => {
  it('builds table columns correctly', () => {
    const accessToken = 'sometoken';
    const opensrpBaseURL = 'https://opensrp.smartregister.org/rest';

    expect(getTableColumns(accessToken, opensrpBaseURL, true)).toMatchSnapshot('table columns');
  });
});
