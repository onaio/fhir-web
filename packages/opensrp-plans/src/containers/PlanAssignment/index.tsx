import reducerRegistry from '@onaio/redux-reducer-registry';
import { PlanDefinition, PlanStatus } from '@opensrp/plan-form-core';
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
import { ConnectedAssignmentTable } from '../../components/AssignmentTable';
import { MissionData } from '../../components/MissionData';
import { AssignmentTableProps } from '../../components/AssignmentTable';

/** make sure plans reducer is registered */
reducerRegistry.register(plansReducerName, plansReducer);

/** props for the PlanAssignment view  extends CommonProps*/
interface PlanAssignmentProps extends CommonProps {
  plan: PlanDefinition | null;
  service: typeof OpenSRPService;
  fetchPlansCreator: typeof fetchPlanDefinitions;
  showActivateMission: boolean;
  showAssignmentTable: boolean;
  showMissionData: boolean;
  assignGeoLevel: number;
}

const defaultProps = {
  ...defaultCommonProps,
  plan: null,
  fetchPlansCreator: fetchPlanDefinitions,
  service: OpenSRPService,
  showActivateMission: false,
  showAssignmentTable: false,
  showMissionData: false,
  assignGeoLevel: 0,
};

export type PlanAssignmentTypes = PlanAssignmentProps &
  RouteComponentProps<PlanAssignmentRouteParams>;

/** component that renders plansInfo, planTable and planData */

const PlanAssignment = (props: PlanAssignmentTypes) => {
  const {
    service,
    plan,
    fetchPlansCreator,
    baseURL,
    showActivateMission,
    showAssignmentTable,
    showMissionData,
    assignGeoLevel: assignAtGeoLevel,
  } = props;
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

  const planISDraftActive = [PlanStatus.DRAFT, PlanStatus.ACTIVE].includes(
    plan.status as PlanStatus
  );

  const assignmentTableProps = {
    baseURL,
    serviceClass: service,
    plan,
    assignAtGeoLevel,
    disableAssignments: !planISDraftActive,
    // ts bug - default props not working, ts asking for default props to be repassed https://github.com/microsoft/TypeScript/issues/31247
  } as unknown as AssignmentTableProps;

  /** Page Header routes */
  return (
    <div>
      <PlanInfo plan={plan} planId={planId} />
      <div className="plan-activities_section">
        {showAssignmentTable ? <ConnectedAssignmentTable {...assignmentTableProps} /> : null}
        {showActivateMission ? <ActivateMissionCard {...activateMissionProps} /> : null}
        {showMissionData ? <MissionData baseURL={baseURL} plan={plan} /> : null}
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
