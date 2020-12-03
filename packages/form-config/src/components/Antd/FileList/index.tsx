import React, { useState, useEffect } from 'react';
import { getFetchOptions, OpenSRPService } from '@opensrp/server-service';
import { getAccessToken } from '@onaio/session-reducer';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { Card, Typography, Spin, Table, Space, Button, Divider } from 'antd';
import { Dictionary } from '@onaio/utils';
import filesReducer, {
  ManifestFilesTypes,
  getAllManifestFilesArray,
  removeManifestFiles,
  fetchManifestFiles,
  filesReducerName,
} from '../../../ducks/manifestFiles';
import { useSelector, useDispatch } from 'react-redux';
import { sendErrorNotification } from '@opensrp/notifications';
import { ERROR_OCCURRED, OPENSRP_FORM_METADATA_ENDPOINT } from '../../../constants';
import { getTableColumns } from './utils';
import { useHistory } from 'react-router';
import { SettingOutlined, UploadOutlined } from '@ant-design/icons';

/** Register reducer */
reducerRegistry.register(filesReducerName, filesReducer);

/** interface for component props */
export interface FileListProps {
  opensrpBaseURL: string;
  formVersion: string | null;
  removeFiles: typeof removeManifestFiles;
  fetchFiles: typeof fetchManifestFiles;
  formRoute: string;
  isJsonValidator: boolean;
  customFetchOptions?: typeof getFetchOptions;
}

/** default component props */
export const defaultProps: FileListProps = {
  opensrpBaseURL: '',
  formVersion: null,
  formRoute: '',
  isJsonValidator: false,
  removeFiles: removeManifestFiles,
  fetchFiles: fetchManifestFiles,
};

const FileList = (props: FileListProps): JSX.Element => {
  const {
    opensrpBaseURL,
    customFetchOptions,
    removeFiles,
    formVersion,
    fetchFiles,
    formRoute,
    isJsonValidator,
  } = props;
  const { Title } = Typography;
  const [loading, setLoading] = useState<boolean>(false);
  const [sortedInfo, setSortedInfo] = React.useState<Dictionary>();
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const data: ManifestFilesTypes[] = useSelector((state) => getAllManifestFilesArray(state));
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    /** get manifest files */
    setLoading(true);
    let params = null;
    // if form version is available -  means request is to get manifest files else get json validator files
    /* eslint-disable-next-line @typescript-eslint/camelcase */
    params = formVersion ? { identifier: formVersion } : { is_json_validator: true };
    dispatch(removeFiles());
    const clientService = new OpenSRPService(
      accessToken,
      opensrpBaseURL,
      OPENSRP_FORM_METADATA_ENDPOINT,
      customFetchOptions
    );
    clientService
      .list(params)
      .then((res: ManifestFilesTypes[]) => {
        dispatch(fetchFiles(res));
      })
      .catch((_: Error) => {
        sendErrorNotification(ERROR_OCCURRED);
      })
      .finally(() => setLoading(false));
  }, [
    opensrpBaseURL,
    accessToken,
    customFetchOptions,
    fetchFiles,
    removeFiles,
    formVersion,
    dispatch,
  ]);

  if (loading) {
    return <Spin />;
  }

  return (
    <div className="layout-content">
      <Title level={3}>JSON Validators</Title>
      <Card>
        <Space style={{ marginBottom: 16, float: 'right' }}>
          <Button type="primary" onClick={() => history.push(formRoute)}>
            <UploadOutlined />
            Upload New File
          </Button>
          <Divider type="vertical" />
          <SettingOutlined />
        </Space>
        <Table
          columns={getTableColumns(
            accessToken,
            opensrpBaseURL,
            isJsonValidator,
            formRoute,
            sortedInfo,
            customFetchOptions
          )}
          dataSource={data}
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

FileList.defaultProps = defaultProps;

export { FileList };
