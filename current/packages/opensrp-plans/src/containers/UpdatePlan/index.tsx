/**
  component renders view where users can edit Plans
 */
import { RouteParams } from '../../helpers/types';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router';
import { Layout, PageHeader } from 'antd';
import {
  plansReducer,
  fetchPlanDefinitions,
  makePlanDefinitionsArraySelector,
  plansReducerName as planReducerName,
} from '../../ducks/planDefinitions';
import { loadSinglePlan, OpenSRPService } from '../../helpers/dataLoaders';
import { connect } from 'react-redux';
import { Store } from 'redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import Helmet from 'react-helmet';
import { BrokenPage, useHandleBrokenPage, Resource404 } from '@opensrp/react-utils';
import {
  CommonProps,
  defaultCommonProps,
  defaultPropsForPlanForm,
  PropsForPlanForm,
  redirectMapping,
  redirectPathGetter,
} from '../../helpers/common';
import {
  defaultEnvConfig,
  getFormActivities,
  planActivities,
  PlanDefinition,
  PlanStatus,
} from '@opensrp/plan-form-core';
import { PlanLoading } from '../../helpers/utils';
import { PlanForm, getPlanFormValues, propsForUpdatingPlans } from '@opensrp/plan-form';
import { useTranslation } from '../../mls';

/** register catalogue reducer */
reducerRegistry.register(planReducerName, plansReducer);

/** props for EditPlan view */
export interface EditViewProps extends CommonProps, PropsForPlanForm {
  plan: PlanDefinition | null;
  fetchPlan: typeof fetchPlanDefinitions;
  serviceClass: typeof OpenSRPService;
}

const defaultProps = {
  ...defaultCommonProps,
  ...defaultPropsForPlanForm,
  plan: null,
  fetchPlan: fetchPlanDefinitions,
  serviceClass: OpenSRPService,
};

/** type intersection for all types that pertain to the props */
export type EditViewTypes = EditViewProps & RouteComponentProps<RouteParams>;

/**
 * Edit plan view component
 *
 *  props - component props
 */

const EditPlanView = (props: EditViewTypes) => {
  const { plan, fetchPlan, serviceClass, baseURL, envConfigs, hiddenFields } = props;
  const { planId } = props.match.params;
  const [loading, setLoading] = useState<boolean>(!plan);
  const history = useHistory();
  const { t } = useTranslation();

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

  /** called when user clicks on cancel on the plan form */
  const cancelHandler = () => {
    history.push(redirectMapping[plan.status as PlanStatus]);
  };

  const initialValues = getPlanFormValues(plan);
  const productFormProps = {
    hiddenFields,
    baseURL,
    initialValues,
    ...propsForUpdatingPlans(plan.status),
    getRedirectPath: redirectPathGetter,
    allFormActivities: getFormActivities(planActivities, configs),
    envConfigs: configs,
    onCancel: cancelHandler,
  };

  const pageTitle = t('Edit mission');

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
