import React from 'react';
import { Link } from 'react-router-dom';
import { Divider, Button, Dropdown, Menu } from 'antd';
import { ManifestFilesTypes } from '../../../../ducks/manifestFiles';
import { getFetchOptions } from '@opensrp/server-service';
import { sendErrorNotification } from '@opensrp/notifications';
import { MoreOutlined } from '@ant-design/icons';
import { ERROR_OCCURRED, OPENSRP_FORMS_ENDPOINT } from '../../../../constants';
import { downloadManifestFile } from '../../../../helpers/utils';

/** interface for component props */
export interface TableActionsProps {
  file: ManifestFilesTypes;
  uploadFileURL: string;
  accessToken: string;
  opensrpBaseURL: string;
  isJsonValidator: boolean;
  customFetchOptions?: typeof getFetchOptions;
}

export const onDownloadClick = (
  file: ManifestFilesTypes,
  accessToken: string,
  opensrpBaseURL: string,
  isJsonValidator: boolean,
  customFetchOptions?: typeof getFetchOptions
) => {
  downloadManifestFile(
    accessToken,
    opensrpBaseURL,
    OPENSRP_FORMS_ENDPOINT,
    file,
    isJsonValidator,
    customFetchOptions
  ).catch((_: Error) => {
    sendErrorNotification(ERROR_OCCURRED);
  });
};

const TableActions = (props: TableActionsProps): JSX.Element => {
  const {
    file,
    uploadFileURL,
    accessToken,
    opensrpBaseURL,
    isJsonValidator,
    customFetchOptions,
  } = props;

  const menu = (
    <Menu>
      <Menu.Item>
        <Button
          type="link"
          onClick={() =>
            onDownloadClick(file, accessToken, opensrpBaseURL, isJsonValidator, customFetchOptions)
          }
        >
          Download
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Link to={`${uploadFileURL}/${file.id}`} key="actions">
        Edit
      </Link>
      <Divider type="vertical" />
      <Dropdown overlay={menu}>
        <Button type="link" style={{ padding: 0, margin: 0 }}>
          <MoreOutlined
            className="more-options"
            style={{ fontSize: '16px', padding: 0, margin: 0 }}
          />
        </Button>
      </Dropdown>
    </>
  );
};

export { TableActions };
