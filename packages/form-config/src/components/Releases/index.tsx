import React, { useEffect, useState, ChangeEvent } from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { OpenSRPService } from '@opensrp/server-service';
import { DrillDownTable, DrillDownColumn } from '@onaio/drill-down-table';
import { Store } from 'redux';
import { connect } from 'react-redux';
import releasesReducer, {
  fetchManifestReleases,
  releasesReducerName,
  getAllManifestReleasesArray,
  ManifestReleasesTypes,
} from '../../ducks/manifestReleases';
import { SearchBar, SearchBarDefaultProps } from '../SearchBar';
import { Link } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { FormConfigProps, DrillDownProps } from '../../helpers/types';
import {
  APP_ID_LABEL,
  APP_VERSION_LABEL,
  VIEW_FILES_LABEL,
  UPOL0AD_FILE_LABEL,
  IDENTIFIER_LABEL,
  FIND_RELEASES_LABEL,
  UPDATED_AT_LABEL,
} from '../../constants';
import { Cell } from 'react-table';
import { formatDate } from '../../helpers/utils';
import { Dictionary } from '@onaio/utils';

/** Register reducer */
reducerRegistry.register(releasesReducerName, releasesReducer);

/** default props interface */
export interface ReleasesDefaultProps extends SearchBarDefaultProps {
  appIdLabel: string;
  appVersionLabel: string;
  data: ManifestReleasesTypes[];
  drillDownProps: DrillDownProps;
  fetchReleases: typeof fetchManifestReleases;
  identifierLabel: string;
  updatedAt: string;
  uploadFileLabel: string;
  viewFilesLabel: string;
}

/** ManifestReleases props interface */
export interface ManifestReleasesProps extends FormConfigProps {
  currentUrl: string;
  formUploadUrl: string;
  uploadTypeUrl: string;
}

const ManifestReleases = (props: ManifestReleasesProps & ReleasesDefaultProps) => {
  const {
    baseURL,
    endpoint,
    getPayload,
    fetchReleases,
    data,
    LoadingComponent,
    debounceTime,
    placeholder,
    currentUrl,
    formUploadUrl,
    customAlert,
    uploadTypeUrl,
    appVersionLabel,
    appIdLabel,
    viewFilesLabel,
    uploadFileLabel,
    identifierLabel,
    updatedAt,
    drillDownProps,
  } = props;

  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState<ManifestReleasesTypes[]>(data);

  useEffect(() => {
    /** get manifest releases */
    if (data.length < 1) {
      setLoading(true);
      const clientService = new OpenSRPService(baseURL, endpoint, getPayload);
      clientService
        .list()
        .then((res: ManifestReleasesTypes[]) => fetchReleases(res))
        .catch((error) => {
          customAlert && customAlert(String(error), { type: 'error' });
        })
        .finally(() => setLoading(false));
    }
  }, [baseURL, endpoint, getPayload, customAlert, fetchReleases, data.length]);

  useEffect(() => {
    setStateData(data);
  }, [data]);

  /**
   * create link to manifest files
   *
   * @param {Dictionary} obj - ManifestReleasesTypes object
   * @returns {Element} - link element
   */
  const linkToFiles = (obj: ManifestReleasesTypes): JSX.Element => {
    return <Link to={`${currentUrl}/${obj.identifier}`}>{viewFilesLabel}</Link>;
  };

  const columns: Array<DrillDownColumn<ManifestReleasesTypes>> = [
    {
      Header: identifierLabel,
      accessor: (obj: ManifestReleasesTypes) => `V${obj.identifier}`,
    },
    {
      Header: appIdLabel,
      accessor: 'appId',
    },
    {
      Header: appVersionLabel,
      accessor: (obj: ManifestReleasesTypes) => `V${obj.appVersion}`,
    },
    {
      Header: updatedAt,
      accessor: 'updatedAt',
      Cell: ({ value }: Cell) => (() => <span>{formatDate(value)}</span>)(),
    },
    {
      Header: ' ',
      accessor: (obj: ManifestReleasesTypes) => linkToFiles(obj),
      disableSortBy: true,
    },
  ];

  const DrillDownTableProps = {
    columns,
    data: stateData,
    useDrillDown: false,
    ...drillDownProps,
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toUpperCase();
    const searchResult = data.filter(
      (dt) =>
        dt.appId.toUpperCase().includes(input) ||
        dt.appVersion.toUpperCase().includes(input) ||
        dt.identifier.toUpperCase().includes(input)
    );
    setStateData(searchResult);
  };

  const searchBarProps = {
    debounceTime,
    onChangeHandler,
    placeholder,
  };

  if (LoadingComponent && loading) {
    return <div>{LoadingComponent}</div>;
  }

  const uploadLink = {
    pathname: `${formUploadUrl}/${uploadTypeUrl}`,
    state: {
      fromReleases: true,
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
    </div>
  );
};

/** populate default props for ManifestReleases */
const defaultProps: ReleasesDefaultProps = {
  appIdLabel: APP_ID_LABEL,
  appVersionLabel: APP_VERSION_LABEL,
  data: [],
  debounceTime: 1000,
  drillDownProps: {
    paginate: false,
  },
  fetchReleases: fetchManifestReleases,
  identifierLabel: IDENTIFIER_LABEL,
  placeholder: FIND_RELEASES_LABEL,
  updatedAt: UPDATED_AT_LABEL,
  uploadFileLabel: UPOL0AD_FILE_LABEL,
  viewFilesLabel: VIEW_FILES_LABEL,
};

/** pass default props to component */
ManifestReleases.defaultProps = defaultProps;

/** Connect the component to the store */

/** interface to describe props from mapStateToProps */
interface DispatchedStateProps {
  data: ManifestReleasesTypes[];
}

/** Map props to state
 *
 * @param {Store} state - the  redux store
 * @returns {Dictionary} - dispatched props
 */
const mapStateToProps = (state: Partial<Store>): DispatchedStateProps => {
  const data = getAllManifestReleasesArray(state);
  data.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  return {
    data,
  };
};

/** map dispatch to props */
const mapDispatchToProps = { fetchReleases: fetchManifestReleases };

/** Connected ManifestReleases component */
const ConnectedManifestReleases = connect(mapStateToProps, mapDispatchToProps)(ManifestReleases);

export { ManifestReleases, ConnectedManifestReleases };
