import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Store } from 'redux';
import { Typography, Card } from 'antd';
import { Helmet } from 'react-helmet';
import { OpenSRPService } from '@opensrp/react-utils';
import { InventoryItemForm } from '../../components/InventoryItemForm';
import { ADD_INVENTORY_ITEM, ERROR_GENERIC } from '../../lang';
import {
  ProductCatalogue,
  fetchProducts,
  getProductArray,
  loadProductCatalogue,
} from '@opensrp/product-catalogue';
import { fetchSettings } from './utils';
import { Setting } from '../../components/InventoryItemForm';
import { sendErrorNotification } from '@opensrp/notifications';

/** interface component props */
export interface InventoryAddEditProps {
  products: ProductCatalogue[];
  openSRPBaseURL: string;
  cancelURL: string;
  openSRPService: typeof OpenSRPService;
  fetchProductsCreator: typeof fetchProducts;
}

/** default component props */
export const defaultInventoryAddEditProps = {
  openSRPBaseURL: '',
  cancelURL: '',
  openSRPService: OpenSRPService,
  products: [],
  fetchProductsCreator: fetchProducts,
};

const InventoryAddEdit: React.FC<InventoryAddEditProps> = (props: InventoryAddEditProps) => {
  const { openSRPBaseURL, cancelURL, openSRPService, products, fetchProductsCreator } = props;
  const [UNICEFSections, setUNICEFSections] = React.useState<Setting[]>([]);
  const [donors, setDonors] = React.useState<Setting[]>([]);
  const inventoryItemFormProps = {
    UNICEFSections,
    donors,
    products,
    cancelURL,
  };
  const { Title } = Typography;

  useEffect(() => {
    loadProductCatalogue(openSRPBaseURL, openSRPService, fetchProductsCreator).catch((_: Error) =>
      sendErrorNotification(ERROR_GENERIC)
    );
    fetchSettings(
      openSRPBaseURL,
      openSRPService,
      { serverVersion: 0, identifier: 'inventory_donors' },
      setDonors
    );
    fetchSettings(
      openSRPBaseURL,
      openSRPService,
      { serverVersion: 0, identifier: 'inventory_unicef_sections' },
      setUNICEFSections
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="layout-content">
      <Helmet>
        <title>{ADD_INVENTORY_ITEM}</title>
      </Helmet>
      <Title level={3}>Add inventory item to </Title>
      <Card>
        <InventoryItemForm {...inventoryItemFormProps} />
      </Card>
    </div>
  );
};

InventoryAddEdit.defaultProps = defaultInventoryAddEditProps;

export { InventoryAddEdit };

type MapStateToProps = Pick<InventoryAddEditProps, 'products'>;

const mapStateToProps = (state: Partial<Store>): MapStateToProps => {
  const products = getProductArray(state).sort((a, b) => {
    if (a.productName < b.productName) {
      return -1;
    }
    if (a.productName > b.productName) {
      return 1;
    }
    return 0;
  });
  return { products };
};

type MapDispatchToProps = Pick<InventoryAddEditProps, 'fetchProductsCreator'>;

const mapDispatchToProps: MapDispatchToProps = {
  fetchProductsCreator: fetchProducts,
};

const ConnectedInventoryAddEdit = connect(mapStateToProps, mapDispatchToProps)(InventoryAddEdit);

export { ConnectedInventoryAddEdit };
