import React, { useState, useEffect, ChangeEvent } from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { Card, Typography, Spin, Space, Button, Divider, Input } from 'antd';
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
import { TableLayout } from '@opensrp/react-utils';
import { TableActions } from './TableActions';
import { useTranslation } from '../../mls';

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
  const { t } = useTranslation();
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
    setLoading(true);
    fetchDrafts(
      accessToken,
      opensrpBaseURL,
      fetchDraftFiles,
      OPENSRP_FORM_METADATA_ENDPOINT,
      dispatch
    ).catch((err: Error) => {
      sendErrorNotification(err.message);
    });
  }, [accessToken, opensrpBaseURL, customFetchOptions, fetchDraftFiles, dispatch]);

  if (loading) {
    return <Spin size="large" className="custom-spinner" />;
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
      <Title level={3}>{t('Draft Files')}</Title>
      <Card>
        <Space style={{ marginBottom: 16, float: 'left' }}>
          <Input
            id="search"
            placeholder={t('Search')}
            size="large"
            value={value}
            prefix={<SearchOutlined />}
            onChange={onChange}
          />
        </Space>
        <Space style={{ marginBottom: 16, float: 'right' }}>
          <Button type="primary" id="uploadNewFile" onClick={() => history.push(uploadFileURL)}>
            <UploadOutlined />
            {t('Upload New File')}
          </Button>
          <Divider type="vertical" />
          <SettingOutlined />
        </Space>
        <TableLayout
          id="FormDraftFileList"
          persistState={true}
          columns={getTableColumns(t, sortedInfo)}
          actions={{
            // eslint-disable-next-line react/display-name
            render: (_: string, file: ManifestFilesTypes) => {
              const tableActionProps = {
                file,
                accessToken,
                opensrpBaseURL,
                isJsonValidator: false,
                customFetchOptions,
              };
              return <TableActions {...tableActionProps} />;
            },
          }}
          datasource={value.length < 1 ? data : (filterData as ManifestFilesTypes[])}
          // eslint-disable-next-line @typescript-eslint/naming-convention
          onChange={(_: Dictionary, __: Dictionary, sorter: Dictionary) => setSortedInfo(sorter)}
        />
        {data.length > 0 && (
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          <Space style={{ float: 'right' }}>
            <Button
              type="primary"
              id="makeRelease"
              onClick={() =>
                makeRelease(
                  data,
                  accessToken,
                  opensrpBaseURL,
                  removeDraftFiles,
                  setIfDoneHere,
                  OPENSRP_MANIFEST_ENDPOINT,
                  dispatch,
                  customFetchOptions
                ).catch(() => sendErrorNotification(t('An error occurred')))
              }
            >
              {t('Make Release')}
            </Button>
          </Space>
        )}
      </Card>
    </div>
  );
};

DrafFileList.defaultProps = defaultProps;

export { DrafFileList };
