import React, { useEffect } from 'react';
import { Row, Col, Button, Table } from 'antd';
import { getTableColumns } from './utils';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  GET_INVENTORY_BY_SERVICE_POINT,
  INVENTORY_SERVICE_POINT_PROFILE_VIEW,
  URL_INVENTORY_ADD,
  URL_INVENTORY_EDIT,
  TableColumnsNamespace,
} from '../../constants';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import { ADD_NEW_INVENTORY_ITEM, ERROR_GETTING_INVENTORIES, INVENTORY_ITEMS } from '../../lang';
import {
  fetchInventories,
  getInventoriesByExpiry,
  Inventory,
  inventoryReducer,
  inventoryReducerName,
} from '../../ducks/inventory';
import { Alert } from 'antd';
import reducerRegistry from '@onaio/redux-reducer-registry';
import '../../index.css';
import { OpenSRPService, useHandleBrokenPage } from '@opensrp/react-utils';
import { useDispatch, useSelector } from 'react-redux';

reducerRegistry.register(inventoryReducerName, inventoryReducer);
/** props for the InventoryList view */
interface InventoryListProps extends CommonProps {
  servicePointId: string;
  opensrpBaseURL: string;
  addInventoryURL: string; // route add inventory
  editInventoryURL: string; // route edit inventory
  servicePointProfileURL: string; // route service point profile
}

const defaultProps = {
  ...defaultCommonProps,
  servicePointId: '',
  opensrpBaseURL: '',
  addInventoryURL: URL_INVENTORY_ADD,
  editInventoryURL: URL_INVENTORY_EDIT,
  servicePointProfileURL: INVENTORY_SERVICE_POINT_PROFILE_VIEW,
};

/** component that renders Inventory list
 *
 * @param props - the component props
 */
const InventoryList = (props: InventoryListProps) => {
  const {
    servicePointId,
    opensrpBaseURL,
    servicePointProfileURL,
    addInventoryURL,
    editInventoryURL,
  } = props;
  const inventoriesArray = useSelector((state) =>
    getInventoriesByExpiry(state, { expired: false })
  ) as Inventory[];
  const { broken, handleBrokenPage } = useHandleBrokenPage();
  const dispatch = useDispatch();

  useEffect(() => {
    // api call to get inventory by id
    const serve = new OpenSRPService(
      `${GET_INVENTORY_BY_SERVICE_POINT}${servicePointId}`,
      opensrpBaseURL
    );
    serve
      .list({ returnProduct: true })
      .then((res: Inventory[]) => {
        dispatch(fetchInventories(res));
      })
      .catch((err: Error) => handleBrokenPage(err));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (broken) {
    return <Alert message={ERROR_GETTING_INVENTORIES} type="error" />;
  }

  // add a key prop to the array data to be consumed by the table
  const dataSource = inventoriesArray.map((item) => {
    const deliveryDate = format(new Date(item.deliveryDate), 'MMM dd, yyyy');
    const accountabilityEndDate = format(new Date(item.accountabilityEndDate), 'MMM dd, yyyy');
    const inventoryToDisplay = {
      key: `${TableColumnsNamespace}-${item._id}`,
      ...item,
      deliveryDate,
      accountabilityEndDate,
    };
    return inventoryToDisplay;
  });

  return (
    <>
      <Row className={'list-view'}>
        <Col className={'main-content'}>
          <div className="inventory-profile">
            <h6>{INVENTORY_ITEMS}</h6>
            <Link to={`${servicePointProfileURL}/${servicePointId}${addInventoryURL}`}>
              <Button type="primary" size="large">
                {`+ ${ADD_NEW_INVENTORY_ITEM}`}
              </Button>
            </Link>
          </div>
          <Table
            className="custom-table"
            pagination={false}
            dataSource={dataSource}
            columns={getTableColumns(servicePointProfileURL, editInventoryURL)}
          ></Table>
        </Col>
      </Row>
    </>
  );
};

InventoryList.defaultProps = defaultProps;

export { InventoryList };
