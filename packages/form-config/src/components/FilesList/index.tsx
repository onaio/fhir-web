import React, { useEffect, useState, ChangeEvent, MouseEvent } from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { SearchForm, SearchFormProps } from '@opensrp/react-utils';
import { Store } from 'redux';
import { DrillDownTable, DrillDownColumn } from '@onaio/drill-down-table';
import { connect } from 'react-redux';
import { FormConfigProps, DrillDownProps } from '../../helpers/types';
import { Link } from 'react-router-dom';
import {
  filesReducer,
  fetchManifestFiles,
  filesReducerName,
  ManifestFilesTypes,
  getAllManifestFilesArray,
  removeManifestFiles,
  formatDate,
  downloadManifestFile,
  fetchManifests,
} from '@opensrp/form-config-core';
import { Row, Col } from 'reactstrap';
import { Cell } from 'react-table';
import { Dictionary } from '@onaio/utils';
import { GetAccessTokenType } from '@opensrp/server-service';
import { useTranslation } from '../../mls';

/** Register reducer */
reducerRegistry.register(filesReducerName, filesReducer);

/** default props interface */
export interface FilesListDefaultProps extends Pick<SearchFormProps, 'placeholder'> {
  createdAt: string;
  data: ManifestFilesTypes[];
  downloadLabel: string;
  drillDownProps: DrillDownProps;
  editLabel: string;
  fetchFiles: typeof fetchManifestFiles;
  fileNameLabel: string;
  fileVersionLabel: string;
  identifierLabel: string;
  moduleLabel: string;
  removeFiles: typeof removeManifestFiles;
  uploadEditLabel: string;
  uploadFileLabel: string;
  accessToken: string | GetAccessTokenType;
}

/** manifest files list props interface */

export interface ManifestFilesListProps extends FilesListDefaultProps, FormConfigProps {
  downloadEndPoint: string;
  formVersion: string | null;
  fileUploadUrl: string;
  isJsonValidator: boolean;
  uploadTypeUrl: string;
}

/**
 * Component ManifestFilesList
 *
 * @param {Dictionary} props - component props
 * @returns {Element} - rendered element
 */
const ManifestFilesList = (props: ManifestFilesListProps): JSX.Element => {
  const {
    baseURL,
    endpoint,
    getPayload,
    LoadingComponent,
    data,
    placeholder,
    fetchFiles,
    fileUploadUrl,
    isJsonValidator,
    customAlert,
    formVersion,
    downloadEndPoint,
    removeFiles,
    uploadTypeUrl,
    identifierLabel,
    fileNameLabel,
    fileVersionLabel,
    moduleLabel,
    editLabel,
    uploadEditLabel,
    downloadLabel,
    uploadFileLabel,
    createdAt,
    drillDownProps,
    accessToken,
  } = props;

  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState<ManifestFilesTypes[]>(data);
  const { t } = useTranslation();

  const displayAlertError = (err: string): void => {
    if (customAlert) {
      customAlert(err, { type: 'error' });
    }
  };

  useEffect(
    () => {
      setLoading(true);
      fetchManifests(
        accessToken,
        baseURL,
        fetchFiles,
        removeFiles,
        formVersion,
        endpoint,
        undefined,
        getPayload
      )
        .catch(() => displayAlertError(t('There was a problem fetching manifest files')))
        .finally(() => setLoading(false));
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseURL, customAlert, endpoint, removeFiles, fetchFiles, formVersion, getPayload, accessToken]
  );

  useEffect(() => {
    setStateData(data);
  }, [data]);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toUpperCase();
    const searchResult = data.filter(
      (dt) =>
        dt.label.toUpperCase().includes(input) ||
        dt.identifier.toUpperCase().includes(input) ||
        (dt.module && dt.module.toUpperCase().includes(input))
    );
    setStateData(searchResult);
  };

  /**
   * called when download link is clicked
   *
   * @param {MouseEvent} e - mouse event
   * @param {ManifestFilesTypes} obj table row data
   */
  const onDownloadClick = (e: MouseEvent, obj: ManifestFilesTypes) => {
    e.preventDefault();
    downloadManifestFile(
      accessToken,
      baseURL,
      downloadEndPoint,
      obj,
      isJsonValidator,
      getPayload
    ).catch((error) => {
      if (customAlert) {
        customAlert(String(error), { type: 'error' });
      }
    });
  };

  /**
   * create edit upload link
   *
   * @param {Dictionary} obj table row data
   * @returns {Element} - link element
   */
  const linkToEditFile = (obj: ManifestFilesTypes): JSX.Element => {
    return <Link to={`${fileUploadUrl}/${uploadTypeUrl}/${obj.id}`}>{uploadEditLabel}</Link>;
  };
  const columns: Array<DrillDownColumn<ManifestFilesTypes>> = [
    {
      Header: identifierLabel,
      accessor: `identifier`,
    },
    {
      Header: fileNameLabel,
      accessor: `label`,
    },
    {
      Header: fileVersionLabel,
      accessor: `version`,
      maxWidth: 100,
    },
    {
      Header: createdAt,
      accessor: 'createdAt',
      Cell: ({ value }: Cell) => (() => <span>{formatDate(value)}</span>)(),
      maxWidth: 100,
    },
    {
      Header: editLabel,
      accessor: (obj: ManifestFilesTypes) => linkToEditFile(obj),
      disableSortBy: true,
      maxWidth: 80,
    },
    {
      Header: ' ',
      accessor: (obj: ManifestFilesTypes) =>
        (() => (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a href="#" onClick={(e) => onDownloadClick(e, obj)}>
            {downloadLabel}
          </a>
        ))(),
      disableSortBy: true,
      maxWidth: 80,
    },
  ];

  const moduleColumn = {
    Header: moduleLabel,
    accessor: (obj: ManifestFilesTypes) => (() => <span>{obj.module}</span>)(),
    disableSortBy: true,
    maxWidth: 100,
  };

  if (!isJsonValidator) {
    const moduleIndex = columns.length - 2;
    columns.splice(moduleIndex, 0, moduleColumn);
  }

  const DrillDownTableProps = {
    columns,
    data: stateData,
    useDrillDown: false,
    ...drillDownProps,
  };

  const searchFormProps = {
    onChangeHandler,
    placeholder,
  };

  if (LoadingComponent && loading) {
    return <div>{LoadingComponent}</div>;
  }

  return (
    <div>
      <Row>
        <Col xs="8">
          <SearchForm {...searchFormProps} />
        </Col>
        <Col xs="4">
          {isJsonValidator && (
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            <Link
              className="btn btn-secondary float-right"
              to={`${fileUploadUrl}/${uploadTypeUrl}`}
            >
              {uploadFileLabel}
            </Link>
          )}
        </Col>
      </Row>
      <DrillDownTable {...DrillDownTableProps} />
    </div>
  );
};

/** declear default props */
const defaultProps: FilesListDefaultProps = {
  createdAt: 'Created at',
  data: [],
  downloadLabel: 'Download',
  drillDownProps: {
    paginate: false,
  },
  editLabel: 'Edit',
  fetchFiles: fetchManifestFiles,
  fileNameLabel: 'File name',
  fileVersionLabel: 'File version',
  identifierLabel: 'Identifier',
  moduleLabel: 'Module',
  placeholder: 'Find files',
  removeFiles: removeManifestFiles,
  uploadEditLabel: 'Upload edit',
  uploadFileLabel: 'Upload new file',
  accessToken: '',
};

/** pass default props to component */
ManifestFilesList.defaultProps = defaultProps;

/** Connect the component to the store */

/** interface to describe props from mapStateToProps */
interface DispatchedStateProps {
  data: ManifestFilesTypes[];
}

/**
 * Map props to state
 *
 * @param {Store} state - the  redux store
 * @returns {Dictionary} - dispatched props
 */
const mapStateToProps = (state: Partial<Store>): DispatchedStateProps => {
  const data: ManifestFilesTypes[] = getAllManifestFilesArray(state);
  data.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  return {
    data,
  };
};

/** map dispatch to props */
const mapDispatchToProps = {
  fetchFiles: fetchManifestFiles,
  removeFiles: removeManifestFiles,
};

/** Connected ManifestFilesList component */
const ConnectedManifestFilesList = connect(mapStateToProps, mapDispatchToProps)(ManifestFilesList);

export { ManifestFilesList, ConnectedManifestFilesList };
