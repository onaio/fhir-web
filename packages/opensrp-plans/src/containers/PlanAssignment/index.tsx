import reducerRegistry from '@onaio/redux-reducer-registry';
import { PlanDefinition } from '@opensrp/plan-form-core';
import { BrokenPage, Resource404, useHandleBrokenPage } from '@opensrp/react-utils';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Store } from 'redux';
import { loadSinglePlan } from '../../helpers/dataLoaders';
import { PlansLoading } from '../ListView/utils';
import { PlanAssignmentRouteParams } from '../../constants';
import {
  plansReducer,
  fetchPlanDefinitions,
  getPlanDefinitionById,
  plansReducerName,
} from '../../ducks/planDefinitions';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import { OpenSRPService } from '../../helpers/dataLoaders';
import PlanInfo from '../../components/PlanInfo';
import { ActivateMissionCard } from '../../components/ActivateMission';

/** make sure plans reducer is registered */
reducerRegistry.register(plansReducerName, plansReducer);

/** props for the PlanAssignment view  extends CommonProps*/
interface PlanAssignmentProps extends CommonProps {
  plan: PlanDefinition | null;
  service: typeof OpenSRPService;
  fetchPlansCreator: typeof fetchPlanDefinitions;
  showActivateMission: boolean;
}

const defaultProps = {
  ...defaultCommonProps,
  plan: null,
  fetchPlansCreator: fetchPlanDefinitions,
  service: OpenSRPService,
  showActivateMission: false,
};

export type PlanAssignmentTypes = PlanAssignmentProps &
  RouteComponentProps<PlanAssignmentRouteParams>;

/** component that renders plansInfo, planTable and planData */

const PlanAssignment = (props: PlanAssignmentTypes) => {
  const { service, plan, fetchPlansCreator, baseURL, showActivateMission } = props;
  const { planId } = props.match.params;
  const [loading, setLoading] = useState<boolean>(!plan);
  const { broken, errorMessage, handleBrokenPage } = useHandleBrokenPage();

  useEffect(() => {
    const idOfPlan = planId as string;
    loadSinglePlan(baseURL, idOfPlan, service, fetchPlansCreator)
      .catch((err: Error) => handleBrokenPage(err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId]);

  if (loading) {
    return <PlansLoading />;
  }

  if (broken) {
    return <BrokenPage errorMessage={errorMessage} />;
  }
  if (!plan) {
    return <Resource404 />;
  }

  const activateMissionProps = {
    plan,
    submitCallback: (planPayload: PlanDefinition) => fetchPlansCreator([planPayload]),
    serviceClass: service,
    baseURL,
  };

  /** Page Header routes */
  return (
    <div className="plan-detail-view">
      <PlanInfo plan={plan} planId={planId} />
      <div className="plan-activities_section">
        {showActivateMission ? <ActivateMissionCard {...activateMissionProps} /> : null}
      </div>
    </div>
  );
};

PlanAssignment.defaultProps = defaultProps;

export { PlanAssignment };

/** Interface for connected state to props */
interface MapStateToProps {
  plan: PlanDefinition | null;
}

const mapStateToProps = (state: Partial<Store>, ownProps: PlanAssignmentTypes): MapStateToProps => {
  const planId = ownProps.match.params.planId;
  const plan = getPlanDefinitionById(state, planId);
  return { plan };
};

const mapDispatchToProps = {
  fetchPlansCreator: fetchPlanDefinitions,
};

const ConnectedPlanAssignment = connect(mapStateToProps, mapDispatchToProps)(PlanAssignment);
export { ConnectedPlanAssignment };
