/**
 * component renders view where users can create products
 * in the catalogue
 */
import React from 'react';
import { ProductForm } from '../ProductForm';
import { Layout, PageHeader } from 'antd';
import Helmet from 'react-helmet';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import lang from '../../lang';

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

  const pageTitle = lang.ADD_PRODUCT;

  return (
    <Layout className="content-section">
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
