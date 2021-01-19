import React, { useRef, useState } from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { Row, PageHeader, Col, Button, Table, Modal, Form, Select } from 'antd';
import { TeamAssignmentLoading, columns, getPayload } from './utils';
import { RouteComponentProps } from 'react-router-dom';
import { OpenSRPService } from '@opensrp/react-utils';
import { getAccessToken } from '@onaio/session-reducer';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
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
} from '@opensrp/location-management';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import reducer, {
  Assignment,
  fetchAssignments,
  getAssignments,
  reducerName as assignmentReducerName,
} from '../../ducks/assignments';
import { PlanDefinition } from '../../ducks/assignments/types';
import {
  ASSIGNMENTS_ENDPOINT,
  CANCEL,
  LOCATION_HIERARCHY_ENDPOINT,
  ORGANIZATION_ENDPOINT,
  PLANS_ENDPOINT,
  POST_ASSIGNMENTS_ENDPOINT,
  SAVE,
  SUCCESSFULLY_ASSIGNED_TEAMS,
  TEAM_ASSIGNMENT_PAGE_TITLE,
} from '../../constants';

reducerRegistry.register(teamsReducerName, teamsReducer);
reducerRegistry.register(hierarchyReducerName, hierarchyReducer);
reducerRegistry.register(assignmentReducerName, reducer);

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
  const [form] = Form.useForm();
  const isMounted = useRef<boolean>(true);
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const Treedata = useSelector(
    (state) => (getAllHierarchiesArray(state) as unknown) as ParsedHierarchyNode[]
  );
  const assignmentsList: Assignment[] = useSelector((state) => getAssignments(state));
  const allOrganizations: Organization[] = useSelector((state) => getOrganizationsArray(state));
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [assignedLocAndTeams, setAssignedLocAndTeams] = useState<AssignedLocationAndTeams | null>(
    null
  );
  const [planLocationId, setPlanLocationId] = useState<string>('');
  const [currentParentChildren, setCurrentParentChildren] = useState<ParsedHierarchyNode[]>([]);
  const [existingAssignments, setExistingAssignments] = useState<Assignment[]>([]);
  const planLocationIdRef = useRef(planLocationId);
  planLocationIdRef.current = planLocationId;
  const { broken, errorMessage, handleBrokenPage } = useHandleBrokenPage();

  React.useEffect(() => {
    if (loading) {
      const plansService = new OpenSRPService(PLANS_ENDPOINT, opensrpBaseURL);
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
      const asssignmentService = new OpenSRPService(ASSIGNMENTS_ENDPOINT, opensrpBaseURL);
      const assignmentsPromise = asssignmentService
        .list({ plan: defaultPlanId })
        .then((response: Assignment[]) => {
          dispatch(fetchAssignments(response));
        })
        .catch((e) => handleBrokenPage(e.message));

      // fetch all organizations
      const organizationsService = new OpenSRPService(ORGANIZATION_ENDPOINT, opensrpBaseURL);
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
      if (planLocationIdRef.current.length) {
        const hierarchyService = new OpenSRPService(LOCATION_HIERARCHY_ENDPOINT, opensrpBaseURL);
        hierarchyPromise = hierarchyService
          .read(planLocationId)
          .then((response: RawOpenSRPHierarchy) => {
            const hierarchy = generateJurisdictionTree(response);
            dispatch(fetchAllHierarchies([hierarchy.model] as ParsedHierarchyNode[]));
            setPlanLocationId('');
          })
          .catch((e) => {
            handleBrokenPage(e.message);
          });
      }

      Promise.all([plansPromise, assignmentsPromise, organizationsPromise, hierarchyPromise])
        .finally(() => {
          setLoading(false);
          planLocationIdRef.current = '';
        })
        .catch((e) => {
          handleBrokenPage(e.message);
        });
    }
  }, [
    Treedata,
    accessToken,
    currentParentChildren.length,
    defaultPlanId,
    dispatch,
    handleBrokenPage,
    loading,
    opensrpBaseURL,
    planLocationId,
  ]);

  React.useEffect(() => {
    form.setFieldsValue({ assignTeams: assignedLocAndTeams?.assignedTeams });
  }, [assignedLocAndTeams, form]);

  React.useLayoutEffect(() => {
    return () => {
      if (isMounted.current) {
        dispatch(fetchAllHierarchies([]));
      }
      isMounted.current = false;
    };
  });

  const handleCancel = () => {
    setVisible(false);
  };

  if (loading || !Treedata.length) {
    return <TeamAssignmentLoading />;
  }

  if (broken) {
    return <BrokenPage errorMessage={errorMessage} />;
  }

  /** function to filter options from the select or not
   *
   * @param {string} input value
   * @param {any} option .
   * @returns {boolean} return weather option will be included in the filtered set;
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function filterFunction(input: string, option: any): boolean {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
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
    const jurisdictionOrgNames = jurisdictionOrgs.map((org) => org.name);

    return {
      id: datum.id,
      key: i.toString(),
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
        <title>{TEAM_ASSIGNMENT_PAGE_TITLE}</title>
      </Helmet>
      <PageHeader title={TEAM_ASSIGNMENT_PAGE_TITLE} className="page-header"></PageHeader>
      <Modal
        destroyOnClose={true}
        title={`Assign/Unassign Teams | ${assignedLocAndTeams?.locationName}`}
        visible={visible}
        onCancel={handleCancel}
        okText={SAVE}
        cancelText={CANCEL}
        footer={[
          <Button type="primary" form="teamAssignment" key="submit" htmlType="submit">
            Save
          </Button>,
          <Button
            id={CANCEL}
            key="cancel"
            onClick={() => {
              setVisible(false);
            }}
          >
            Cancel
          </Button>,
        ]}
        okType="default"
      >
        <div className="form-container">
          <Form
            form={form}
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
                  sendSuccessNotification(SUCCESSFULLY_ASSIGNED_TEAMS);
                  setVisible(false);
                  setLoading(true);
                })
                .catch((err: Error) => {
                  sendErrorNotification(err.name, err.message);
                });
            }}
            initialValues={{ assignTeams: assignedLocAndTeams?.assignedTeams }}
          >
            <Form.Item label={`Teams`} name="assignTeams">
              <Select
                mode="multiple"
                allowClear
                showSearch
                placeholder="Enter a Team name"
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
            appendParentAsChild={false}
            OnItemClick={(node) => {
              if (node.children) {
                const children = [node, ...node.children];
                setCurrentParentChildren(children);
              }
            }}
          />
        </Col>
        <Col className="bg-white p-3 border-left" span={18}>
          <Table dataSource={tableData} columns={columns}></Table>
        </Col>
      </Row>
    </div>
  );
};

export { TeamAssignmentView };
