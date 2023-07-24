import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import { Store } from 'redux';
import { PageHeader } from '@opensrp/react-utils';
import { Helmet } from 'react-helmet';
import { OpenSRPService, Resource404 } from '@opensrp/react-utils';
import reducerRegistry from '@onaio/redux-reducer-registry';
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
  INVENTORY_SERVICE_POINT_PROFILE_VIEW,
  INVENTORY_UNICEF_SECTIONS,
  OPENSRP_ENDPOINT_GET_INVENTORIES,
  OPENSRP_ENDPOINT_LOCATION,
  OPENSRP_PRODUCT_CATALOGUE,
  ROUTE_PARAM_INVENTORY_ID,
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
import { useTranslation } from '../../mls';
import { Spin } from 'antd';

/** register reducers */
reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);
reducerRegistry.register(inventoryReducerName, inventoryReducer);

/** Route params */
interface RouteParams {
  [ROUTE_PARAM_SERVICE_POINT_ID]: string;
  [ROUTE_PARAM_INVENTORY_ID]?: string;
}

/** interface component props */
export interface InventoryAddEditProps extends RouteComponentProps<RouteParams> {
  openSRPBaseURL: string; // OpenSRP API base URL
  servicePointProfileURL: string; // route to service point profile to redirect to after successful
  // submission or clicking on cancel button to abort and exit
  fetchLocationUnitsCreator: typeof fetchLocationUnits; // redux action to fetch location units
  fetchInventoriesCreator: typeof fetchInventories; // redux action to fetch inventories
  servicePoint: LocationUnit | null; // service point to add/edit inventory item
  inventory?: Inventory | null; // inventory item to edit
  customFetchOptions?: typeof getFetchOptions; // custom OpenSRPService class options
}

/** default component props */
export const defaultInventoryAddEditProps = {
  openSRPBaseURL: '',
  servicePointProfileURL: INVENTORY_SERVICE_POINT_PROFILE_VIEW,
  fetchLocationUnitsCreator: fetchLocationUnits,
  fetchInventoriesCreator: fetchInventories,
  servicePoint: null,
};

const InventoryAddEdit: React.FC<InventoryAddEditProps> = (props: InventoryAddEditProps) => {
  const {
    openSRPBaseURL,
    servicePointProfileURL,
    fetchLocationUnitsCreator,
    fetchInventoriesCreator,
    servicePoint,
    inventory,
    match,
    customFetchOptions,
  } = props;
  const [UNICEFSections, setUNICEFSections] = React.useState<Setting[]>([]);
  const [donors, setDonors] = React.useState<Setting[]>([]);
  const [products, setProducts] = React.useState<ProductCatalogue[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { t } = useTranslation();
  const isEdit = !!match.params[ROUTE_PARAM_INVENTORY_ID];

  useEffect(() => {
    // Handle when servicePoint is null e.g when a user refreshes page
    if (!servicePoint) {
      // fetch the single location unit
      setIsLoading(true);
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
          sendErrorNotification(t('There was a problem fetching Location Unit'));
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [
    servicePoint,
    fetchLocationUnitsCreator,
    openSRPBaseURL,
    customFetchOptions,
    match.params,
    t,
  ]);

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
        sendErrorNotification(t('There was a problem fetching the Product Catalogue'));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchSettings(openSRPBaseURL, { serverVersion: 0, identifier: INVENTORY_DONORS }, setDonors, t);
    fetchSettings(
      openSRPBaseURL,
      { serverVersion: 0, identifier: INVENTORY_UNICEF_SECTIONS },
      setUNICEFSections,
      t
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
        .list({
          returnProduct: true,
        })
        .then((response: Inventory[]) => {
          fetchInventoriesCreator(response);
        })
        .catch((_: HTTPError) => {
          sendErrorNotification(t('There was a problem fetching inventories'));
        });
    }
  }, [
    customFetchOptions,
    isEdit,
    inventory,
    servicePoint,
    openSRPBaseURL,
    fetchInventoriesCreator,
    t,
  ]);

  if (isLoading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  if (!servicePoint) {
    return <Resource404 />;
  }

  const { properties, id } = servicePoint;
  let initialValues = defaultInitialValues;

  if (inventory) {
    initialValues = {
      ...initialValues,
      deliveryDate: dayjs(inventory.deliveryDate),
      accountabilityEndDate: dayjs(inventory.accountabilityEndDate),
      unicefSection: inventory.customProperties['UNICEF section'],
      donor: inventory.donor,
      poNumber: inventory.customProperties['PO Number'],
      quantity: inventory.value,
      productName: inventory.product?.productName,
      serialNumber: inventory.serialNumber,
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
    cancelURL: `${servicePointProfileURL}/${id}`,
    openSRPBaseURL,
    redirectURL: `${servicePointProfileURL}/${id}`,
    servicePointId: id,
    initialValues,
    inventoryID: inventory?._id,
  };
  const { name } = properties;
  let heading = t('Add inventory item to {{name}}', { name });

  if (isEdit) {
    const productName = inventory?.product?.productName;
    if (productName) {
      heading = t('Edit > {{productName}}', { productName });
    } else {
      heading = t('Edit');
    }
  }
  const title = !isEdit ? t('Add inventory item') : t('Edit inventory item');

  return (
    <div className="content-section">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <PageHeader title={heading} />
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
  const inventoryId = match.params[ROUTE_PARAM_INVENTORY_ID];
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
