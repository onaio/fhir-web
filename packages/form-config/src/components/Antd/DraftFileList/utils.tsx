import React from 'react';
import { Dictionary } from '@onaio/utils';
import { ManifestFilesTypes } from '../../../ducks/manifestFiles';
import { TableActions } from './TableActions';
import { getFetchOptions, OpenSRPService } from '@opensrp/server-service';
import { OPENSRP_MANIFEST_ENDPOINT, ERROR_OCCURRED } from '../../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import { removeManifestDraftFiles } from '../../../ducks/manifestDraftFiles';
import { store } from '@onaio/redux-reducer-registry';

export const getTableColumns = (
  accessToken: string,
  opensrpBaseURL: string,
  isJsonValidator: boolean,
  sortedInfo?: Dictionary,
  customFetchOptions?: typeof getFetchOptions
): Dictionary[] => {
  const columns: Dictionary[] = [];
  const headerItems: string[] = ['Identifier', 'File Name', 'File Version', 'Created At', 'Module'];
  const fields: string[] = ['identifier', 'label', 'version', 'createdAt', 'module'];

  fields.forEach((field: string, index: number) => {
    columns.push({
      title: headerItems[index],
      dataIndex: fields[index],
      key: fields[index],
      sorter: (a: Dictionary, b: Dictionary) => {
        if (b[fields[index]]) {
          return a[fields[index]].length - b[fields[index]].length;
        }
      },
      sortOrder: sortedInfo && sortedInfo.columnKey === fields[index] && sortedInfo.order,
      ellipsis: true,
    });
  });

  columns.push({
    title: 'Action',
    key: 'action',
    // eslint-disable-next-line react/display-name
    render: (_: string, file: ManifestFilesTypes) => {
      const tableActionProps = {
        file,
        accessToken,
        opensrpBaseURL,
        isJsonValidator,
        customFetchOptions,
      };
      return <TableActions {...tableActionProps} />;
    },
  });
  return columns;
};

export const makeRelease = (
  data: ManifestFilesTypes[],
  accessToken: string,
  opensrpBaseURL: string,
  dispatch: typeof store.dispatch,
  removeDraftFiles: typeof removeManifestDraftFiles,
  setIfDoneHere: (ifDoneHere: boolean) => void,
  customFetchOptions?: typeof getFetchOptions
) => {
  const identifiers = data.map((form) => form.identifier);
  const json = {
    /* eslint-disable-next-line @typescript-eslint/camelcase */
    forms_version: data[0].version,
    identifiers,
  };
  const clientService = new OpenSRPService(
    accessToken,
    opensrpBaseURL,
    OPENSRP_MANIFEST_ENDPOINT,
    customFetchOptions
  );
  clientService
    .create({ json: JSON.stringify(json) })
    .then(() => {
      dispatch(removeDraftFiles());
      setIfDoneHere(true);
    })
    .catch((_: Error) => {
      sendErrorNotification(ERROR_OCCURRED);
    });
};
