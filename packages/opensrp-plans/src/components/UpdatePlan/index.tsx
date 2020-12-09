/** component renders view where users can edit Plans
 */
import { RouteParams } from '../../helpers/types';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Layout, PageHeader } from 'antd';
import planReducer, {
  fetchPlanDefinitions,
  makePlanDefinitionsArraySelector,
  reducerName as planReducerName,
} from '../../ducks';
import { loadSinglePlan, OpenSRPService } from '../../helpers/dataLoaders';
import { connect } from 'react-redux';
import { Store } from 'redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import Helmet from 'react-helmet';
import { BrokenPage, useHandleBrokenPage, Resource404 } from '@opensrp/react-utils';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import {
  defaultEnvConfig,
  getFormActivities,
  planActivities,
  PlanDefinition,
} from '@opensrp/plan-form-core';
import { PlanLoading } from '../../helpers/utils';
import {
  PlanForm,
  getPlanFormValues,
  propsForUpdatingPlans,
  PlanFormFieldsKeys,
} from '@opensrp/plan-form';
import { EDIT_PLAN } from '../../lang';
import { PLANS_LIST_VIEW_URL } from '../../constants';

/** register catalogue reducer */
reducerRegistry.register(planReducerName, planReducer);

/** props for createEditProduct view */
export interface EditViewProps extends CommonProps {
  plan: PlanDefinition | null;
  fetchPlan: typeof fetchPlanDefinitions;
  serviceClass: typeof OpenSRPService;
}

const defaultProps = {
  ...defaultCommonProps,
  plan: null,
  fetchPlan: fetchPlanDefinitions,
  serviceClass: OpenSRPService,
};

/** type intersection for all types that pertain to the props */
export type EditViewTypes = EditViewProps & RouteComponentProps<RouteParams>;

/**
 * CreateEditProductView component
 *
 *  props - component props
 */

const EditPlanView = (props: EditViewTypes) => {
  const { plan, fetchPlan, serviceClass, baseURL, envConfigs } = props;
  const { planId } = props.match.params;
  const [loading, setLoading] = useState<boolean>(!plan);

  const { errorMessage, broken, handleBrokenPage } = useHandleBrokenPage();

  const configs = {
    ...defaultEnvConfig,
    ...envConfigs,
  };

  useEffect(() => {
    if (!planId) {
      return;
    }
    loadSinglePlan(baseURL, planId, serviceClass, fetchPlan)
      .finally(() => setLoading(false))
      .catch((err: Error) => handleBrokenPage(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId]);

  if (loading) {
    return <PlanLoading />;
  }

  if (broken) {
    return <BrokenPage errorMessage={errorMessage} />;
  }

  if (!plan) {
    return <Resource404 />;
  }

  const initialValues = getPlanFormValues(plan);
  const productFormProps = {
    hiddenFields: ['interventionType', 'activities'] as PlanFormFieldsKeys[],
    baseURL,
    initialValues,
    ...propsForUpdatingPlans(plan.status),
    redirectAfterAction: PLANS_LIST_VIEW_URL,
    allFormActivities: getFormActivities(planActivities, configs),
    envConfigs: configs,
  };

  const pageTitle = EDIT_PLAN;

  return (
    <Layout className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} className="pageHeader"></PageHeader>

      <PlanForm {...productFormProps} />
    </Layout>
  );
};

EditPlanView.defaultProps = defaultProps;

export { EditPlanView as EditProductView };

const planSelector = makePlanDefinitionsArraySelector();

/** Interface for connected state to props */
type MapStateToProps = Pick<EditViewProps, 'plan'>;
type MapDispatchToProps = Pick<EditViewProps, 'fetchPlan'>;
// connect to store
const mapStateToProps = (state: Partial<Store>, ownProps: EditViewTypes): MapStateToProps => {
  const planId = ownProps.match.params.planId ?? '';
  const plans = planSelector(state, { planIds: [planId] });
  const plan = plans[0] ?? null;
  return { plan };
};

/** map props to action creators */
const mapDispatchToProps: MapDispatchToProps = {
  fetchPlan: fetchPlanDefinitions,
};

/** product catalogue view that is connected to store */
const ConnectedEditPlanView = connect(mapStateToProps, mapDispatchToProps)(EditPlanView);

export { ConnectedEditPlanView };
