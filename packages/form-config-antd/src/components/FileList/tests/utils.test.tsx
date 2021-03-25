import { getTableColumns } from '../utils';

describe('components/Antd/FileList/utils/getTableColumns', () => {
  const accessToken = 'sometoken';
  const opensrpBaseURL = 'https://opensrp.smartregister.org/rest';
  const uploadFileURL = '/upload';

  it('returns table columns', () => {
    expect(getTableColumns(accessToken, opensrpBaseURL, true, uploadFileURL)).toMatchSnapshot(
      'table columns'
    );
  });

  it('returns table columns correctly for non-json validators', () => {
    expect(getTableColumns(accessToken, opensrpBaseURL, false, uploadFileURL)).toMatchSnapshot(
      'non-json validators columns'
    );
  });
});
