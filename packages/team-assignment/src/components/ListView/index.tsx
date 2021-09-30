import React, { useState } from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { Row, PageHeader, Col, Button, Modal, Form, Select } from 'antd';
import {
  TeamAssignmentLoading,
  columnsFactory,
  getPayload,
  ActionsColumnCustomRender,
} from './utils';
import { RouteComponentProps } from 'react-router-dom';
import { OpenSRPService, TableLayout } from '@opensrp-web/react-utils';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp-web/notifications';
import {
  reducer as organizationsReducer,
  fetchOrganizationsAction,
  Organization,
  getOrganizationsArray,
  reducerName as orgReducerName,
} from '@opensrp-web/team-management';
import {
  Tree,
  generateJurisdictionTree,
  locationHierachyDucks,
  ParsedHierarchyNode,
  RawOpenSRPHierarchy,
} from '@opensrp-web/location-management';
import { PlanDefinition } from '@opensrp-web/plan-form-core';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import {
  assignmentsReducer,
  Assignment,
  fetchAssignments,
  assignmentsReducerName,
  getAssignmentsArrayByPlanId,
  RawAssignment,
} from '../../ducks/assignments';
import {
  ASSIGNMENTS_ENDPOINT,
  LOCATION_HIERARCHY_ENDPOINT,
  ORGANIZATION_ENDPOINT,
  PLANS_ENDPOINT,
  POST_ASSIGNMENTS_ENDPOINT,
} from '../../constants';
import lang from '../../lang';
import { processRawAssignments } from '../../ducks/assignments/utils';

const { fetchAllHierarchies, getAllHierarchiesArray } = locationHierachyDucks;

reducerRegistry.register(orgReducerName, organizationsReducer);
reducerRegistry.register(locationHierachyDucks.reducerName, locationHierachyDucks.reducer);
reducerRegistry.register(assignmentsReducerName, assignmentsReducer);

const assignmentsSelector = getAssignmentsArrayByPlanId();

export interface TableData {
  id: string;
  locationName: string;
  existingAssignments: Assignment[];
  setExistingAssignments: (assignments: Assignment[]) => void;
  setAssignedLocAndTeams: (assignments: AssignedLocationAndTeams) => void;
  setModalVisibility: (visible: true) => void;
  assignedTeamIds: string[];
  assignedTeams: string;
}

/** component that renders Team assignment page */
interface RouteParams {
  id?: string;
}

interface AssignedLocationAndTeams {
  locationName: string;
  jurisdictionId: string;
  assignedTeams: string[];
}

interface TeamAssignmentViewProps extends RouteComponentProps<RouteParams> {
  opensrpBaseURL: string;
  defaultPlanId: string;
}

const TeamAssignmentView = (props: TeamAssignmentViewProps) => {
  const { opensrpBaseURL, defaultPlanId } = props;
  const Treedata = useSelector(
    (state) => getAllHierarchiesArray(state) as unknown as ParsedHierarchyNode[]
  );
  const assignmentsList: Assignment[] = useSelector((state) =>
    assignmentsSelector(state, { planId: defaultPlanId })
  );
  const allOrganizations: Organization[] = useSelector((state) => getOrganizationsArray(state));
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [assignedLocAndTeams, setAssignedLocAndTeams] = useState<AssignedLocationAndTeams | null>(
    null
  );
  const [currentParentChildren, setCurrentParentChildren] = useState<ParsedHierarchyNode[]>([]);
  const [existingAssignments, setExistingAssignments] = useState<Assignment[]>([]);
  const columns = columnsFactory(lang);

  React.useEffect(() => {
    if (loading) {
      const plansService = new OpenSRPService(PLANS_ENDPOINT, opensrpBaseURL);
      const plansPromise = plansService
        .read(defaultPlanId)
        .then((response: PlanDefinition[]) => {
          const getJurisdictionCode = response[0].jurisdiction[0].code;
          const hierarchyService = new OpenSRPService(LOCATION_HIERARCHY_ENDPOINT, opensrpBaseURL);
          hierarchyService
            .read(getJurisdictionCode)
            .then((response: RawOpenSRPHierarchy) => {
              const hierarchy = generateJurisdictionTree(response);
              dispatch(fetchAllHierarchies([hierarchy.model] as ParsedHierarchyNode[]));
            })
            .catch(() => {
              sendErrorNotification(lang.ERROR_OCCURED);
            });
        })
        .catch(() => {
          sendErrorNotification(lang.ERROR_OCCURED);
        });
      // get all assignments
      const asssignmentService = new OpenSRPService(ASSIGNMENTS_ENDPOINT, opensrpBaseURL);
      const assignmentsPromise = asssignmentService
        .list({ plan: defaultPlanId })
        .then((response: RawAssignment[]) => {
          const parsedAssignments = processRawAssignments(response);
          dispatch(fetchAssignments(parsedAssignments, assignmentsList.length > 0));
        })
        .catch(() => sendErrorNotification(lang.ERROR_OCCURED));

      // fetch all organizations
      const organizationsService = new OpenSRPService(ORGANIZATION_ENDPOINT, opensrpBaseURL);
      const organizationsPromise = organizationsService
        .list()
        .then((response: Organization[]) => {
          dispatch(fetchOrganizationsAction(response));
        })
        .catch(() => {
          sendErrorNotification(lang.ERROR_OCCURED);
        });

      Promise.all([plansPromise, assignmentsPromise, organizationsPromise])
        .catch(() => {
          sendErrorNotification(lang.ERROR_OCCURED);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  React.useEffect(() => {
    // team assignment only needs one hierarchy
    // i.e when user switches from location unit module
    if (Treedata.length > 1) {
      dispatch(fetchAllHierarchies([]));
    }
  });

  const handleCancel = () => {
    setVisible(false);
  };

  if (loading) {
    return <TeamAssignmentLoading />;
  }

  /**
   * function to filter select options by text - passed all select options to filter from
   *
   * @param input - typed in search text
   * @param option - a select option to be evaluated - with it's key, value, and children props
   * @param option.key - the Select.Option 'key' prop
   * @param option.value - the Select.Option 'value' prop
   * @param option.children - the Select.Option 'children' prop
   * @param option.label - the Select.Option 'label' prop
   * @returns {boolean} - matcher function that evaluates to boolean - whether to include option in filtered set or not
   */
  // Todo: type-check options
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function filterFunction(input: string, option: any): boolean {
    let expr1 = false,
      expr2 = false;
    if (option.children) expr1 = option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    if (option.label) expr2 = option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    return expr1 || expr2;
  }

  const dataSource = currentParentChildren.length ? currentParentChildren : Treedata;

  if (!dataSource.length) {
    return null;
  }

  const tableData = dataSource.map((datum: ParsedHierarchyNode) => {
    const jurisdictionAssignments = assignmentsList.filter(
      (assignment) => assignment.jurisdiction === datum.id
    );
    const jurisdictionOrgs = allOrganizations.filter((org) => {
      const jurisdictionOrgIds = jurisdictionAssignments.map(
        (assignment) => assignment.organization
      );
      return jurisdictionOrgIds.includes(org.identifier);
    });
    const jurisdictionOrgNames = jurisdictionOrgs.map((org) => org.name);

    return {
      id: datum.id,
      locationName: datum.label,
      existingAssignments: jurisdictionAssignments,
      setExistingAssignments,
      setAssignedLocAndTeams: setAssignedLocAndTeams,
      setModalVisibility: setVisible,
      assignedTeamIds: jurisdictionOrgs.map((org) => org.identifier),
      assignedTeams: jurisdictionOrgNames.length ? jurisdictionOrgNames.join(', ') : '-',
    };
  });

  return (
    <div className="content-section">
      <Helmet>
        <title>{lang.TEAM_ASSIGNMENT_PAGE_TITLE}</title>
      </Helmet>
      <PageHeader title={lang.TEAM_ASSIGNMENT_PAGE_TITLE} className="page-header"></PageHeader>
      <Modal
        destroyOnClose={true}
        title={`Assign/Unassign Teams | ${assignedLocAndTeams?.locationName}`}
        visible={visible}
        onCancel={handleCancel}
        okText={lang.SAVE}
        cancelText={lang.CANCEL}
        footer={[
          <Button type="primary" form="teamAssignment" key="submit" htmlType="submit">
            {lang.SAVE}
          </Button>,
          <Button
            id={lang.CANCEL}
            key="cancel"
            onClick={() => {
              handleCancel();
            }}
          >
            {lang.CANCEL}
          </Button>,
        ]}
        okType="default"
      >
        <div className="form-container">
          <Form
            name="teamAssignment"
            onFinish={(values: { assignTeams: string[] }) => {
              const { assignTeams } = values;
              const payload = getPayload(
                assignTeams,
                defaultPlanId,
                assignedLocAndTeams?.jurisdictionId as string,
                assignedLocAndTeams?.assignedTeams,
                existingAssignments
              );
              const serve = new OpenSRPService(POST_ASSIGNMENTS_ENDPOINT, opensrpBaseURL);
              serve
                .create(payload)
                .then(() => {
                  sendSuccessNotification(lang.SUCCESSFULLY_ASSIGNED_TEAMS);
                  setVisible(false);
                  setLoading(true);
                })
                .catch((err: Error) => {
                  sendErrorNotification(err.name, err.message);
                });
            }}
            initialValues={{ assignTeams: assignedLocAndTeams?.assignedTeams }}
          >
            <Form.Item label={lang.TEAMS} name="assignTeams">
              <Select
                mode="multiple"
                allowClear
                showSearch
                placeholder={lang.ENTER_TEAM_NAME}
                optionFilterProp="children"
                filterOption={filterFunction}
              >
                {allOrganizations.map((e) => (
                  <Select.Option key={e.identifier} value={e.identifier}>
                    {e.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Modal>
      <Row>
        <Col className="bg-white p-3" span={6}>
          <Tree
            data={Treedata}
            OnItemClick={(node) => {
              if (node.children) {
                const children = [node, ...node.children];
                setCurrentParentChildren(children);
              }
            }}
          />
        </Col>
        <Col className="bg-white p-3 border-left" span={18}>
          <TableLayout
            id="TeamAssignmentList"
            persistState={true}
            datasource={tableData}
            columns={columns}
            actions={{
              title: lang.ACTIONS,
              width: '20%',
              render: ActionsColumnCustomRender,
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export { TeamAssignmentView };
