import React, { useEffect, useState } from 'react';
import { Row, PageHeader, Col, Button, Table } from 'antd';
import { loadProductCatalogue } from '../../helpers/dataLoaders';
import { OpenSRPService } from '../../helpers/dataLoaders';
import {
  fetchProducts,
  getProductArray,
  getProductById,
  ProductCatalogue,
} from '../../ducks/productCatalogue';
import { connect } from 'react-redux';
import { ColumnsType } from 'antd/lib/table/interface';
import { CatalogueLoading, columns } from './utils';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Store } from 'redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import {
  reducerName as ProductCatalogueReducerName,
  ProductCatalogueReducer,
} from '../../ducks/productCatalogue';
import { BrokenPage, useHandleBrokenPage } from '@opensrp/react-utils';
import { Helmet } from 'react-helmet';
import { CATALOGUE_CREATE_VIEW_URL, RouteParams } from '../../constants';
import { ViewDetails } from '../ViewDetails';

/** make sure product catalogue reducer is registered */
reducerRegistry.register(ProductCatalogueReducerName, ProductCatalogueReducer);

/** props for the productCatalogueList view */
interface Props<T = ProductCatalogue> {
  data: T[];
  productUnderView: T | null;
  columns: ColumnsType<T>;
  service: typeof OpenSRPService;
  fetchProducts: typeof fetchProducts;
}

const defaultProps = {
  data: [],
  productUnderView: null,
  columns: columns,
  fetchProducts: fetchProducts,
  service: OpenSRPService,
};

export type ProductCatalogueListTypes = Props<ProductCatalogue> & RouteComponentProps<RouteParams>;

/** component that renders product catalogue */

const ProductCatalogueList = (props: ProductCatalogueListTypes) => {
  const { service, data, columns, productUnderView } = props;
  const [loading, setLoading] = useState<boolean>(data.length === 0);
  const { broken, errorMessage, handleBrokenPage } = useHandleBrokenPage();

  // see if we have a view-details product
  const productId = props.match.params.productId ?? '';

  useEffect(() => {
    loadProductCatalogue(service)
      .catch((err: Error) => handleBrokenPage(err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  if (loading) {
    return <CatalogueLoading />;
  }

  if (broken) {
    return <BrokenPage errorMessage={errorMessage} />;
  }

  const pageTitle = `Product Catalogue (${data.length})`;

  return (
    <div className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} className="page-header"></PageHeader>
      <Row className={'list-view'}>
        <Col className={'main-content'}>
          <div className="main-content__header">
            <Link to={CATALOGUE_CREATE_VIEW_URL}>
              <Button type="primary" size="large">
                {' + Product Catalogue'}
              </Button>
            </Link>
          </div>
          <Table dataSource={data} columns={columns}></Table>
        </Col>
        <ViewDetails {...{ object: productUnderView, objectId: productId }} />
      </Row>
    </div>
  );
};

ProductCatalogueList.defaultProps = defaultProps;

export { ProductCatalogueList };

export type MapStateToProps = Pick<ProductCatalogueListTypes, 'data' | 'productUnderView'>;
export type MapDispatchToProps = Pick<ProductCatalogueListTypes, 'fetchProducts'>;

export const mapStateToProps = (
  state: Partial<Store>,
  ownProps: ProductCatalogueListTypes
): MapStateToProps => {
  const productId = ownProps.match.params.productId ?? '';
  const data = getProductArray(state);
  const productUnderView = getProductById(state, productId);
  return { data, productUnderView };
};

export const MapDispatchToProps = {
  fetchProducts: fetchProducts,
};

const ConnectedProductCatalogueList = connect(
  mapStateToProps,
  MapDispatchToProps
)(ProductCatalogueList);
export { ConnectedProductCatalogueList };
