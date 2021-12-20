/** component renders view where users can edit products
 * in the catalogue
 */
import { RouteParams } from '../../constants';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { ProductForm } from '../ProductForm';
import { Layout, PageHeader } from 'antd';
import {
  fetchProducts,
  getProductById,
  ProductCatalogue,
  ProductCatalogueReducer,
  reducerName as ProductCatalogueReducerName,
} from '../../ducks/productCatalogue';
import { loadSingleProduct } from '../../helpers/dataLoaders';
import { OpenSRPService } from '../../helpers/dataLoaders';
import { connect } from 'react-redux';
import { Store } from 'redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { CatalogueLoading } from '../ListView/utils';
import Helmet from 'react-helmet';
import { BrokenPage, useHandleBrokenPage } from '@opensrp/react-utils';
import { Resource404 } from '@opensrp/react-utils';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import { useTranslation } from '../../mls';

/** register catalogue reducer */
reducerRegistry.register(ProductCatalogueReducerName, ProductCatalogueReducer);

/** props for createEditProduct view */
export interface EditProductViewProps extends CommonProps {
  product: ProductCatalogue | null;
  fetchProducts: typeof fetchProducts;
  serviceClass: typeof OpenSRPService;
}

const defaultProps = {
  ...defaultCommonProps,
  product: null,
  fetchProducts: fetchProducts,
  serviceClass: OpenSRPService,
};

/** type intersection for all types that pertain to the props */
export type EditProductViewTypes = EditProductViewProps & RouteComponentProps<RouteParams>;

/**
 * CreateEditProductView component
 *
 *  props - component props
 */

const EditProductView = (props: EditProductViewTypes) => {
  const { product, fetchProducts, serviceClass, baseURL } = props;
  const { productId } = props.match.params;
  const [loading, setLoading] = useState<boolean>(!product);
  const { t } = useTranslation();

  const { errorMessage, broken, handleBrokenPage } = useHandleBrokenPage();

  useEffect(() => {
    const idOfProduct = productId as string | number;
    loadSingleProduct(baseURL, idOfProduct, serviceClass, fetchProducts)
      .finally(() => setLoading(false))
      .catch((err) => handleBrokenPage(err));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  if (loading) {
    return <CatalogueLoading />;
  }

  if (broken) {
    return <BrokenPage errorMessage={errorMessage} />;
  }

  if (!product && productId) {
    return <Resource404 />;
  }

  const productFormProps = {
    baseURL,
    initialValues: { ...(product as ProductCatalogue) },
  };

  const pageTitle = t('Edit > {{productName}}', { productName: product?.productName });

  return (
    <Layout className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} className="pageHeader"></PageHeader>

      <ProductForm {...productFormProps} />
    </Layout>
  );
};

EditProductView.defaultProps = defaultProps;

export { EditProductView };

/** Interface for connected state to props */
interface MapStateToProps {
  product: ProductCatalogue | null;
}

// connect to store
const mapStateToProps = (
  state: Partial<Store>,
  ownProps: EditProductViewTypes
): MapStateToProps => {
  const productId = ownProps.match.params.productId ?? '';
  const product = getProductById(state, productId);
  return { product };
};

/** map props to action creators */
const mapDispatchToProps = {
  fetchProducts: fetchProducts,
};

/** product catalogue view that is connected to store */
const ConnectedEditProductView = connect(mapStateToProps, mapDispatchToProps)(EditProductView);

export { ConnectedEditProductView };
