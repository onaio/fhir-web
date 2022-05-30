import React from 'react';
import { Button } from 'antd';
import {
  ManifestFilesTypes,
  OPENSRP_FORMS_ENDPOINT,
  downloadManifestFile,
} from '@opensrp/form-config-core';
import { getFetchOptions } from '@opensrp/server-service';
import { sendErrorNotification } from '@opensrp/notifications';
import { useTranslation } from '../../../mls';

/** interface for component props */
export interface TableActionsProps {
  file: ManifestFilesTypes;
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
  const { file, accessToken, opensrpBaseURL, isJsonValidator, customFetchOptions } = props;
  const { t } = useTranslation();
  return (
    <>
      <Button
        type="link"
        onClick={() =>
          onDownloadClick(
            file,
            accessToken,
            opensrpBaseURL,
            isJsonValidator,
            customFetchOptions
          ).catch((_: Error) => {
            sendErrorNotification(t('An error occurred'));
          })
        }
      >
        {t('Download')}
      </Button>
    </>
  );
};

export { TableActions };
