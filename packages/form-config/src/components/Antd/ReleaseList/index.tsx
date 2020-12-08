import React, { useState, useEffect, ChangeEvent } from 'react';
import { getFetchOptions, OpenSRPService } from '@opensrp/server-service';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { getAccessToken } from '@onaio/session-reducer';
import { SettingOutlined, UploadOutlined, SearchOutlined } from '@ant-design/icons';
import releasesReducer, {
  fetchManifestReleases,
  releasesReducerName,
  getAllManifestReleasesArray,
  ManifestReleasesTypes,
} from '../../../ducks/manifestReleases';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Dictionary } from '@onaio/utils';
import { Card, Typography, Spin, Table, Space, Button, Divider, Input } from 'antd';
import { OPENSRP_MANIFEST_ENDPOINT, ERROR_OCCURRED } from '../../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import { getTableColumns } from './utils';

/** Register reducer */
reducerRegistry.register(releasesReducerName, releasesReducer);

/** interface for component props */
export interface ReleaseListProps {
  opensrpBaseURL: string;
  uploadFileURL: string;
  viewReleaseURL: string;
  fetchReleases: typeof fetchManifestReleases;
  customFetchOptions?: typeof getFetchOptions;
}

/** default component props */
export const defaultProps: ReleaseListProps = {
  opensrpBaseURL: '',
  uploadFileURL: '',
  viewReleaseURL: '',
  fetchReleases: fetchManifestReleases,
};

const ReleaseList = (props: ReleaseListProps): JSX.Element => {
  const { Title } = Typography;
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(false);
  const [sortedInfo, setSortedInfo] = useState<Dictionary>();
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const data: ManifestReleasesTypes[] = useSelector((state) => getAllManifestReleasesArray(state));
  data.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const [filterData, setfilterDataData] = useState<ManifestReleasesTypes[] | null>(null);
  const [value, setValue] = useState('');
  const {
    opensrpBaseURL,
    uploadFileURL,
    viewReleaseURL,
    customFetchOptions,
    fetchReleases,
  } = props;

  useEffect(() => {
    /** get manifest releases */
    setLoading(true);
    const clientService = new OpenSRPService(
      accessToken,
      opensrpBaseURL,
      OPENSRP_MANIFEST_ENDPOINT,
      customFetchOptions
    );
    clientService
      .list()
      .then((res: ManifestReleasesTypes[]) => dispatch(fetchReleases(res)))
      .catch((_: Error) => {
        sendErrorNotification(ERROR_OCCURRED);
      })
      .finally(() => setLoading(false));
  }, [accessToken, opensrpBaseURL, customFetchOptions, dispatch, fetchReleases]);

  if (loading) {
    return <Spin />;
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    setValue(searchValue);
    const filterDataedData = data.filter(
      (entry) =>
        entry.appId.toLowerCase().includes(searchValue) ||
        entry.appVersion.toLowerCase().includes(searchValue) ||
        entry.identifier.toLowerCase().includes(searchValue)
    );
    setfilterDataData(filterDataedData);
  };

  return (
    <div className="layout-content">
      <Title level={3}>Releases</Title>
      <Card>
        <Space style={{ marginBottom: 16, float: 'left' }}>
          <Input
            id="search"
            placeholder="Search"
            size="large"
            value={value}
            prefix={<SearchOutlined />}
            onChange={onChange}
          />
        </Space>
        <Space style={{ marginBottom: 16, float: 'right' }}>
          <Button type="primary" onClick={() => history.push(uploadFileURL)}>
            <UploadOutlined />
            Upload New File
          </Button>
          <Divider type="vertical" />
          <SettingOutlined />
        </Space>
        <Table
          columns={getTableColumns(viewReleaseURL, sortedInfo)}
          dataSource={value.length < 1 ? data : (filterData as ManifestReleasesTypes[])}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            defaultPageSize: 5,
            pageSizeOptions: ['5', '10', '20', '50', '100'],
          }}
          onChange={(_: Dictionary, __: Dictionary, sorter: Dictionary) => {
            setSortedInfo(sorter);
          }}
        />
      </Card>
    </div>
  );
};

ReleaseList.defaultProps = defaultProps;

export { ReleaseList };
