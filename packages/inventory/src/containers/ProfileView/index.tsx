import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Table } from 'antd';
import { OpenSRPService } from '@opensrp/react-utils';
import {
  TreeNode,
  hierarchyReducer,
  hierarchyReducerName,
  locationUnitsReducer,
  fetchLocationUnits,
  locationUnitsReducerName,
  LocationUnit,
  loadJurisdictions,
  getLocationsBySearch,
  getTreesByIds,
} from '@opensrp/location-management';
import { connect, useDispatch, useSelector } from 'react-redux';
import { ColumnsType } from 'antd/lib/table/interface';
import { columns } from './utils';
import { sendErrorNotification } from '@opensrp/notifications';
import { Spin } from 'antd';
import { Link, RouteComponentProps, useParams } from 'react-router-dom';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { BrokenPage, useHandleBrokenPage } from '@opensrp/react-utils';
import { Helmet } from 'react-helmet';
import {
  GET_INVENTORY_BY_SERVICE_POINT,
  INVENTORY_SERVICE_POINT_LIST_VIEW,
  GEOGRAPHIC_LEVEL,
  LOCATIONS_GET_ALL_SYNC_ENDPOINT,
  INVENTORY_SERVICE_POINT_PROFILE_PARAM,
} from '../../constants';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import {
  ADD_NEW_INVENTORY_ITEM,
  SERVICE_POINT_INVENTORY,
  EDIT_SERVICE_POINT,
  INVENTORY_ITEMS,
  ERROR_OCCURRED,
  REGION_LABEL,
  DISTRICT_LABEL,
  TYPE_LABEL,
  LAT_LONG_LABEL,
  COMMUNE_LABEL,
  SERVICE_POINT_ID_LABEL,
  BACK_TO_SERVICE_POINT_LIST,
} from '../../lang';
import '../../index.css';
import {
  fetchInventories,
  getInventoriesByExpiry,
  inventoryReducer,
  inventoryReducerName,
  Inventory,
} from '../../ducks/inventory';
import { getNodePath } from './utils';
import { ServiceType } from '@opensrp/location-management/src/ducks/location-units';
import { Store } from 'redux';
/** make sure locations and hierarchy reducer is registered */
reducerRegistry.register(hierarchyReducerName, hierarchyReducer);
reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);
reducerRegistry.register(inventoryReducerName, inventoryReducer);

const structuresSelector = getLocationsBySearch();
const treesSelector = getTreesByIds();

/** props for the ServicePointProfile view */
interface ServicePointsProfileProps extends CommonProps {
  LocationsByGeoLevel: TreeNode[];
  columns: ColumnsType<Inventory>;
  fetchInventories: typeof fetchInventories;
  service: typeof OpenSRPService;
  structures: LocationUnit[];
}

export interface Props {
  opensrpBaseURL: string;
}

const defaultProps = {
  ...defaultCommonProps,
  LocationsByGeoLevel: [],
  columns: columns,
  fetchInventories,
  opensrpBaseURL: '',
  service: OpenSRPService,
  structures: [],
};

type ServicePointsProfileTypes = ServicePointsProfileProps & RouteComponentProps & Props;

export interface GeographicLocationInterface {
  geographicLevel?: number;
  label?: number;
}

export const findPath = (path: GeographicLocationInterface[], geoLevel: number) => {
  return path.find((x: GeographicLocationInterface) => x.geographicLevel === geoLevel);
};

interface DefaultGeographyItemProp {
  label: string;
  value?: string | number | string[] | number[] | ServiceType[];
}

/** component that renders Geography Items
 *
 * @param props - the component props
 */
export const GeographyItem = (props: DefaultGeographyItemProp) => {
  const { label, value } = props;
  return (
    <Col md={24} className="geography-item">
      <p className="item">
        {label}: {value}
      </p>
    </Col>
  );
};

/** component that renders service point list
 *
 * @param props - the component props
 */
const ServiceProfile = (props: ServicePointsProfileTypes) => {
  const { columns, opensrpBaseURL, service, structures } = props;
  const { broken, errorMessage, handleBrokenPage } = useHandleBrokenPage();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const params = useParams<{ [INVENTORY_SERVICE_POINT_PROFILE_PARAM]: string }>();
  const spId = params[INVENTORY_SERVICE_POINT_PROFILE_PARAM];

  const inventoriesArray = useSelector((state) =>
    getInventoriesByExpiry(state, { expired: false })
  );
  const [structure] = structures;
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
    ).catch((err: Error) => {
      handleBrokenPage(err);
      setIsLoading(false);
    });
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
    const serve = new OpenSRPService(`${GET_INVENTORY_BY_SERVICE_POINT}${spId}`, opensrpBaseURL);
    serve
      .list()
      .then((res: Inventory[]) => {
        dispatch(fetchInventories(res));
        setIsLoading(false);
      })
      .catch(() => sendErrorNotification(ERROR_OCCURRED));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opensrpBaseURL, spId]);

  if (isLoading) return <Spin size="large" />;

  if (broken) {
    return <BrokenPage errorMessage={errorMessage} />;
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
            <Link to={EDIT_SERVICE_POINT}>
              <Button type="primary" size="large" disabled>
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
        <Row className={'list-view'}>
          <Col className={'main-content'}>
            <div className="inventory-profile">
              <h6>{INVENTORY_ITEMS}</h6>
              <Link to={ADD_NEW_INVENTORY_ITEM}>
                <Button type="primary" size="large" disabled>
                  {ADD_NEW_INVENTORY_ITEM}
                </Button>
              </Link>
            </div>
            <Table dataSource={inventoriesArray} columns={columns}></Table>
          </Col>
        </Row>
      </div>
    </>
  );
};

ServiceProfile.defaultProps = defaultProps;

export { ServiceProfile };

type MapStateToProps = Pick<ServicePointsProfileTypes, 'structures'>;

const mapStateToProps = (
  state: Partial<Store>,
  ownProps: ServicePointsProfileTypes
): MapStateToProps => {
  const searchText = ownProps.match.params as { [INVENTORY_SERVICE_POINT_PROFILE_PARAM]: string };
  const filters = {
    searchQuery: searchText[INVENTORY_SERVICE_POINT_PROFILE_PARAM],
    isJurisdiction: false,
  };
  const structures = structuresSelector(state, filters);
  return { structures };
};

const ServicePointProfile = connect(mapStateToProps)(ServiceProfile);
export { ServicePointProfile };
