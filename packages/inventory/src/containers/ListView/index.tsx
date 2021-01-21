import React, { useEffect, useState } from 'react';
import { Row, PageHeader, Col, Button, Table } from 'antd';
import { createChangeHandler, OpenSRPService, SearchForm } from '@opensrp/react-utils';
import {
  TreeNode,
  hierarchyReducer,
  hierarchyReducerName,
  fetchTree,
  locationUnitsReducer,
  locationUnitsReducerName,
  getLocationsByLevel,
  fetchLocationUnits,
  loadJurisdictions,
  loadHierarchy,
  LocationUnit,
  getLocationUnitsArray,
} from '@opensrp/location-management';
import { connect } from 'react-redux';
import { ColumnsType } from 'antd/lib/table/interface';
import { ServicePointsLoading, columns, getNodePath } from './utils';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Store } from 'redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { BrokenPage, useHandleBrokenPage } from '@opensrp/react-utils';
import { Helmet } from 'react-helmet';
import { SEARCH_QUERY_PARAM, TableColumnsNamespace } from '../../constants';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import { ADD_SERVICE_POINT, SERVICE_POINT_INVENTORY } from '../../lang';
import { TableData } from './utils';

/** make sure locations and hierarchy reducer is registered */
reducerRegistry.register(hierarchyReducerName, hierarchyReducer);
reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);

const locationsByLevelSelector = getLocationsByLevel();

/** props for the ServicePointList view */
interface ServicePointsListProps extends CommonProps {
  LocationsByGeoLevel: TreeNode[];
  rootLocations: LocationUnit[];
  columns: ColumnsType<TableData>;
  service: typeof OpenSRPService;
  fetchLocationsCreator: typeof fetchLocationUnits;
  fetchTreesCreator: typeof fetchTree;
  geoLevel: number;
}

const defaultProps = {
  ...defaultCommonProps,
  LocationsByGeoLevel: [],
  rootLocations: [],
  columns: columns,
  fetchLocationsCreator: fetchLocationUnits,
  fetchTreesCreator: fetchTree,
  service: OpenSRPService,
  geoLevel: 0,
};

export type ServicePointsListTypes = ServicePointsListProps & RouteComponentProps;

/** component that renders service point list
 *
 * @param props - the component props
 */
const ServicePointList = (props: ServicePointsListTypes) => {
  const {
    service,
    LocationsByGeoLevel,
    rootLocations,
    columns,
    fetchLocationsCreator,
    fetchTreesCreator,
    baseURL,
  } = props;
  const { broken, errorMessage, handleBrokenPage } = useHandleBrokenPage();
  const [loadingJurisdictions, setLoadingJurisdictions] = useState<boolean>(
    rootLocations.length === 0
  );
  const [loadingHierarchy, setLoadingHierarchy] = useState<boolean>(
    LocationsByGeoLevel.length === 0
  );

  useEffect(() => {
    loadJurisdictions(fetchLocationsCreator, baseURL, undefined, undefined, service)
      .catch((err: Error) => handleBrokenPage(err))
      .finally(() => setLoadingJurisdictions(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (rootLocations.length > 0) {
      const promises = rootLocations
        .map((location) => location.id.toString())
        .map((rootId) => loadHierarchy(rootId, fetchTreesCreator, baseURL, undefined, service));
      Promise.all(promises)
        .catch((err: Error) => handleBrokenPage(err))
        .finally(() => setLoadingHierarchy(false));
    } else {
      setLoadingHierarchy(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(rootLocations)]);

  if (loadingHierarchy || loadingJurisdictions) {
    return <ServicePointsLoading />;
  }

  if (broken) {
    return <BrokenPage errorMessage={errorMessage} />;
  }

  const pageTitle = `${SERVICE_POINT_INVENTORY} (${LocationsByGeoLevel.length})`;
  // add a key prop to the array data to be consumed by the table
  const dataSource = LocationsByGeoLevel.map((location) => {
    const locationToDisplay = {
      key: `${TableColumnsNamespace}-${location.model.id}`,
      type: '',
      serviceName: location.model.label,
      location: getNodePath(location),
      servicePointId: location.model.id,
    };
    return locationToDisplay;
  });

  const searchFormProps = {
    onChangeHandler: createChangeHandler(SEARCH_QUERY_PARAM, props),
  };

  return (
    <div className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} className="page-header"></PageHeader>
      <Row className={'list-view'}>
        <Col className={'main-content'}>
          <div className="main-content__header">
            <SearchForm {...searchFormProps} />
            <Link to={ADD_SERVICE_POINT}>
              <Button type="primary" size="large" disabled>
                {ADD_SERVICE_POINT}
              </Button>
            </Link>
          </div>
          <Table dataSource={dataSource} columns={columns} pagination={}></Table>
        </Col>
      </Row>
    </div>
  );
};

ServicePointList.defaultProps = defaultProps;

export { ServicePointList };

export type MapStateToProps = Pick<ServicePointsListTypes, 'LocationsByGeoLevel' | 'rootLocations'>;
export type MapDispatchToProps = Pick<
  ServicePointsListTypes,
  'fetchLocationsCreator' | 'fetchTreesCreator'
>;

export const mapStateToProps = (
  state: Partial<Store>,
  ownProps: ServicePointsListTypes
): MapStateToProps => {
  const filters = {
    geoLevel: ownProps.geoLevel,
  };
  const rootLocations = getLocationUnitsArray(state);
  const LocationsByGeoLevel = locationsByLevelSelector(state, filters);
  return { rootLocations, LocationsByGeoLevel };
};

export const mapDispatchToProps: MapDispatchToProps = {
  fetchLocationsCreator: fetchLocationUnits,
  fetchTreesCreator: fetchTree,
};

const ConnectedServicePointList = connect(mapStateToProps, mapDispatchToProps)(ServicePointList);
export { ConnectedServicePointList };
