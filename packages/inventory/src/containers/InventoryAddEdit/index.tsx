import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Store } from 'redux';
import { Typography, Card, Spin } from 'antd';
import { Helmet } from 'react-helmet';
import { OpenSRPService } from '@opensrp/react-utils';
import { InventoryItemForm } from '../../components/InventoryItemForm';
import { ADD_INVENTORY_ITEM, ERROR_GENERIC, TO } from '../../lang';
import {
  ProductCatalogue,
  fetchProducts,
  getProductArray,
  loadProductCatalogue,
} from '@opensrp/product-catalogue';
import { fetchSettings } from './utils';
import { Setting } from '../../components/InventoryItemForm';
import { sendErrorNotification } from '@opensrp/notifications';
import { HTTPError } from '@opensrp/server-service';
import { RouteComponentProps } from 'react-router';
import {
  fetchLocationUnits,
  getLocationUnitById,
  LocationUnit,
  getBaseTreeNode,
} from '@opensrp/location-management';
import { ROUTE_PARAM_INVENTORY_ITEM_ID, ROUTE_PARAM_SERVICE_POINT_ID } from '../../constants';

/** Route params */
interface RouteParams {
  [ROUTE_PARAM_SERVICE_POINT_ID]: string;
  [ROUTE_PARAM_INVENTORY_ITEM_ID]: string;
}

/** interface component props */
export interface InventoryAddEditProps extends RouteComponentProps<RouteParams> {
  products: ProductCatalogue[];
  openSRPBaseURL: string;
  cancelURL: string;
  redirectURL: string;
  fetchProductsCreator: typeof fetchProducts;
  fetchLocationUnitsCreator: typeof fetchLocationUnits;
  servicePoint: LocationUnit | null;
}

/** default component props */
export const defaultInventoryAddEditProps = {
  openSRPBaseURL: '',
  cancelURL: '',
  redirectURL: '',
  products: [],
  fetchProductsCreator: fetchProducts,
  fetchLocationUnitsCreator: fetchLocationUnits,
  servicePoint: null,
};

const InventoryAddEdit: React.FC<InventoryAddEditProps> = (props: InventoryAddEditProps) => {
  const {
    openSRPBaseURL,
    cancelURL,
    products,
    fetchProductsCreator,
    fetchLocationUnitsCreator,
    redirectURL,
    servicePoint,
  } = props;
  const [UNICEFSections, setUNICEFSections] = React.useState<Setting[]>([]);
  const [donors, setDonors] = React.useState<Setting[]>([]);
  const { Title } = Typography;

  useEffect(() => {
    loadProductCatalogue(
      openSRPBaseURL,
      OpenSRPService,
      fetchProductsCreator
    ).catch((_: HTTPError) => sendErrorNotification(ERROR_GENERIC));
    fetchSettings(openSRPBaseURL, { serverVersion: 0, identifier: 'inventory_donors' }, setDonors);
    fetchSettings(
      openSRPBaseURL,
      { serverVersion: 0, identifier: 'inventory_unicef_sections' },
      setUNICEFSections
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Handle when servicePoint is null e.g when a user refreshes page
    if (!servicePoint) {
      getBaseTreeNode(openSRPBaseURL)
        .then((response) => {
          fetchLocationUnitsCreator(response);
        })
        .catch((_: HTTPError) => {
          sendErrorNotification(ERROR_GENERIC);
        });
    }
  }, [servicePoint, fetchLocationUnitsCreator, openSRPBaseURL]);

  if (!servicePoint) {
    return <Spin size="large" />;
  }

  const { properties, id } = servicePoint;

  const inventoryItemFormProps = {
    UNICEFSections,
    donors,
    products,
    cancelURL,
    openSRPBaseURL,
    redirectURL,
    servicePointId: id,
  };

  return (
    <div className="layout-content">
      <Helmet>
        <title>{ADD_INVENTORY_ITEM}</title>
      </Helmet>
      <Title level={3}>{`${ADD_INVENTORY_ITEM} ${TO} ${properties.name}`}</Title>
      <Card>
        <InventoryItemForm {...inventoryItemFormProps} />
      </Card>
    </div>
  );
};

InventoryAddEdit.defaultProps = defaultInventoryAddEditProps;

export { InventoryAddEdit };

type MapStateToProps = Pick<InventoryAddEditProps, 'products' | 'servicePoint'>;

const mapStateToProps = (
  state: Partial<Store>,
  ownProps: InventoryAddEditProps
): MapStateToProps => {
  const servicePointId = ownProps.match.params[ROUTE_PARAM_SERVICE_POINT_ID];
  const inventoryItemId = ownProps.match.params[ROUTE_PARAM_INVENTORY_ITEM_ID];

  let servicePoint = null;

  if (servicePointId) {
    servicePoint = getLocationUnitById(state, servicePointId);
  }

  const products = getProductArray(state).sort((a, b) => {
    if (a.productName < b.productName) {
      return -1;
    }
    if (a.productName > b.productName) {
      return 1;
    }
    return 0;
  });
  return { products, servicePoint };
};

type MapDispatchToProps = Pick<
  InventoryAddEditProps,
  'fetchProductsCreator' | 'fetchLocationUnitsCreator'
>;

const mapDispatchToProps: MapDispatchToProps = {
  fetchProductsCreator: fetchProducts,
  fetchLocationUnitsCreator: fetchLocationUnits,
};

const ConnectedInventoryAddEdit = connect(mapStateToProps, mapDispatchToProps)(InventoryAddEdit);

export { ConnectedInventoryAddEdit };
