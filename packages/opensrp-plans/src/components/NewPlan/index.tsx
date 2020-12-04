/** component renders view where users can create plans
 */
import React from 'react';
import { PlanForm } from '@opensrp/plan-form';
import { Layout, PageHeader } from 'antd';
import Helmet from 'react-helmet';
import { CommonProps, defaultCommonProps } from '../../helpers/common';

type CreatePlanViewProps = CommonProps;

const defaultProps = {
  ...defaultCommonProps,
};

/**
 * CreateProductView component
 *
 *  props - component props
 */

const CreatePlanView = (props: CreatePlanViewProps) => {
  const { baseURL } = props;
  const pageTitle = 'Add Plan';

  const planFormProps = {
    baseURL:baseURL
  };

  return (
    <Layout className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} className="pageHeader"></PageHeader>

      <PlanForm {...planFormProps} />
    </Layout>
  );
};

CreatePlanView.defaultProps = defaultProps;

export { CreatePlanView  };
