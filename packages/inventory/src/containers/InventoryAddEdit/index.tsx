import React, { useEffect } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Store } from 'redux';
import { Typography, Spin } from 'antd';
import { Helmet } from 'react-helmet';
import { OpenSRPService } from '@opensrp/react-utils';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { ADD_INVENTORY_ITEM, EDIT, EDIT_INVENTORY_ITEM, ERROR_GENERIC, TO } from '../../lang';
import { fetchSettings } from './utils';
import { Setting } from '../../components/InventoryItemForm';
import { sendErrorNotification } from '@opensrp/notifications';
import { getFetchOptions, HTTPError } from '@opensrp/server-service';
import { RouteComponentProps } from 'react-router';
import {
  fetchLocationUnits,
  getLocationUnitById,
  LocationUnit,
  locationUnitsReducerName,
  locationUnitsReducer,
} from '@opensrp/location-management';
import {
  INVENTORY_DONORS,
  INVENTORY_UNICEF_SECTIONS,
  OPENSRP_ENDPOINT_GET_INVENTORIES,
  OPENSRP_ENDPOINT_LOCATION,
  OPENSRP_PRODUCT_CATALOGUE,
  ROUTE_PARAM_INVENTORY_ITEM_ID,
  ROUTE_PARAM_SERVICE_POINT_ID,
} from '../../constants';
import {
  fetchInventories,
  getInventoriesByIdsFactory,
  Inventory,
  inventoryReducer,
  inventoryReducerName,
} from '../../ducks/inventory';
import { InventoryItemForm, defaultInitialValues } from '../../components/InventoryItemForm';
import { ProductCatalogue } from '@opensrp/product-catalogue';

/** register reducers */
reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);
reducerRegistry.register(inventoryReducerName, inventoryReducer);

/** Route params */
interface RouteParams {
  [ROUTE_PARAM_SERVICE_POINT_ID]: string;
  [ROUTE_PARAM_INVENTORY_ITEM_ID]?: string;
}

/** interface component props */
export interface InventoryAddEditProps extends RouteComponentProps<RouteParams> {
  openSRPBaseURL: string;
  cancelURL: string;
  redirectURL: string;
  fetchLocationUnitsCreator: typeof fetchLocationUnits;
  fetchInventoriesCreator: typeof fetchInventories;
  servicePoint: LocationUnit | null;
  inventory?: Inventory | null;
  customFetchOptions?: typeof getFetchOptions;
}

/** default component props */
export const defaultInventoryAddEditProps = {
  openSRPBaseURL: '',
  cancelURL: '',
  redirectURL: '',
  fetchLocationUnitsCreator: fetchLocationUnits,
  fetchInventoriesCreator: fetchInventories,
  servicePoint: null,
};

const InventoryAddEdit: React.FC<InventoryAddEditProps> = (props: InventoryAddEditProps) => {
  const {
    openSRPBaseURL,
    cancelURL,
    fetchLocationUnitsCreator,
    fetchInventoriesCreator,
    redirectURL,
    servicePoint,
    inventory,
    match,
    customFetchOptions,
  } = props;
  const [UNICEFSections, setUNICEFSections] = React.useState<Setting[]>([]);
  const [donors, setDonors] = React.useState<Setting[]>([]);
  const [products, setProducts] = React.useState<ProductCatalogue[]>([]);
  const { Title } = Typography;
  const isEdit = !!match.params[ROUTE_PARAM_INVENTORY_ITEM_ID];

  useEffect(() => {
    // Handle when servicePoint is null e.g when a user refreshes page
    if (!servicePoint) {
      // fetch the single location unit
      const servicePointId = match.params[ROUTE_PARAM_SERVICE_POINT_ID];
      const service = new OpenSRPService(
        OPENSRP_ENDPOINT_LOCATION,
        openSRPBaseURL,
        customFetchOptions
      );
      service
        .read(servicePointId)
        .then((response: LocationUnit) => {
          fetchLocationUnitsCreator([response]);
        })
        .catch((_: HTTPError) => {
          sendErrorNotification(ERROR_GENERIC);
        });
    }
  }, [servicePoint, fetchLocationUnitsCreator, openSRPBaseURL, customFetchOptions, match.params]);

  useEffect(() => {
    const service = new OpenSRPService(
      OPENSRP_PRODUCT_CATALOGUE,
      openSRPBaseURL,
      customFetchOptions
    );
    service
      .list()
      .then((response: ProductCatalogue[]) => {
        setProducts(response);
      })
      .catch((_: HTTPError) => {
        sendErrorNotification(ERROR_GENERIC);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchSettings(openSRPBaseURL, { serverVersion: 0, identifier: INVENTORY_DONORS }, setDonors);
    fetchSettings(
      openSRPBaseURL,
      { serverVersion: 0, identifier: INVENTORY_UNICEF_SECTIONS },
      setUNICEFSections
    ); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Handle when editing an item and inventory is null e.g when user refreshes page
    if (isEdit && !inventory && servicePoint) {
      // fetch inventories
      const service = new OpenSRPService(
        `${OPENSRP_ENDPOINT_GET_INVENTORIES}/${servicePoint.id}`,
        openSRPBaseURL,
        customFetchOptions
      );
      service
        .list()
        .then((response: Inventory[]) => {
          fetchInventoriesCreator(response);
        })
        .catch((_: HTTPError) => {
          sendErrorNotification(ERROR_GENERIC);
        });
    }
  }, [
    customFetchOptions,
    isEdit,
    inventory,
    servicePoint,
    openSRPBaseURL,
    fetchInventoriesCreator,
  ]);

  if (!servicePoint) {
    return <Spin size="large" />;
  }

  const { properties, id } = servicePoint;
  let initialValues = defaultInitialValues;

  if (inventory) {
    initialValues = {
      ...initialValues,
      deliveryDate: moment(inventory.deliveryDate),
      accountabilityEndDate: moment(inventory.accountabilityEndDate),
      unicefSection: inventory.customProperties['UNICEF section'],
      donor: inventory.donor,
      poNumber: inventory.customProperties['PO Number'],
      quantity: inventory.value,
    };
  }
  const inventoryItemFormProps = {
    UNICEFSections,
    donors,
    products: products.sort((a, b) => {
      if (a.productName < b.productName) {
        return -1;
      }
      if (a.productName > b.productName) {
        return 1;
      }
      return 0;
    }),
    cancelURL,
    openSRPBaseURL,
    redirectURL,
    servicePointId: id,
    initialValues,
    inventoryID: inventory?._id,
  };
  const heading = !isEdit ? `${ADD_INVENTORY_ITEM} ${TO} ${properties.name}` : `${EDIT}`;
  const title = !isEdit ? ADD_INVENTORY_ITEM : EDIT_INVENTORY_ITEM;

  return (
    <div className="layout-content">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Title level={3}>{heading}</Title>
      <InventoryItemForm {...inventoryItemFormProps} />
    </div>
  );
};

InventoryAddEdit.defaultProps = defaultInventoryAddEditProps;

export { InventoryAddEdit };

type MapStateToProps = Pick<InventoryAddEditProps, 'servicePoint' | 'inventory' | 'match'>;

const mapStateToProps = (
  state: Partial<Store>,
  ownProps: InventoryAddEditProps
): MapStateToProps => {
  const { match } = ownProps;
  const servicePointId = match.params[ROUTE_PARAM_SERVICE_POINT_ID];
  const inventoryId = match.params[ROUTE_PARAM_INVENTORY_ITEM_ID];
  let servicePoint = null;
  let inventory = null;

  if (servicePointId) {
    servicePoint = getLocationUnitById(state, servicePointId);
  }

  if (inventoryId) {
    inventory = getInventoriesByIdsFactory(state, { ids: [inventoryId] })[0];
  }

  return { servicePoint, inventory, match };
};

type MapDispatchToProps = Pick<
  InventoryAddEditProps,
  'fetchLocationUnitsCreator' | 'fetchInventoriesCreator'
>;

const mapDispatchToProps: MapDispatchToProps = {
  fetchLocationUnitsCreator: fetchLocationUnits,
  fetchInventoriesCreator: fetchInventories,
};

const ConnectedInventoryAddEdit = connect(mapStateToProps, mapDispatchToProps)(InventoryAddEdit);

export { ConnectedInventoryAddEdit };
