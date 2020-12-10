/** component renders view where users can create plans
 */
import React from 'react';
import { defaultInitialValues, PlanForm, processActivitiesDates } from '@opensrp/plan-form';
import { Layout, PageHeader } from 'antd';
import Helmet from 'react-helmet';
import {
  CommonProps,
  defaultCommonProps,
  defaultPropsForPlanForm,
  PropsForPlanForm,
  redirectPathGetter,
} from '../../helpers/common';
import { CREATE_PLAN } from '../../lang';
import { DRAFT_PLANS_LIST_VIEW_URL } from '../../constants';
import {
  defaultEnvConfig,
  getFormActivities,
  getPlanActivitiesMap,
  InterventionType,
  planActivities,
} from '@opensrp/plan-form-core';
import { useHistory } from 'react-router';

type CreatePlanViewProps = CommonProps & PropsForPlanForm;

const defaultProps = {
  ...defaultCommonProps,
  ...defaultPropsForPlanForm,
};

/**
 * CreatePlanView component
 *
 *  props - component props
 */

const CreatePlanView = (props: CreatePlanViewProps) => {
  const { envConfigs, baseURL, hiddenFields } = props;
  const pageTitle = CREATE_PLAN;
  const history = useHistory();

  const configs = {
    ...defaultEnvConfig,
    ...envConfigs,
  };

  const planActivitiesMap = getPlanActivitiesMap(configs);
  const initialValues = {
    ...defaultInitialValues,
    activities: processActivitiesDates(planActivitiesMap[InterventionType.SM]),
  };

  /** called when user clicks on cancel on the plan form */
  const clickHandler = () => {
    history.push(DRAFT_PLANS_LIST_VIEW_URL);
  };

  const planFormProps = {
    hiddenFields,
    initialValues,
    baseURL: baseURL,
    getRedirectPath: redirectPathGetter,
    allFormActivities: getFormActivities(planActivities, configs),
    envConfigs: configs,
    onCancel: clickHandler,
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
