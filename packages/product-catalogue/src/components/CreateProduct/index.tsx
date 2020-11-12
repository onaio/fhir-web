/** component renders view where users can create or and edit products
 * in the catalogue
 */
import React from 'react';
import { ProductForm } from '../ProductForm';
import { Layout, PageHeader } from 'antd';
import Helmet from 'react-helmet';

/**
 * CreateProductView component
 *
 *  props - component props
 */

export const CreateProductView = () => {
  const pageTitle = 'Add Product to Catalogue';

  return (
    <Layout className="main-content">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} className="pageHeader"></PageHeader>

      <ProductForm />
    </Layout>
  );
};
