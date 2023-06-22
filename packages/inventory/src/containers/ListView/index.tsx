import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Spin } from 'antd';
import { PageHeader } from '@opensrp/react-utils';
import { createChangeHandler, getQueryParams, SearchForm, TableLayout } from '@opensrp/react-utils';
import {
  TreeNode,
  fetchTree,
  hierarchyReducer,
  hierarchyReducerName,
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
import { columnsFactory, getNodePath, ActionsColumnCustomRender, TableData } from './utils';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Store } from 'redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { BrokenPage, useHandleBrokenPage } from '@opensrp/react-utils';
import { Helmet } from 'react-helmet';
import {
  LOCATIONS_GET_ALL_SYNC_ENDPOINT,
  INVENTORY_ADD_SERVICE_POINT,
  SEARCH_QUERY_PARAM,
} from '../../constants';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import { sendErrorNotification } from '@opensrp/notifications';
import { loadCount } from '../../helpers/dataLoaders';
import { useTranslation } from '../../mls';

/** make sure locations and hierarchy reducer is registered */
reducerRegistry.register(hierarchyReducerName, hierarchyReducer);
reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);

const structuresSelector = getLocationsBySearch();
const treesSelector = getTreesByIds();

/** props for the ServicePointList view */
interface ServicePointsListProps extends CommonProps {
  trees: TreeNode[];
  rootLocations: LocationUnit[];
  fetchLocationsCreator: typeof fetchLocationUnits;
  fetchTreesCreator: typeof fetchTree;
  structures: LocationUnit[];
}

const defaultProps = {
  ...defaultCommonProps,
  trees: [],
  rootLocations: [],
  fetchLocationsCreator: fetchLocationUnits,
  fetchTreesCreator: fetchTree,
  structures: [],
};

export type ServicePointsListTypes = ServicePointsListProps & RouteComponentProps;

/**
 * component that renders service point list
 *
 * @param props - the component props
 */
const ServicePointList = (props: ServicePointsListTypes) => {
  const { trees, rootLocations, fetchLocationsCreator, fetchTreesCreator, baseURL, structures } =
    props;
  const { broken, errorMessage, handleBrokenPage } = useHandleBrokenPage();
  const [loadingStructures, setLoadingStructures] = useState<boolean>(structures.length === 0);
  const { t } = useTranslation();

  const columns = columnsFactory(t);

  useEffect(() => {
    const getCountParams = {
      serverVersion: 0,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      is_jurisdiction: false,
    };
    loadCount(undefined, baseURL, getCountParams)
      .then((count) => {
        // get structures, this is the most important call for this page
        const params = {
          serverVersion: 0,
          // eslint-disable-next-line @typescript-eslint/naming-convention
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
    loadJurisdictions(jurisdictionsDispatcher, baseURL, undefined, undefined).catch((err: Error) =>
      sendErrorNotification(err.message)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (rootLocations.length > 0) {
      const promises = rootLocations
        .map((location) => location.id.toString())
        .map((rootId) => loadHierarchy(rootId, fetchTreesCreator, baseURL, undefined));
      Promise.all(promises).catch((err: Error) => sendErrorNotification(err.message));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(rootLocations)]);

  if (loadingStructures) {
    return <Spin size="large" className="custom-spinner" />;
  }

  if (broken) {
    return <BrokenPage errorMessage={errorMessage} />;
  }
  const structureNum = structures.length;
  const pageTitle = t('Service point inventory ({{structureNum}})', { structureNum });

  const datasource: TableData[] = structures.map((location) => {
    const locationToDisplay = {
      key: location.id,
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
      <PageHeader title={pageTitle}/>
      <Row className={'list-view pt-0'}>
        <Col className={'main-content'}>
          <div className="main-content__header">
            <SearchForm {...searchFormProps} size="middle" />
            <Link to={INVENTORY_ADD_SERVICE_POINT}>
              <Button type="primary">{t('+ Add service point')}</Button>
            </Link>
          </div>
          <TableLayout
            id="InventoryListView"
            persistState={true}
            className="custom-table"
            datasource={datasource}
            columns={columns}
            actions={{
              title: t('Actions'),
              render: ActionsColumnCustomRender(t),
              width: '20%',
            }}
          />
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
