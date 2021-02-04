import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Store } from 'redux';
import { Select } from 'antd';
import {
  loadProductCatalogue,
  fetchProducts,
  ProductCatalogue,
  getProductArray,
} from '@opensrp/product-catalogue';
import { sendErrorNotification } from '@opensrp/notifications';
import { OpenSRPService } from '../../../helpers/dataLoaders';
import { ERROR_OCCURRED, SELECT } from '../../../lang';

export type OptionValueProperty = 'uniqueId' | 'productName';

/** interaface for component props **/
export interface ProductSelectProps<T = ProductCatalogue> {
  openSRPBaseURL: string;
  data: T[];
  fetchProductsCreator?: typeof fetchProducts;
  openSRPService: typeof OpenSRPService;
  optionValueProperty: OptionValueProperty;
  handleChange?: (value: string) => void;
  placeHolder?: string;
}

export const defaultProductSelectProps: ProductSelectProps = {
  openSRPBaseURL: '',
  data: [],
  fetchProductsCreator: fetchProducts,
  openSRPService: OpenSRPService,
  placeHolder: SELECT,
  optionValueProperty: 'productName',
};

const ProductSelect: React.FC<ProductSelectProps> = (props: ProductSelectProps) => {
  const {
    data,
    openSRPBaseURL,
    openSRPService,
    fetchProductsCreator,
    handleChange,
    placeHolder,
    optionValueProperty,
  } = props;

  useEffect(() => {
    loadProductCatalogue(openSRPBaseURL, openSRPService, fetchProductsCreator).catch((_: Error) =>
      sendErrorNotification(ERROR_OCCURRED)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Select placeholder={placeHolder} onChange={handleChange}>
      {data.map((product: ProductCatalogue) => (
        <Select.Option key={product.uniqueId} value={product[optionValueProperty]}>
          {product.productName}
        </Select.Option>
      ))}
    </Select>
  );
};

ProductSelect.defaultProps = defaultProductSelectProps;

export { ProductSelect };

export type MapStateToProps = Pick<ProductSelectProps, 'data'>;
export type MapDispatchToProps = Pick<ProductSelectProps, 'fetchProductsCreator'>;

export const mapStateToProps = (state: Partial<Store>): MapStateToProps => {
  const data = getProductArray(state);
  return { data };
};

export const mapDispatchToProps: MapDispatchToProps = {
  fetchProductsCreator: fetchProducts,
};

const ConnectedProductSelect = connect(mapStateToProps, mapDispatchToProps)(ProductSelect);
export { ConnectedProductSelect };
