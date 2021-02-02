import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Table } from 'antd';
import { getQueryParams, OpenSRPService } from '@opensrp/react-utils';
import {
  TreeNode,
  hierarchyReducer,
  hierarchyReducerName,
  locationUnitsReducer,
  locationUnitsReducerName,
  getLocationsByNameAndId,
} from '@opensrp/location-management';
import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import { ColumnsType } from 'antd/lib/table/interface';
import { columns } from './utils';
import { sendErrorNotification } from '@opensrp/notifications';
import { Spin } from 'antd';
import { Link, RouteComponentProps, useLocation } from 'react-router-dom';
import { Store } from 'redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { BrokenPage, useHandleBrokenPage } from '@opensrp/react-utils';
import { Helmet } from 'react-helmet';
import {
  GET_INVENTORY_BY_SERVICE_POINT,
  INVENTORY_SERVICE_POINT_LIST_VIEW,
  SEARCH_QUERY_PARAM,
  tablePaginationOptions,
} from '../../constants';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import {
  ADD_NEW_INVENTORY_ITEM,
  SERVICE_POINT_INVENTORY,
  EDIT_SERVICE_POINT,
  INVENTORY_ITEMS,
  ERROR_OCCURRED,
} from '../../lang';
import { TableData } from './utils';
import '../../index.css';
import {
  fetchInventories,
  getInventoriesArray,
  Inventory,
  inventoryReducer,
  inventoryReducerName,
} from '../../ducks/inventory';
import { inventory1, inventory2 } from '../../constants';
/** make sure locations and hierarchy reducer is registered */
reducerRegistry.register(hierarchyReducerName, hierarchyReducer);
reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);
reducerRegistry.register(inventoryReducerName, inventoryReducer);

const locationsBySearchSelector = getLocationsByNameAndId();

/** props for the ServicePointProfile view */
interface ServicePointsListProps extends CommonProps {
  LocationsByGeoLevel: TreeNode[];
  inventoriesArray: Inventory[];
  columns: ColumnsType<TableData>;
  fetchInventories: typeof fetchInventories;
  geoLevel: number;
}

export interface Props {
  opensrpBaseURL: string;
}

const defaultProps = {
  ...defaultCommonProps,
  inventoriesArray: [],
  LocationsByGeoLevel: [],
  columns: columns,
  fetchInventories,
  geoLevel: 0,
  opensrpBaseURL: '',
};

type ServicePointsListTypes = ServicePointsListProps & RouteComponentProps & Props;

interface DefaultGeographyItemProp {
  label: string;
  value: string;
}

export const GeographyItem = (props: DefaultGeographyItemProp) => {
  const { label, value } = props;
  return (
    <Col md={12} className="geography-item">
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
const ServicePointProfile = (props: ServicePointsListTypes) => {
  const { columns, opensrpBaseURL, inventoriesArray } = props;
  const { broken, errorMessage } = useHandleBrokenPage();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const loc = location.pathname.split('/');
    const spId = loc.pop();
    const serve = new OpenSRPService(`${GET_INVENTORY_BY_SERVICE_POINT}/${spId}`, opensrpBaseURL);
    serve
      .list()
      .then(() => {
        dispatch(fetchInventories([inventory1, inventory2]));
        setIsLoading(false);
      })
      .catch(() => sendErrorNotification(ERROR_OCCURRED));
  }, [dispatch, location.pathname, opensrpBaseURL]);

  if (isLoading) return <Spin size="large" />;

  if (broken) {
    return <BrokenPage errorMessage={errorMessage} />;
  }

  const pageTitle = `${SERVICE_POINT_INVENTORY}`;

  return (
    <>
      <div className="inventory-profile-header">
        <Row>
          <Col md={16}>
            <Link to={INVENTORY_SERVICE_POINT_LIST_VIEW}>
              <p className="go-back-text">Back to the list of service points</p>
            </Link>
            <p className="title">Alarobia Ambatomanga CSB Inventory</p>
            <Row>
              <GeographyItem label="Region" value="Analamanga" />
              <GeographyItem label="Type" value="CSB 1" />
              <GeographyItem label="District" value="Manajakandriana" />
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
            <Table
              dataSource={inventoriesArray}
              columns={columns}
              pagination={tablePaginationOptions}
            ></Table>
          </Col>
        </Row>
      </div>
    </>
  );
};

ServicePointProfile.defaultProps = defaultProps;

export { ServicePointProfile };

type MapStateToProps = Pick<ServicePointsListTypes, 'LocationsByGeoLevel' | 'inventoriesArray'>;
type MapDispatchToProps = Pick<ServicePointsListTypes, 'fetchInventories'>;

const mapStateToProps = (
  state: Partial<Store>,
  ownProps: ServicePointsListTypes
): MapStateToProps => {
  // get query value
  const searchText = getQueryParams(ownProps.location)[SEARCH_QUERY_PARAM] as string;
  const filters = {
    geoLevel: ownProps.geoLevel,
    searchQuery: searchText,
  };
  const searchedLocations = locationsBySearchSelector(state, filters);
  const inventoriesArray = getInventoriesArray(state);
  return { LocationsByGeoLevel: searchedLocations, inventoriesArray };
};

const mapDispatchToProps: MapDispatchToProps = {
  fetchInventories,
};

const ConnectedServicePointProfile = connect(
  mapStateToProps,
  mapDispatchToProps
)(ServicePointProfile);
export { ConnectedServicePointProfile };
