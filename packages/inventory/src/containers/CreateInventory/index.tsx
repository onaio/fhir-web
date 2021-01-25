/** component renders view where users can create products
 * in the catalogue
 */
import React from 'react';
import { InventoryForm } from '../InventoryForm';
import { Layout, PageHeader } from 'antd';
import Helmet from 'react-helmet';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import { ADD_INVENTORY_ITEM } from '../../lang';

type CreateProductViewProps = CommonProps;

const defaultProps = {
  ...defaultCommonProps,
};

/**
 * CreateInventoryView component
 *
 *  props - component props
 */

const CreateInventoryView = (props: CreateProductViewProps) => {
  const { baseURL } = props;
  const pageTitle = ADD_INVENTORY_ITEM;

  return (
    <Layout className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} className="pageHeader"></PageHeader>

      <InventoryForm baseURL={baseURL} />
    </Layout>
  );
};

CreateInventoryView.defaultProps = defaultProps;

export { CreateInventoryView };
