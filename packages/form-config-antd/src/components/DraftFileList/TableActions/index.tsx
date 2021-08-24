import React from 'react';
import { Button } from 'antd';
import {
  ManifestFilesTypes,
  OPENSRP_FORMS_ENDPOINT,
  downloadManifestFile,
} from '@opensrp-web/form-config-core';
import { getFetchOptions } from '@opensrp-web/server-service';
import { sendErrorNotification } from '@opensrp-web/notifications';
import lang from '../../../lang';

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
  downloadManifestFile(
    accessToken,
    opensrpBaseURL,
    OPENSRP_FORMS_ENDPOINT,
    file,
    isJsonValidator,
    customFetchOptions
  ).catch((_: Error) => {
    sendErrorNotification(lang.ERROR_OCCURRED);
  });
};

const TableActions = (props: TableActionsProps): JSX.Element => {
  const { file, accessToken, opensrpBaseURL, isJsonValidator, customFetchOptions } = props;
  return (
    <>
      <Button
        type="link"
        onClick={() =>
          onDownloadClick(file, accessToken, opensrpBaseURL, isJsonValidator, customFetchOptions)
        }
      >
        {lang.DOWNLOAD}
      </Button>
    </>
  );
};

export { TableActions };
