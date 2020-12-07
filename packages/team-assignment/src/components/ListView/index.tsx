import React, { useState } from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { Row, PageHeader, Col, Button, Table } from 'antd';
import { TeamAssignmentLoading, columns } from './utils';
import { Link, RouteComponentProps } from 'react-router-dom';
import { OpenSRPService } from '@opensrp/server-service';
import { getAccessToken } from '@onaio/session-reducer';
import { BrokenPage, useHandleBrokenPage } from '@opensrp/react-utils';
import {
  reducer as teamsReducer,
  fetchOrganizationsAction,
  Organization,
  getOrganizationsArray,
  reducerName as teamsReducerName,
} from '@opensrp/team-management';
import {
  Tree,
  fetchAllHierarchies,
  generateJurisdictionTree,
  getAllHierarchiesArray,
  ParsedHierarchyNode,
  RawOpenSRPHierarchy,
  reducerName as hierarchyReducerName,
  reducer as hierarchyReducer,
  getCurrentChildren,
} from '@opensrp/location-management';
import { Helmet } from 'react-helmet';
import { TEAM_ASSIGNMENT_CREATE_VIEW_URL } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import reducer, {
  Assignment,
  fetchAssignments,
  getAssignments,
  reducerName as assignmentReducerName,
} from '../../ducks/assignments';
import { PlanDefinition } from 'team-assignment/src/ducks/assignments/types';

reducerRegistry.register(teamsReducerName, teamsReducer);
reducerRegistry.register(hierarchyReducerName, hierarchyReducer);
reducerRegistry.register(assignmentReducerName, reducer);

/** component that renders Team assignment page */
interface RouteParams {
  id?: string;
}

interface TeamAssignmentViewProps extends RouteComponentProps<RouteParams> {
  opensrpBaseURL: string;
  defaultPlanId: string;
}

const TeamAssignmentView = (props: TeamAssignmentViewProps) => {
  const { opensrpBaseURL, defaultPlanId } = props;
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const Treedata = useSelector(
    (state) => (getAllHierarchiesArray(state) as unknown) as ParsedHierarchyNode[]
  );
  const assignmentsList: Assignment[] = useSelector((state) => getAssignments(state));
  const allOrganizations: Organization[] = useSelector((state) => getOrganizationsArray(state));
  const currentParentChildren = (useSelector((state) =>
    getCurrentChildren(state)
  ) as unknown) as ParsedHierarchyNode[];
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [planLocationId, setPlanLocationId] = useState<string>('');
  const { broken, errorMessage, handleBrokenPage } = useHandleBrokenPage();

  React.useEffect(() => {
    if (loading) {
      const plansService = new OpenSRPService(accessToken, opensrpBaseURL, 'plans');
      const plansPromise = plansService
        .read(defaultPlanId)
        .then((response: PlanDefinition[]) => {
          const getJurisdictionCode = response[0].jurisdiction[0].code;
          setPlanLocationId(getJurisdictionCode);
        })
        .catch((e) => {
          handleBrokenPage(e.message);
        });
      // get all assignments
      const asssignmentService = new OpenSRPService(
        accessToken,
        opensrpBaseURL,
        'organization/assignedLocationsAndPlans'
      );
      const assignmentsPromise = asssignmentService
        .list({ plan: defaultPlanId })
        .then((response: Assignment[]) => {
          dispatch(fetchAssignments(response));
        })
        .catch((e) => handleBrokenPage(e.message));

      // fetch all organizations
      const organizationsService = new OpenSRPService(accessToken, opensrpBaseURL, 'organization');
      const organizationsPromise = organizationsService
        .list()
        .then((response: Organization[]) => {
          dispatch(fetchOrganizationsAction(response));
        })
        .catch((e) => {
          handleBrokenPage(e.message);
        });

      // fetch plan location hierarchy
      let hierarchyPromise;
      if (planLocationId.length && !Treedata.length) {
        const hierarchyService = new OpenSRPService(
          accessToken,
          opensrpBaseURL,
          'location/hierarchy'
        );
        hierarchyPromise = hierarchyService
          .read(planLocationId)
          .then((response: RawOpenSRPHierarchy) => {
            const hierarchy = generateJurisdictionTree(response);
            dispatch(fetchAllHierarchies(hierarchy.model));
          })
          .catch((e) => {
            handleBrokenPage(e.message);
          });
      }

      Promise.all([plansPromise, assignmentsPromise, organizationsPromise, hierarchyPromise])
        .finally(() => setLoading(false))
        .catch((e) => {
          handleBrokenPage(e.message);
        });
    }
  }, [
    Treedata.length,
    accessToken,
    currentParentChildren.length,
    defaultPlanId,
    dispatch,
    handleBrokenPage,
    loading,
    opensrpBaseURL,
    planLocationId,
  ]);

  if (loading || !Treedata.length) {
    return <TeamAssignmentLoading />;
  }

  if (broken) {
    return <BrokenPage errorMessage={errorMessage} />;
  }

  const dataSource = currentParentChildren.length ? currentParentChildren : Treedata;

  const tableData = dataSource.map((datum: ParsedHierarchyNode, i: number) => {
    const jurisdictionAssignments = assignmentsList.filter(
      (assignment) => assignment.jurisdictionId === datum.id
    );
    const jurisdictionOrgs = allOrganizations.filter((org) => {
      const jurisdictionOrgIds = jurisdictionAssignments.map(
        (assignment) => assignment.organizationId
      );
      return jurisdictionOrgIds.includes(org.identifier);
    });
    const jurisdictionOrgIds = jurisdictionOrgs.map((org) => org.name);
    return {
      id: datum.id,
      key: i.toString(),
      locationName: datum.label,
      assignedTeams: jurisdictionOrgIds.length ? jurisdictionOrgIds.join(', ') : '-',
    };
  });

  const pageTitle = `Team Assignment`;
  return (
    <div className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} className="page-header"></PageHeader>
      <Row className={'list-view'}>
        <Col className="bg-white p-3" span={6}>
          <Tree data={Treedata} appendParentAsChild={false} />
        </Col>
        <Col className={'main-content'}>
          <div className="main-content__header">
            <Link to={TEAM_ASSIGNMENT_CREATE_VIEW_URL}>
              <Button type="primary" size="large">
                {' + Assign Team'}
              </Button>
            </Link>
          </div>
          <Table dataSource={tableData} columns={columns}></Table>
        </Col>
      </Row>
    </div>
  );
};

export { TeamAssignmentView };
