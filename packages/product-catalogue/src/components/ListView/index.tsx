import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Spin } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { loadProductCatalogue } from '../../helpers/dataLoaders';
import { OpenSRPService } from '../../helpers/dataLoaders';
import {
  fetchProducts,
  getProductArray,
  getProductById,
  ProductCatalogue,
} from '../../ducks/productCatalogue';
import { connect } from 'react-redux';
import { ActionsColumnCustomRender, columnsFactory } from './utils';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Store } from 'redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import {
  reducerName as ProductCatalogueReducerName,
  ProductCatalogueReducer,
} from '../../ducks/productCatalogue';
import { BrokenPage, TableLayout, useHandleBrokenPage } from '@opensrp/react-utils';
import { Helmet } from 'react-helmet';
import { CATALOGUE_CREATE_VIEW_URL, RouteParams } from '../../constants';
import { ViewDetails } from '../ViewDetails';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import { useTranslation } from '../../mls';

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
  const { t } = useTranslation();

  const columns = columnsFactory(t);

  // see if we have a view-details product
  const productId = props.match.params.productId ?? '';

  useEffect(() => {
    loadProductCatalogue(baseURL, service, fetchProductsCreator)
      .catch((err: Error) => handleBrokenPage(err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  if (broken) {
    return <BrokenPage errorMessage={errorMessage} />;
  }

  const pageTitle = t('Product Catalogue ({{number}})', { number: data.length });

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
              <Button type="primary">{t(' + Add product to catalogue')}</Button>
            </Link>
          </div>
          <TableLayout
            id="ProductCatalogueList"
            dataKeyAccessor="uniqueId"
            persistState={true}
            datasource={data}
            columns={columns}
            actions={{
              title: t('Actions'),
              width: '20%',
              render: ActionsColumnCustomRender(t),
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
