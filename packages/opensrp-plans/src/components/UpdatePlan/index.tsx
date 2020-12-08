/** component renders view where users can edit Plans
 */
import { RouteParams } from '../../helpers/types';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { PlanForm } from '@opensrp/plan-form';
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
import { getPlanFormValues, PlanDefinition } from '@opensrp/plan-form-core';
import { PlanLoading } from 'opensrp-plans/src/helpers/utils';

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
  const { plan, fetchPlan, serviceClass, baseURL } = props;
  const { planId } = props.match.params;
  const [loading, setLoading] = useState<boolean>(!plan);

  const { errorMessage, broken, handleBrokenPage } = useHandleBrokenPage();

  useEffect(() => {
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

  if (!plan && planId) {
    return <Resource404 />;
  }

  const initialValues = getPlanFormValues(plan as PlanDefinition);
  const productFormProps = {
    baseURL,
    initialValues,
  };

  const pageTitle = planId ? `Edit Plan` : `Create Plan`;

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
export type MapStateToProps = Pick<EditViewProps, 'plan'>;
export type MapDispatchToProps = Pick<EditViewProps, 'fetchPlan'>;
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
