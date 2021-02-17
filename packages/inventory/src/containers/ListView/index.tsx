import React, { useEffect, useState } from 'react';
import { Row, PageHeader, Col, Button, Table } from 'antd';
import {
  createChangeHandler,
  getQueryParams,
  OpenSRPService,
  SearchForm,
} from '@opensrp/react-utils';
import {
  TreeNode,
  hierarchyReducer,
  hierarchyReducerName,
  fetchTree,
  locationUnitsReducer,
  locationUnitsReducerName,
  fetchLocationUnits,
  loadJurisdictions,
  loadHierarchy,
  LocationUnit,
  getLocationsBySearch,
  getTreesByIds,
} from '@opensrp/location-management';
import { connect } from 'react-redux';
import { ColumnsType } from 'antd/lib/table/interface';
import { ServicePointsLoading, columns, getNodePath } from './utils';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Store } from 'redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { BrokenPage, useHandleBrokenPage } from '@opensrp/react-utils';
import { Helmet } from 'react-helmet';
import {
  LOCATIONS_GET_ALL_SYNC_ENDPOINT,
  INVENTORY_ADD_SERVICE_POINT,
  SEARCH_QUERY_PARAM,
  TableColumnsNamespace,
  tablePaginationOptions,
} from '../../constants';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import { ADD_SERVICE_POINT, SERVICE_POINT_INVENTORY } from '../../lang';
import { TableData } from './utils';
import { sendErrorNotification } from '@opensrp/notifications';
import { loadCount } from '../../helpers/dataLoaders';

/** make sure locations and hierarchy reducer is registered */
reducerRegistry.register(hierarchyReducerName, hierarchyReducer);
reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);

const structuresSelector = getLocationsBySearch();
const treesSelector = getTreesByIds();

/** props for the ServicePointList view */
interface ServicePointsListProps extends CommonProps {
  trees: TreeNode[];
  rootLocations: LocationUnit[];
  columns: ColumnsType<TableData>;
  service: typeof OpenSRPService;
  fetchLocationsCreator: typeof fetchLocationUnits;
  fetchTreesCreator: typeof fetchTree;
  structures: LocationUnit[];
}

const defaultProps = {
  ...defaultCommonProps,
  trees: [],
  rootLocations: [],
  columns: columns,
  fetchLocationsCreator: fetchLocationUnits,
  fetchTreesCreator: fetchTree,
  service: OpenSRPService,
  structures: [],
};

export type ServicePointsListTypes = ServicePointsListProps & RouteComponentProps;

/** component that renders service point list
 *
 * @param props - the component props
 */
const ServicePointList = (props: ServicePointsListTypes) => {
  const {
    service,
    trees,
    rootLocations,
    columns,
    fetchLocationsCreator,
    fetchTreesCreator,
    baseURL,
    structures,
  } = props;
  const { broken, errorMessage, handleBrokenPage } = useHandleBrokenPage();
  const [loadingStructures, setLoadingStructures] = useState<boolean>(structures.length === 0);

  useEffect(() => {
    const getCountParams = {
      serverVersion: 0,
      // eslint-disable-next-line @typescript-eslint/camelcase
      is_jurisdiction: false,
    };
    loadCount(undefined, baseURL, getCountParams)
      .then((count) => {
        // get structures, this is the most important call for this page
        const params = {
          serverVersion: 0,
          // eslint-disable-next-line @typescript-eslint/camelcase
          is_jurisdiction: false,
          limit: count,
        };
        const structuresDispatcher = (locations: LocationUnit[] = []) => {
          return fetchLocationsCreator(locations, false);
        };
        return loadJurisdictions(
          structuresDispatcher,
          baseURL,
          params,
          {},
          service,
          LOCATIONS_GET_ALL_SYNC_ENDPOINT
        ).catch((err: Error) => {
          throw err;
        });
      })
      .catch((err) => handleBrokenPage(err))
      .finally(() => setLoadingStructures(false));
    // get root Jurisdictions so we can later get the trees.
    const jurisdictionsDispatcher = (locations: LocationUnit[] = []) => {
      return fetchLocationsCreator(locations, true);
    };
    loadJurisdictions(
      jurisdictionsDispatcher,
      baseURL,
      undefined,
      undefined,
      service
    ).catch((err: Error) => sendErrorNotification(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (rootLocations.length > 0) {
      const promises = rootLocations
        .map((location) => location.id.toString())
        .map((rootId) => loadHierarchy(rootId, fetchTreesCreator, baseURL, undefined, service));
      Promise.all(promises).catch((err: Error) => sendErrorNotification(err.message));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(rootLocations)]);

  if (loadingStructures) {
    return <ServicePointsLoading />;
  }

  if (broken) {
    return <BrokenPage errorMessage={errorMessage} />;
  }

  const pageTitle = `${SERVICE_POINT_INVENTORY} (${structures.length})`;
  // add a key prop to the array data to be consumed by the table
  const dataSource = structures.map((location) => {
    const locationToDisplay = {
      key: `${TableColumnsNamespace}-${location.id}`,
      type: location.properties.type as string,
      serviceName: location.properties.name,
      location: getNodePath(location, trees),
      servicePointId: location.id,
    };
    return locationToDisplay;
  });

  const searchFormProps = {
    defaultValue: getQueryParams(props.location)[SEARCH_QUERY_PARAM],
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
            <Link to={INVENTORY_ADD_SERVICE_POINT}>
              <Button type="primary" size="large">
                {ADD_SERVICE_POINT}
              </Button>
            </Link>
          </div>
          <Table
            className="custom-table"
            dataSource={dataSource}
            columns={columns}
            pagination={tablePaginationOptions}
          ></Table>
        </Col>
      </Row>
    </div>
  );
};

ServicePointList.defaultProps = defaultProps;

export { ServicePointList };

export type MapStateToProps = Pick<
  ServicePointsListTypes,
  'rootLocations' | 'structures' | 'trees'
>;
export type MapDispatchToProps = Pick<
  ServicePointsListTypes,
  'fetchLocationsCreator' | 'fetchTreesCreator'
>;

export const mapStateToProps = (
  state: Partial<Store>,
  ownProps: ServicePointsListTypes
): MapStateToProps => {
  // get query value
  const searchText = getQueryParams(ownProps.location)[SEARCH_QUERY_PARAM] as string;
  const filters = {
    searchQuery: searchText,
    isJurisdiction: false,
  };
  const rootLocations = structuresSelector(state, { ...filters, isJurisdiction: true });
  const structures = structuresSelector(state, filters);
  const trees = treesSelector(state, {});
  return { rootLocations, structures, trees };
};

export const mapDispatchToProps: MapDispatchToProps = {
  fetchLocationsCreator: fetchLocationUnits,
  fetchTreesCreator: fetchTree,
};

const ConnectedServicePointList = connect(mapStateToProps, mapDispatchToProps)(ServicePointList);
export { ConnectedServicePointList };
