import React, { useEffect } from 'react';
import { Row, Col, Button, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { columns } from '../../containers/ProfileView/utils';
import { Link } from 'react-router-dom';
import {
  GET_INVENTORY_BY_SERVICE_POINT,
  INVENTORY_ADD_SERVICE_POINT,
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
  columns: ColumnsType<Inventory>;
  servicePointId: string;
  opensrpBaseURL: string;
}

const defaultProps = {
  ...defaultCommonProps,
  columns: columns,
  servicePointId: '',
  opensrpBaseURL: '',
};

/** component that renders Inventory list
 *
 * @param props - the component props
 */
const InventoryList = (props: InventoryListProps) => {
  const { servicePointId, opensrpBaseURL } = props;
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
      .list()
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
    const inventoryToDisplay = {
      key: `${TableColumnsNamespace}-${item._id}`,
      ...item,
    };
    return inventoryToDisplay;
  });

  return (
    <>
      <Row className={'list-view'}>
        <Col className={'main-content'}>
          <div className="inventory-profile">
            <h6>{INVENTORY_ITEMS}</h6>
            <Link to={INVENTORY_ADD_SERVICE_POINT}>
              <Button type="primary" size="large">
                {`+ ${ADD_NEW_INVENTORY_ITEM}`}
              </Button>
            </Link>
          </div>
          <Table dataSource={dataSource} columns={columns}></Table>
        </Col>
      </Row>
    </>
  );
};

InventoryList.defaultProps = defaultProps;

export { InventoryList };
