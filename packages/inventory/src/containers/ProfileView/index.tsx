import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'antd';
import { OpenSRPService, Resource404, BrokenPage, useHandleBrokenPage } from '@opensrp/react-utils';
import {
  hierarchyReducer,
  hierarchyReducerName,
  locationUnitsReducer,
  fetchLocationUnits,
  locationUnitsReducerName,
  LocationUnit,
  loadJurisdictions,
  getLocationsBySearch,
  getTreesByIds,
  loadHierarchy,
  fetchTree,
} from '@opensrp/location-management';
import { useDispatch, useSelector } from 'react-redux';
import { ColumnsType } from 'antd/lib/table/interface';
import { columns, GeographicLocationInterface } from './utils';
import { sendErrorNotification } from '@opensrp/notifications';
import { Spin } from 'antd';
import { Link, RouteComponentProps, useParams } from 'react-router-dom';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { Helmet } from 'react-helmet';
import {
  INVENTORY_SERVICE_POINT_LIST_VIEW,
  GEOGRAPHIC_LEVEL,
  LOCATIONS_GET_ALL_SYNC_ENDPOINT,
  INVENTORY_SERVICE_POINT_PROFILE_PARAM,
  INVENTORY_EDIT_SERVICE_POINT,
} from '../../constants';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import {
  SERVICE_POINT_INVENTORY,
  EDIT_SERVICE_POINT,
  REGION_LABEL,
  DISTRICT_LABEL,
  TYPE_LABEL,
  LAT_LONG_LABEL,
  COMMUNE_LABEL,
  SERVICE_POINT_ID_LABEL,
  BACK_TO_SERVICE_POINT_LIST,
} from '../../lang';
import '../../index.css';
import { fetchInventories, Inventory } from '../../ducks/inventory';
import { getNodePath } from './utils';
import { InventoryList } from '../../components/InventoryList';
/** make sure locations and hierarchy reducer is registered */
reducerRegistry.register(hierarchyReducerName, hierarchyReducer);
reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);

const structuresSelector = getLocationsBySearch();
const treesSelector = getTreesByIds();

/** props for the ServicePointProfile view */
interface ServicePointsProfileProps extends CommonProps {
  columns: ColumnsType<Inventory>;
  fetchInventories: typeof fetchInventories;
  opensrpBaseURL: string;
  service: typeof OpenSRPService;
}

const defaultProps = {
  ...defaultCommonProps,
  columns: columns,
  fetchInventories,
  opensrpBaseURL: '',
  service: OpenSRPService,
};

type ServicePointsProfileTypes = ServicePointsProfileProps & RouteComponentProps;

export const findPath = (path: GeographicLocationInterface[], geoLevel: number) => {
  return path.find((x: GeographicLocationInterface) => x.geographicLevel === geoLevel);
};

interface DefaultGeographyItemProp {
  label: string;
  value?: string | number | string[] | number[];
}

/** component that renders Geography Items
 *
 * @param props - the component props
 */
export const GeographyItem = (props: DefaultGeographyItemProp) => {
  const { label, value } = props;
  return (
    <Col md={24} className="geography-item">
      <p className="label">{label}:</p>
      <p className="value"> {value}</p>
    </Col>
  );
};

/** component that renders service point list
 *
 * @param props - the component props
 */
const ServicePointProfile = (props: ServicePointsProfileTypes) => {
  const { opensrpBaseURL, service } = props;
  const { broken, errorMessage, handleBrokenPage } = useHandleBrokenPage();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const params = useParams<{ [INVENTORY_SERVICE_POINT_PROFILE_PARAM]: string }>();
  const spId = params[INVENTORY_SERVICE_POINT_PROFILE_PARAM];

  const filters = {
    isJurisdiction: false,
  };
  const [structure] = useSelector((state) =>
    structuresSelector(state, { ...filters, searchQuery: spId })
  );
  const rootLocations = useSelector((state) =>
    structuresSelector(state, { ...filters, isJurisdiction: true })
  );
  const trees = useSelector((state) => treesSelector(state, {}));

  useEffect(() => {
    // get structures, this is the most important call for this page
    const params = {
      serverVersion: 0,
      // eslint-disable-next-line @typescript-eslint/camelcase
      is_jurisdiction: false,
    };
    const structuresDispatcher = (locations: LocationUnit[] = []) => {
      return dispatch(fetchLocationUnits(locations, false));
    };
    loadJurisdictions(
      structuresDispatcher,
      opensrpBaseURL,
      params,
      {},
      service,
      LOCATIONS_GET_ALL_SYNC_ENDPOINT
    )
      .catch((err: Error) => {
        handleBrokenPage(err);
      })
      .finally(() => setIsLoading(false));
    // get root Jurisdictions so we can later get the trees.
    const jurisdictionsDispatcher = (locations: LocationUnit[] = []) => {
      return dispatch(fetchLocationUnits(locations, true));
    };
    loadJurisdictions(
      jurisdictionsDispatcher,
      opensrpBaseURL,
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
        .map((rootId) => loadHierarchy(rootId, fetchTree, opensrpBaseURL, undefined, service));
      Promise.all(promises).catch((err: Error) => sendErrorNotification(err.message));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(rootLocations)]);

  if (isLoading) return <Spin size="large" />;

  if (broken) {
    return <BrokenPage errorMessage={errorMessage} />;
  }

  if (!(structure as LocationUnit | undefined)) {
    return <Resource404 />;
  }

  const pageTitle = `${SERVICE_POINT_INVENTORY}`;
  const nodePath = getNodePath(structure, trees);

  return (
    <>
      <div className="inventory-profile-header">
        <Row>
          <Col md={16}>
            <Link to={INVENTORY_SERVICE_POINT_LIST_VIEW}>
              <p className="go-back-text">{BACK_TO_SERVICE_POINT_LIST}</p>
            </Link>
            <p className="title">{structure.properties.name}</p>
            <Row>
              <Col md={12}>
                <GeographyItem
                  label={REGION_LABEL}
                  value={findPath(nodePath, GEOGRAPHIC_LEVEL.REGION)?.label}
                />
                <GeographyItem
                  label={DISTRICT_LABEL}
                  value={findPath(nodePath, GEOGRAPHIC_LEVEL.DISTRICT)?.label}
                />
                <GeographyItem
                  label={COMMUNE_LABEL}
                  value={findPath(nodePath, GEOGRAPHIC_LEVEL.COMMUNE)?.label}
                />
              </Col>
              <Col md={12}>
                <GeographyItem label={TYPE_LABEL} value={structure.properties.type} />
                <GeographyItem label={LAT_LONG_LABEL} value={''} />
                <GeographyItem label={SERVICE_POINT_ID_LABEL} value={spId} />
              </Col>
            </Row>
          </Col>
          <Col md={8} className="flex-center">
            <Link to={`${INVENTORY_EDIT_SERVICE_POINT}/${spId}`}>
              <Button type="primary" size="large">
                {EDIT_SERVICE_POINT}
              </Button>
            </Link>
          </Col>
        </Row>
      </div>
      <div className="content-section">
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>
        <InventoryList servicePointId={spId} opensrpBaseURL={opensrpBaseURL} />
      </div>
    </>
  );
};

ServicePointProfile.defaultProps = defaultProps;

export { ServicePointProfile };
