import React from 'react';
import { Link } from 'react-router-dom';
import { Divider, Button } from 'antd';
import { ManifestFilesTypes } from '../../../../ducks/manifestFiles';
import { getFetchOptions } from '@opensrp/server-service';
import { sendErrorNotification } from '@opensrp/notifications';
import { ERROR_OCCURRED, OPENSRP_FORMS_ENDPOINT } from '../../../../constants';
import { downloadManifestFile } from '../../../../helpers/utils';

/** interface for component props */
export interface TableActionsProps {
  file: ManifestFilesTypes;
  formRoute: string;
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
    formRoute,
    accessToken,
    opensrpBaseURL,
    isJsonValidator,
    customFetchOptions,
  } = props;
  return (
    <>
      <Link to={`${formRoute}/${file.id}`} key="actions">
        Edit
      </Link>
      <Divider type="vertical" />
      <Button
        type="link"
        onClick={() =>
          onDownloadClick(file, accessToken, opensrpBaseURL, isJsonValidator, customFetchOptions)
        }
      >
        Download
      </Button>
    </>
  );
};

export { TableActions };
