import React, { useEffect, useState, ChangeEvent } from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { DrillDownTable, DrillDownColumn } from '@onaio/drill-down-table';
import { Store } from 'redux';
import { connect } from 'react-redux';
import {
  releasesReducer,
  fetchManifestReleases,
  releasesReducerName,
  getAllManifestReleasesArray,
  ManifestReleasesTypes,
  formatDate,
  fetchReleaseFiles,
} from '@opensrp/form-config-core';
import { SearchForm, SearchFormProps } from '@opensrp/react-utils';
import { Link } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { FormConfigProps, DrillDownProps } from '../../helpers/types';
import { Cell } from 'react-table';
import { Dictionary } from '@onaio/utils';
import { GetAccessTokenType } from '@opensrp/server-service';
import { useTranslation } from '../../mls';
/** Register reducer */
reducerRegistry.register(releasesReducerName, releasesReducer);

/** default props interface */
export interface ReleasesDefaultProps extends SearchFormProps {
  appIdLabel: string;
  appVersionLabel: string;
  data: ManifestReleasesTypes[];
  drillDownProps: DrillDownProps;
  fetchReleases: typeof fetchManifestReleases;
  identifierLabel: string;
  updatedAt: string;
  uploadFileLabel: string;
  viewFilesLabel: string;
  accessToken: string | GetAccessTokenType;
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
    accessToken,
  } = props;

  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState<ManifestReleasesTypes[]>(data);
  const { t } = useTranslation();
  const displayAlertError = (err: string): void => {
    if (customAlert) {
      customAlert(err, { type: 'error' });
    }
  };

  useEffect(() => {
    /** get manifest releases */
    if (data.length < 1) {
      setLoading(true);
      fetchReleaseFiles(accessToken, baseURL, fetchReleases, endpoint, undefined, getPayload)
        .catch(() => displayAlertError(t('An error occurred')))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseURL, endpoint, getPayload, customAlert, fetchReleases, data.length, accessToken]);

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

  const searchFormProps = {
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
    <>
      <Row>
        <Col xs="8">
          <SearchForm {...searchFormProps} />
        </Col>
        <Col xs="4">
          <Link className="btn btn-secondary float-right" to={uploadLink}>
            {uploadFileLabel}
          </Link>
        </Col>
      </Row>
      <DrillDownTable {...DrillDownTableProps} />
    </>
  );
};

/** populate default props for ManifestReleases */
const defaultProps: ReleasesDefaultProps = {
  appIdLabel: 'App ID',
  appVersionLabel: `App Version`,
  data: [],
  drillDownProps: {
    paginate: false,
  },
  fetchReleases: fetchManifestReleases,
  identifierLabel: 'Identifier',
  placeholder: 'Find Release',
  updatedAt: 'Updated at',
  uploadFileLabel: 'Upload New File',
  viewFilesLabel: 'View Files',
  accessToken: '',
  onChangeHandler: function (_event: React.ChangeEvent<HTMLInputElement>): void {
    throw new Error('Function not implemented.');
  },
};

/** pass default props to component */
ManifestReleases.defaultProps = defaultProps;

/** Connect the component to the store */

/** interface to describe props from mapStateToProps */
interface DispatchedStateProps {
  data: ManifestReleasesTypes[];
}

/**
 * Map props to state
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
