import React, { useEffect, useState, ChangeEvent, MouseEvent } from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { SearchBar, SearchBarDefaultProps } from '../SearchBar';
import { Store } from 'redux';
import { DrillDownTable, DrillDownColumn } from '@onaio/drill-down-table';
import { connect } from 'react-redux';
import { FormConfigProps, DrillDownProps } from '../../helpers/types';
import {
  draftReducer,
  fetchManifestDraftFiles,
  draftReducerName,
  getAllManifestDraftFilesArray,
  removeManifestDraftFiles,
  ManifestFilesTypes,
  formatDate,
  downloadManifestFile,
  makeRelease,
  fetchDrafts,
} from '@opensrp-web/form-config-core';
import { Button, Row, Col } from 'reactstrap';
import { Redirect } from 'react-router';
import { Cell } from 'react-table';
import { Link } from 'react-router-dom';
import { Dictionary } from '@onaio/utils';
import { GetAccessTokenType } from '@opensrp-web/server-service';
import lang from '../../lang';

/** Register reducer */
reducerRegistry.register(draftReducerName, draftReducer);

/** default props interface */
export interface DraftsDefaultProps extends SearchBarDefaultProps {
  clearDraftFiles: typeof removeManifestDraftFiles;
  createdAt: string;
  data: ManifestFilesTypes[];
  downloadLabel: string;
  drillDownProps: DrillDownProps;
  fetchDraftFiles: typeof fetchManifestDraftFiles;
  fileNameLabel: string;
  fileVersionLabel: string;
  identifierLabel: string;
  makeReleaseLabel: string;
  moduleLabel: string;
  uploadFileLabel: string;
  accessToken: GetAccessTokenType | string;
}

/** manifest Draft files props interface */
export interface ManifestDraftFilesProps extends DraftsDefaultProps, FormConfigProps {
  downloadEndPoint: string;
  formUploadUrl: string;
  manifestEndPoint: string;
  releasesUrl: string;
  uploadTypeUrl: string;
}

/**
 * Component ManifestDraftFiles
 *
 * @param {Dictionary} props - component props
 * @returns {Element} - rendered element
 */
const ManifestDraftFiles = (props: ManifestDraftFilesProps): JSX.Element => {
  const {
    baseURL,
    endpoint,
    getPayload,
    LoadingComponent,
    data,
    debounceTime,
    placeholder,
    fetchDraftFiles,
    clearDraftFiles,
    customAlert,
    downloadEndPoint,
    releasesUrl,
    manifestEndPoint,
    makeReleaseLabel,
    identifierLabel,
    fileNameLabel,
    fileVersionLabel,
    moduleLabel,
    downloadLabel,
    createdAt,
    uploadFileLabel,
    formUploadUrl,
    uploadTypeUrl,
    drillDownProps,
    accessToken,
  } = props;

  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState<ManifestFilesTypes[]>(data);
  const [ifDoneHere, setIfDoneHere] = useState(false);

  const displayAlertError = (err: string): void => {
    if (customAlert) {
      customAlert(err, { type: 'error' });
    }
  };

  useEffect(() => {
    fetchDrafts(
      accessToken,
      baseURL,
      fetchDraftFiles,
      setLoading,
      displayAlertError,
      endpoint,
      undefined,
      getPayload
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseURL, endpoint, getPayload, customAlert, fetchDraftFiles, accessToken]);

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
   * @param {Dictionary} obj table row data
   */
  const onDownloadClick = (e: MouseEvent, obj: ManifestFilesTypes) => {
    e.preventDefault();
    downloadManifestFile(accessToken, baseURL, downloadEndPoint, obj, false, getPayload).catch(
      (error) => {
        if (customAlert) {
          customAlert(String(error), { type: 'error' });
        }
      }
    );
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
    },
    {
      Header: createdAt,
      accessor: 'createdAt',
      Cell: ({ value }: Cell) => (() => <span>{formatDate(value)}</span>)(),
      maxWidth: 100,
    },
    {
      Header: moduleLabel,
      accessor: (obj: ManifestFilesTypes) => (() => <span>{obj.module}</span>)(),
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

  const DrillDownTableProps = {
    columns,
    data: stateData,
    useDrillDown: false,
    ...drillDownProps,
  };

  const searchBarProps = {
    debounceTime,
    onChangeHandler,
    placeholder,
  };

  if (LoadingComponent && loading) {
    return <div>{LoadingComponent}</div>;
  }

  if (ifDoneHere) {
    return <Redirect to={releasesUrl} />;
  }

  const uploadLink = {
    pathname: `${formUploadUrl}/${uploadTypeUrl}`,
    state: {
      fromDrafts: true,
    },
  };

  return (
    <div>
      <Row>
        <Col xs="8">
          <SearchBar {...searchBarProps} />
        </Col>
        <Col xs="4">
          <Link className="btn btn-secondary float-right" to={uploadLink}>
            {uploadFileLabel}
          </Link>
        </Col>
      </Row>
      <DrillDownTable {...DrillDownTableProps} />
      {data.length > 0 && (
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        <Button
          className="btn btn-md btn btn-primary float-right"
          color="primary"
          onClick={() =>
            makeRelease(
              data,
              accessToken,
              baseURL,
              clearDraftFiles,
              setIfDoneHere,
              displayAlertError,
              manifestEndPoint,
              undefined,
              getPayload
            )
          }
        >
          {makeReleaseLabel}
        </Button>
      )}
    </div>
  );
};

/** declear default props */
const defaultProps: DraftsDefaultProps = {
  clearDraftFiles: removeManifestDraftFiles,
  createdAt: lang.CREATED_AT,
  data: [],
  debounceTime: 1000,
  downloadLabel: lang.DOWNLOAD,
  drillDownProps: {
    paginate: false,
  },
  fetchDraftFiles: fetchManifestDraftFiles,
  fileNameLabel: lang.FILE_NAME,
  fileVersionLabel: lang.FILE_VERSION,
  identifierLabel: lang.IDENTIFIER,
  makeReleaseLabel: lang.MAKE_RELEASE,
  moduleLabel: lang.MODULE,
  placeholder: lang.FIND_DRAFT_FILES,
  uploadFileLabel: lang.UPLOAD_NEW_FILE,
  accessToken: '',
};

/** pass default props to component */
ManifestDraftFiles.defaultProps = defaultProps;

/** Connect the component to the store */

/** interface to describe props from mapStateToProps */
interface DispatchedStateProps {
  data: ManifestFilesTypes[];
}

/** Map props to state
 *
 * @param {Store} state - the  redux store
 * @returns {Dictionary} - dispatched props
 */
const mapStateToProps = (state: Partial<Store>): DispatchedStateProps => {
  const data: ManifestFilesTypes[] = getAllManifestDraftFilesArray(state);
  data.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  return {
    data,
  };
};

/** map dispatch to props */
const mapDispatchToProps = {
  clearDraftFiles: removeManifestDraftFiles,
  fetchDraftFiles: fetchManifestDraftFiles,
};

/** Connected ManifestDraftFiles component */
const ConnectedManifestDraftFiles = connect(
  mapStateToProps,
  mapDispatchToProps
)(ManifestDraftFiles);

export { ManifestDraftFiles, ConnectedManifestDraftFiles };
