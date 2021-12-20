/** component renders view where users can create products
 * in the catalogue
 */
import React from 'react';
import { ProductForm } from '../ProductForm';
import { Layout, PageHeader } from 'antd';
import Helmet from 'react-helmet';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import { useTranslation } from '../../mls';

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
  const { t } = useTranslation();

  const pageTitle = t('Add product to catalogue');

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
