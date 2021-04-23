import React, { useState, useEffect, ChangeEvent } from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { Card, Typography, Spin, Table, Space, Button, Divider, Input } from 'antd';
import { getAccessToken } from '@onaio/session-reducer';
import { SettingOutlined, UploadOutlined, SearchOutlined } from '@ant-design/icons';
import {
  draftReducer,
  fetchManifestDraftFiles,
  draftReducerName,
  getAllManifestDraftFilesArray,
  removeManifestDraftFiles,
  ManifestFilesTypes,
  OPENSRP_FORM_METADATA_ENDPOINT,
  OPENSRP_MANIFEST_ENDPOINT,
  makeRelease,
  fetchDrafts,
} from '@opensrp/form-config-core';
import { getFetchOptions } from '@opensrp/server-service';
import { Dictionary } from '@onaio/utils';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Redirect } from 'react-router';
import { sendErrorNotification } from '@opensrp/notifications';
import { getTableColumns } from './utils';
import lang from '../../lang';

/** Register reducer */
reducerRegistry.register(draftReducerName, draftReducer);

/** interface for component props */
export interface DraftFileListProps {
  opensrpBaseURL: string;
  removeDraftFiles: typeof removeManifestDraftFiles;
  fetchDraftFiles: typeof fetchManifestDraftFiles;
  uploadFileURL: string;
  onMakeReleaseRedirectURL: string;
  customFetchOptions?: typeof getFetchOptions;
}

/** default component props */
export const defaultProps: DraftFileListProps = {
  opensrpBaseURL: '',
  uploadFileURL: '',
  onMakeReleaseRedirectURL: '',
  removeDraftFiles: removeManifestDraftFiles,
  fetchDraftFiles: fetchManifestDraftFiles,
};

const DrafFileList = (props: DraftFileListProps): JSX.Element => {
  const { Title } = Typography;
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(false);
  const [sortedInfo, setSortedInfo] = useState<Dictionary>();
  const [ifDoneHere, setIfDoneHere] = useState(false);
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const data: ManifestFilesTypes[] = useSelector((state) => getAllManifestDraftFilesArray(state));
  const [filterData, setfilterDataData] = useState<ManifestFilesTypes[] | null>(null);
  const [value, setValue] = useState('');
  data.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const {
    opensrpBaseURL,
    customFetchOptions,
    fetchDraftFiles,
    uploadFileURL,
    onMakeReleaseRedirectURL,
    removeDraftFiles,
  } = props;

  useEffect(() => {
    fetchDrafts(
      accessToken,
      opensrpBaseURL,
      fetchDraftFiles,
      setLoading,
      sendErrorNotification,
      OPENSRP_FORM_METADATA_ENDPOINT,
      dispatch
    );
  }, [accessToken, opensrpBaseURL, customFetchOptions, fetchDraftFiles, dispatch]);

  if (loading) {
    return <Spin />;
  }

  if (ifDoneHere && onMakeReleaseRedirectURL) {
    return <Redirect to={onMakeReleaseRedirectURL} />;
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    setValue(searchValue);
    const filterDataedData = data.filter(
      (entry) =>
        entry.label.toLowerCase().includes(searchValue) ||
        entry.identifier.toLowerCase().includes(searchValue) ||
        (entry.module && entry.module.toUpperCase().includes(searchValue))
    );
    setfilterDataData(filterDataedData);
  };

  return (
    <div className="layout-content">
      <Title level={3}>{lang.DRAFT_FILES}</Title>
      <Card>
        <Space style={{ marginBottom: 16, float: 'left' }}>
          <Input
            id="search"
            placeholder={lang.SEARCH}
            size="large"
            value={value}
            prefix={<SearchOutlined />}
            onChange={onChange}
          />
        </Space>
        <Space style={{ marginBottom: 16, float: 'right' }}>
          <Button type="primary" onClick={() => history.push(uploadFileURL)}>
            <UploadOutlined />
            {lang.UPLOAD_NEW_FILE}
          </Button>
          <Divider type="vertical" />
          <SettingOutlined />
        </Space>
        <Table
          columns={getTableColumns(
            accessToken,
            opensrpBaseURL,
            false,
            sortedInfo,
            customFetchOptions
          )}
          dataSource={value.length < 1 ? data : (filterData as ManifestFilesTypes[])}
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
        {data.length > 0 && (
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          <Space style={{ float: 'right' }}>
            <Button
              type="primary"
              onClick={() =>
                makeRelease(
                  data,
                  accessToken,
                  opensrpBaseURL,
                  removeDraftFiles,
                  setIfDoneHere,
                  sendErrorNotification,
                  OPENSRP_MANIFEST_ENDPOINT,
                  dispatch,
                  customFetchOptions
                )
              }
            >
              {lang.MAKE_RELEASE}
            </Button>
          </Space>
        )}
      </Card>
    </div>
  );
};

DrafFileList.defaultProps = defaultProps;

export { DrafFileList };
