import React, { useEffect } from 'react';
import { Row, Col, Button } from 'antd';
import { getTableColumns } from './utils';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  GET_INVENTORY_BY_SERVICE_POINT,
  INVENTORY_SERVICE_POINT_PROFILE_VIEW,
  URL_INVENTORY_ADD,
  URL_INVENTORY_EDIT,
} from '../../constants';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
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
import { OpenSRPService, TableLayout, useHandleBrokenPage } from '@opensrp/react-utils';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '../../mls';

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
    getInventoriesByExpiry(state, { servicePointIds: [servicePointId], expired: false })
  ) as Inventory[];
  const { broken, handleBrokenPage } = useHandleBrokenPage();
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
    return <Alert message={t('Unable to fetch inventories for service point')} type="error" />;
  }

  const datasource = inventoriesArray.map((item) => {
    const deliveryDate = format(new Date(item.deliveryDate), 'MMM dd, yyyy');
    const accountabilityEndDate = format(new Date(item.accountabilityEndDate), 'MMM dd, yyyy');
    const inventoryToDisplay = {
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
            <h6>{t('Inventory items')}</h6>
            <Link to={`${servicePointProfileURL}/${servicePointId}${addInventoryURL}`}>
              <Button type="primary" size="large">
                {t(' + Add new inventory item')}
              </Button>
            </Link>
          </div>
          <TableLayout
            dataKeyAccessor="_id"
            id="InventoryList"
            persistState={true}
            className="custom-table"
            pagination={false}
            datasource={datasource}
            columns={getTableColumns(t)}
            actions={{
              title: t('Actions'),
              // eslint-disable-next-line react/display-name
              render: (_: string, record) => (
                <Link
                  to={`${servicePointProfileURL}/${record.locationId}${editInventoryURL}/${record._id}`}
                >
                  {t('Edit')}
                </Link>
              ),
              width: '20%',
            }}
          />
        </Col>
      </Row>
    </>
  );
};

InventoryList.defaultProps = defaultProps;

export { InventoryList };
