/** component renders view where users can create or and edit products
 * in the catalogue
 */
import React from 'react';
import { ProductForm } from '../ProductForm';
import { Layout, PageHeader } from 'antd';
import Helmet from 'react-helmet';
import { CommonProps, defaultCommonProps } from '../../helpers/common';

type CreateProductViewProps = CommonProps;

const defaultProps = {
  ...defaultCommonProps,
};

/**
 * CreateProductView component
 *
 *  props - component props
 */

const CreateProductView = (props: CreateProductViewProps) => {
  const { baseURL } = props;
  const pageTitle = 'Add Product to Catalogue';

  return (
    <Layout className="main-content">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} className="pageHeader"></PageHeader>

      <ProductForm baseURL={baseURL} />
    </Layout>
  );
};

CreateProductView.defaultProps = defaultProps;

export { CreateProductView };
