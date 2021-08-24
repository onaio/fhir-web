/** Tabular view to view/assign areas and teams to missions */
import React, { useEffect, useState } from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import {
  fetchOrganizationsAction as fetchOrganizations,
  getOrganizationsArray,
  Organization,
  reducer as organizationsReducer,
  reducerName as orgReducerName,
} from '@opensrp-web/team-management';
import {
  assignmentsReducer,
  assignmentsReducerName,
  Assignment,
  fetchAssignments,
  getAssignmentsArrayByPlanId,
} from '@opensrp-web/team-assignment';
import {
  JurisdictionsReducer,
  jurisdictionReducerName,
  Jurisdiction,
  fetchJurisdictions,
  getJursByGeoLevel,
} from '../../ducks/jurisdictions';
import {
  loadAssignments,
  loadJurisdictions,
  loadOrganizations,
  OpenSRPService,
} from '../../helpers/dataLoaders';
import { connect } from 'react-redux';
import { Store } from 'redux';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import { BrokenPage, Column, TableLayout, useHandleBrokenPage } from '@opensrp-web/react-utils';
import { PlanDefinition } from '@opensrp-web/plan-form-core';
import { getDataSource, TableData, getPlanAssignmentColumns } from './utils';
import {
  fetchPlanDefinitions,
  makePlanDefinitionsArraySelector,
} from '../../ducks/planDefinitions';
import { useTranslation } from 'react-i18next';

reducerRegistry.register(assignmentsReducerName, assignmentsReducer);
reducerRegistry.register(orgReducerName, organizationsReducer);
reducerRegistry.register(jurisdictionReducerName, JurisdictionsReducer);

export interface AssignmentTableProps extends CommonProps {
  serviceClass: typeof OpenSRPService;
  assignmentsActionCreator: typeof fetchAssignments;
  organizationsActionCreator: typeof fetchOrganizations;
  jursActionCreator: typeof fetchJurisdictions;
  planCreator: typeof fetchPlanDefinitions;
  assignments: Assignment[];
  organizations: Organization[];
  plan: PlanDefinition;
  jurisdictions: Jurisdiction[];
  assignAtGeoLevel: number;
  disableAssignments: boolean;
}

const defaultProps = {
  ...defaultCommonProps,
  serviceClass: OpenSRPService,
  assignmentsActionCreator: fetchAssignments,
  organizationsActionCreator: fetchOrganizations,
  jursActionCreator: fetchJurisdictions,
  planCreator: fetchPlanDefinitions,
  assignments: [],
  organizations: [],
  jurisdictions: [],
  assignAtGeoLevel: 0,
  disableAssignments: false,
};

/** Table component for eusm plan assignments, requires plan
 *
 * @param props -the props
 */
const AssignmentTable = (props: AssignmentTableProps) => {
  const {
    plan,
    serviceClass,
    assignments,
    organizations,
    assignmentsActionCreator,
    organizationsActionCreator,
    jursActionCreator,
    jurisdictions,
    baseURL,
    planCreator,
    assignAtGeoLevel,
    disableAssignments,
  } = props;
  const { handleBrokenPage, broken, errorMessage } = useHandleBrokenPage();
  const [loading, setLoading] = useState<boolean>(true);
  const planId = plan.identifier;
  useTranslation();

  // todo component should re-render make the calls to get
  useEffect(() => {
    const assignmentsPromise = loadAssignments(
      baseURL,
      planId,
      serviceClass,
      assignmentsActionCreator
    );
    const organizationsPromise = loadOrganizations(
      baseURL,
      serviceClass,
      organizationsActionCreator
    );
    const jursPromise = loadJurisdictions(
      baseURL,
      assignAtGeoLevel,
      jursActionCreator,
      serviceClass
    );

    Promise.all([assignmentsPromise, organizationsPromise, jursPromise])
      .catch((e) => {
        handleBrokenPage(e);
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan.jurisdiction]);

  if (broken) {
    return <BrokenPage errorMessage={errorMessage} />;
  }

  const planJurisdictions = plan.jurisdiction.map((jurCode) => jurCode.code);
  const datasource = getDataSource(organizations, jurisdictions, assignments, planJurisdictions);

  const columns = getPlanAssignmentColumns(
    assignments,
    organizations,
    jurisdictions,
    OpenSRPService,
    planCreator,
    assignmentsActionCreator,
    plan,
    baseURL,
    disableAssignments
  ) as Column<TableData>[];

  return (
    <div className="assignment-table">
      <TableLayout
        id="PlansAssignmentList"
        persistState={true}
        datasource={datasource}
        loading={loading}
        columns={columns}
        pagination={false}
      />
    </div>
  );
};

AssignmentTable.defaultProps = defaultProps;
export { AssignmentTable };

type MapStateToProps = Pick<
  AssignmentTableProps,
  'assignments' | 'organizations' | 'jurisdictions' | 'plan'
>;
type MapDispatchToProps = Pick<
  AssignmentTableProps,
  'assignmentsActionCreator' | 'organizationsActionCreator' | 'jursActionCreator' | 'planCreator'
>;

const jurisdictionsSelector = getJursByGeoLevel();
const plansSelector = makePlanDefinitionsArraySelector();
const assignmentsByPlanId = getAssignmentsArrayByPlanId();

const mapStateToProps = (
  state: Partial<Store>,
  ownProps: AssignmentTableProps
): MapStateToProps => {
  const { plan, assignAtGeoLevel } = ownProps;
  const planId = plan.identifier;
  const thePlan = plansSelector(state, { planIds: [planId] })[0] ?? plan;
  const assignments = assignmentsByPlanId(state, { planId });
  const organizations = getOrganizationsArray(state);
  const jurisdictions = jurisdictionsSelector(state, { geoLevel: assignAtGeoLevel });
  return {
    assignments,
    organizations,
    jurisdictions,
    plan: thePlan,
  };
};

const mapDispatchToProps: MapDispatchToProps = {
  assignmentsActionCreator: fetchAssignments,
  organizationsActionCreator: fetchOrganizations,
  jursActionCreator: fetchJurisdictions,
  planCreator: fetchPlanDefinitions,
};

const ConnectedAssignmentTable = connect(mapStateToProps, mapDispatchToProps)(AssignmentTable);
export { ConnectedAssignmentTable };
