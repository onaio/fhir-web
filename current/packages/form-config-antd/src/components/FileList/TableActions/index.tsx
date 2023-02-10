import React from 'react';
import { Link } from 'react-router-dom';
import { Divider, Button, Dropdown, Menu } from 'antd';
import {
  ManifestFilesTypes,
  OPENSRP_FORMS_ENDPOINT,
  downloadManifestFile,
} from '@opensrp/form-config-core';
import { getFetchOptions } from '@opensrp/server-service';
import { sendErrorNotification } from '@opensrp/notifications';
import { MoreOutlined } from '@ant-design/icons';
import { useTranslation } from '../../../mls';

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
  return downloadManifestFile(
    accessToken,
    opensrpBaseURL,
    OPENSRP_FORMS_ENDPOINT,
    file,
    isJsonValidator,
    customFetchOptions
  );
};

const TableActions = (props: TableActionsProps): JSX.Element => {
  const { file, uploadFileURL, accessToken, opensrpBaseURL, isJsonValidator, customFetchOptions } =
    props;
  const { t } = useTranslation();

  const menu = (
    <Menu>
      <Menu.Item>
        <Button
          type="link"
          onClick={() =>
            onDownloadClick(
              file,
              accessToken,
              opensrpBaseURL,
              isJsonValidator,
              customFetchOptions
            ).catch(() => {
              sendErrorNotification(t('An error occurred'));
            })
          }
        >
          {t('Download')}
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Link to={`${uploadFileURL}/${file.id}`} key="actions">
        {t('Edit')}
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
