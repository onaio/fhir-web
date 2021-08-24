import React, { useEffect, useState } from 'react';
import { Row, PageHeader, Col, Button } from 'antd';
import { loadProductCatalogue } from '../../helpers/dataLoaders';
import { OpenSRPService } from '../../helpers/dataLoaders';
import {
  fetchProducts,
  getProductArray,
  getProductById,
  ProductCatalogue,
} from '../../ducks/productCatalogue';
import { connect } from 'react-redux';
import { ActionsColumnCustomRender, CatalogueLoading, columnsFactory } from './utils';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Store } from 'redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import {
  reducerName as ProductCatalogueReducerName,
  ProductCatalogueReducer,
} from '../../ducks/productCatalogue';
import { BrokenPage, TableLayout, useHandleBrokenPage } from '@opensrp-web/react-utils';
import { Helmet } from 'react-helmet';
import { CATALOGUE_CREATE_VIEW_URL, RouteParams, TableColumnsNamespace } from '../../constants';
import { ViewDetails } from '../ViewDetails';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import lang from '../../lang';

/** make sure product catalogue reducer is registered */
reducerRegistry.register(ProductCatalogueReducerName, ProductCatalogueReducer);

/** props for the productCatalogueList view */
interface Props<T = ProductCatalogue> extends CommonProps {
  data: T[];
  productUnderView: T | null;
  service: typeof OpenSRPService;
  fetchProductsCreator: typeof fetchProducts;
}

const defaultProps = {
  ...defaultCommonProps,
  data: [],
  productUnderView: null,
  fetchProductsCreator: fetchProducts,
  service: OpenSRPService,
};

export type ProductCatalogueListTypes = Props<ProductCatalogue> & RouteComponentProps<RouteParams>;

/** component that renders product catalogue */

const ProductCatalogueList = (props: ProductCatalogueListTypes) => {
  const { service, data, productUnderView, fetchProductsCreator, baseURL } = props;
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const { broken, errorMessage, handleBrokenPage } = useHandleBrokenPage();

  const columns = columnsFactory();

  // see if we have a view-details product
  const productId = props.match.params.productId ?? '';

  useEffect(() => {
    loadProductCatalogue(baseURL, service, fetchProductsCreator)
      .catch((err: Error) => handleBrokenPage(err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <CatalogueLoading />;
  }

  if (broken) {
    return <BrokenPage errorMessage={errorMessage} />;
  }

  const pageTitle = `${lang.PRODUCT_CATALOGUE} (${data.length})`;
  // add a key prop to the array data to be consumed by the table
  const datasource = data.map((singleObject) => {
    const prodWithKey = {
      ...singleObject,
      key: `${TableColumnsNamespace}-${singleObject.uniqueId}`,
    };
    return prodWithKey;
  });

  return (
    <div className="content-section product-catalogue">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} className="page-header"></PageHeader>
      <Row className={'list-view pt-0'}>
        <Col className={'main-content'}>
          <div className="main-content__header flex-right">
            <Link to={CATALOGUE_CREATE_VIEW_URL}>
              <Button type="primary">{lang.ADD_PRODUCT_TO_CATALOGUE}</Button>
            </Link>
          </div>
          <TableLayout
            id="ProductCatalogueList"
            persistState={true}
            datasource={datasource}
            columns={columns}
            actions={{
              title: lang.ACTIONS_TH,
              width: '20%',
              render: ActionsColumnCustomRender,
            }}
          />
        </Col>
        <ViewDetails {...{ object: productUnderView, objectId: productId }} />
      </Row>
    </div>
  );
};

ProductCatalogueList.defaultProps = defaultProps;

export { ProductCatalogueList };

export type MapStateToProps = Pick<ProductCatalogueListTypes, 'data' | 'productUnderView'>;
export type MapDispatchToProps = Pick<ProductCatalogueListTypes, 'fetchProductsCreator'>;

export const mapStateToProps = (
  state: Partial<Store>,
  ownProps: ProductCatalogueListTypes
): MapStateToProps => {
  const productId = ownProps.match.params.productId ?? '';
  const data = getProductArray(state);
  const productUnderView = getProductById(state, productId);
  return { data, productUnderView };
};

export const mapDispatchToProps: MapDispatchToProps = {
  fetchProductsCreator: fetchProducts,
};

const ConnectedProductCatalogueList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductCatalogueList);
export { ConnectedProductCatalogueList };
