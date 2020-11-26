import React, { useEffect, useState, ChangeEvent, MouseEvent } from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { OpenSRPService } from '@opensrp/server-service';
import { SearchBar, SearchBarDefaultProps } from '../SearchBar';
import { Store } from 'redux';
import { DrillDownTable, DrillDownColumn } from '@onaio/drill-down-table';
import { connect } from 'react-redux';
import { FormConfigProps, DrillDownProps } from '../../helpers/types';
import DraftFilesReducer, {
  fetchManifestDraftFiles,
  draftReducerName,
  getAllManifestDraftFilesArray,
  removeManifestDraftFiles,
} from '../../ducks/manifestDraftFiles';
import { Button, Row, Col } from 'reactstrap';
import { ManifestFilesTypes } from '../../ducks/manifestFiles';
import { Redirect } from 'react-router';
import {
  MAKE_RELEASE_LABEL,
  FILE_NAME_LABEL,
  FILE_VERSION_LABEL,
  IDENTIFIER_LABEL,
  MODULE_LABEL,
  DOWNLOAD_LABEL,
  FIND_DRAFT_RELEASES_LABEL,
  CREATED_AT_LABEL,
  UPOL0AD_FILE_LABEL,
} from '../../constants';
import { Cell } from 'react-table';
import { formatDate, downloadManifestFile } from '../../helpers/utils';
import { Link } from 'react-router-dom';
import { Dictionary } from '@onaio/utils';

/** Register reducer */
reducerRegistry.register(draftReducerName, DraftFilesReducer);

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
  } = props;

  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState<ManifestFilesTypes[]>(data);
  const [ifDoneHere, setIfDoneHere] = useState(false);

  useEffect(() => {
    /** get manifest Draftfiles */
    setLoading(true);
    /* eslint-disable-next-line @typescript-eslint/camelcase */
    const params = { is_draft: true };
    const clientService = new OpenSRPService(baseURL, endpoint, getPayload);
    clientService
      .list(params)
      .then((res: ManifestFilesTypes[]) => {
        fetchDraftFiles(res);
      })
      .catch((error) => {
        if (customAlert) {
          customAlert(String(error), { type: 'error' });
        }
      })
      .finally(() => setLoading(false));
  }, [baseURL, endpoint, getPayload, customAlert, fetchDraftFiles]);

  useEffect(() => {
    setStateData(data);
  }, [data]);

  /**
   * create a manifest file
   *
   * @param {MouseEvent} e - mouse event
   */
  const onMakeReleaseClick = (e: MouseEvent) => {
    e.preventDefault();
    const identifiers = data.map((form) => form.identifier);
    const json = {
      /* eslint-disable-next-line @typescript-eslint/camelcase */
      forms_version: data[0].version,
      identifiers,
    };
    const clientService = new OpenSRPService(baseURL, manifestEndPoint, getPayload);
    clientService
      .create({ json: JSON.stringify(json) })
      .then(() => {
        clearDraftFiles();
        setIfDoneHere(true);
      })
      .catch((err) => {
        if (customAlert) {
          customAlert(String(err), { type: 'error' });
        }
      });
  };

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
    downloadManifestFile(baseURL, downloadEndPoint, obj, false, getPayload).catch((error) => {
      if (customAlert) {
        customAlert(String(error), { type: 'error' });
      }
    });
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
          onClick={onMakeReleaseClick}
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
  createdAt: CREATED_AT_LABEL,
  data: [],
  debounceTime: 1000,
  downloadLabel: DOWNLOAD_LABEL,
  drillDownProps: {
    paginate: false,
  },
  fetchDraftFiles: fetchManifestDraftFiles,
  fileNameLabel: FILE_NAME_LABEL,
  fileVersionLabel: FILE_VERSION_LABEL,
  identifierLabel: IDENTIFIER_LABEL,
  makeReleaseLabel: MAKE_RELEASE_LABEL,
  moduleLabel: MODULE_LABEL,
  placeholder: FIND_DRAFT_RELEASES_LABEL,
  uploadFileLabel: UPOL0AD_FILE_LABEL,
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
