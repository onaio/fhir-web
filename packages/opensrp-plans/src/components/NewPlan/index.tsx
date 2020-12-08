/** component renders view where users can create plans
 */
import React from 'react';
import { defaultInitialValues, PlanForm, processActivitiesDates } from '@opensrp/plan-form';
import { Layout, PageHeader } from 'antd';
import Helmet from 'react-helmet';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import { CREATE_PLAN } from '../../lang';
import { PLANS_LIST_VIEW_URL } from '../../constants';
import {
  defaultEnvConfig,
  getFormActivities,
  getPlanActivitiesMap,
  InterventionType,
  planActivities,
} from '@opensrp/plan-form-core/dist/types';

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
  const { envConfigs, baseURL } = props;
  const pageTitle = CREATE_PLAN;

  const configs = {
    ...defaultEnvConfig,
    ...envConfigs,
  };

  const planActivitiesMap = getPlanActivitiesMap(configs);
  const initialValues = {
    ...defaultInitialValues,
    activities: processActivitiesDates(planActivitiesMap[InterventionType.SM]),
  };

  const planFormProps = {
    initialValues,
    baseURL: baseURL,
    redirectAfterAction: PLANS_LIST_VIEW_URL,
    allFormActivities: getFormActivities(planActivities, configs),
    envConfigs: configs,
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

export { CreatePlanView };
