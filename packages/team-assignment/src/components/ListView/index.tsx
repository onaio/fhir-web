import React, { useState } from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { Row, PageHeader, Col, Button, Modal, Form, Select, Spin } from 'antd';
import { columnsFactory, getPayload, ActionsColumnCustomRender } from './utils';
import { RouteComponentProps } from 'react-router-dom';
import { OpenSRPService, TableLayout, BrokenPage } from '@opensrp/react-utils';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import {
  reducer as organizationsReducer,
  fetchOrganizationsAction,
  Organization,
  getOrganizationsArray,
  reducerName as orgReducerName,
} from '@opensrp/team-management';
import {
  Tree,
  generateJurisdictionTree,
  locationHierachyDucks,
  ParsedHierarchyNode,
  RawOpenSRPHierarchy,
} from '@opensrp/location-management';
import { PlanDefinition } from '@opensrp/plan-form-core';
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
  ORGANIZATION_COUNT_ENDPOINT,
  ORGANIZATION_ENDPOINT,
  PLANS_ENDPOINT,
  POST_ASSIGNMENTS_ENDPOINT,
} from '../../constants';
import { useTranslation } from '../../mls';
import type { TFunction } from '@opensrp/i18n';
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

/**
 * Function to fetch orgs against a paginatied endpoint
 *
 * @param opensrpBaseURL - OpenSRP API base URL
 * @param pageNumber - paginated page number
 * @param pageSize - number of orgs in each page
 * @param t - translator function
 */
async function fetchOrgs(
  opensrpBaseURL: string,
  pageNumber: number,
  pageSize: number,
  t: TFunction
): Promise<Organization[]> {
  // pagination params
  const paginationParams = {
    pageNumber,
    pageSize,
  };
  // fetch all organizations
  const organizationsService = new OpenSRPService(ORGANIZATION_ENDPOINT, opensrpBaseURL);
  try {
    const getOrgs = await organizationsService.list(paginationParams);
    return getOrgs;
  } catch (_) {
    sendErrorNotification(t('An error occurred'));
    return [];
  }
}

/**
 * function to fetch paginated orgs resource recursively
 *
 * @param opensrpBaseURL - OpenSRP API base URL
 * @param pageSize - number of orgs in each page
 * @param t - translator function
 * @returns {Promise<Organization[]>} - an array of all orgs in a paginated endpoint
 */
async function fetchOrgsRecursively(
  opensrpBaseURL: string,
  pageSize: number,
  t: TFunction
): Promise<Organization[]> {
  const serve = new OpenSRPService(ORGANIZATION_COUNT_ENDPOINT, opensrpBaseURL);
  const teamsCount: number = await serve.list();

  // get the maximum possible page numbers
  const maxPageNo = Math.ceil(teamsCount / pageSize);

  // compose a promise array to resolve in parallel
  const promises: (() => Promise<Organization[]>)[] = [];
  for (let pageNumber = 1; pageNumber <= maxPageNo; pageNumber++) {
    promises.push(() => fetchOrgs(opensrpBaseURL, pageNumber, pageSize, t));
  }

  // fetch orgs recursively according to page numbers
  return Promise.all(promises.map((prom) => prom()))
    .then((orgs: Organization[][]) => {
      // flatten 2D array - [[][]]
      const orgsArray = orgs.flat();
      return orgsArray;
    })
    .catch((err) => {
      throw err;
    });
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
  const [apiError, setApiError] = useState<boolean>(false);
  const [assignedLocAndTeams, setAssignedLocAndTeams] = useState<AssignedLocationAndTeams | null>(
    null
  );
  const [currentParentChildren, setCurrentParentChildren] = useState<ParsedHierarchyNode[]>([]);
  const [existingAssignments, setExistingAssignments] = useState<Assignment[]>([]);
  const { t } = useTranslation();
  const columns = columnsFactory(t);

  React.useEffect(() => {
    if (loading) {
      const plansService = new OpenSRPService(PLANS_ENDPOINT, opensrpBaseURL);
      const plansPromise = plansService.read(defaultPlanId).then((response: PlanDefinition[]) => {
        const getJurisdictionCode = response[0].jurisdiction[0].code;
        const hierarchyService = new OpenSRPService(LOCATION_HIERARCHY_ENDPOINT, opensrpBaseURL);
        hierarchyService
          .read(getJurisdictionCode)
          .then((response: RawOpenSRPHierarchy) => {
            const hierarchy = generateJurisdictionTree(response);
            dispatch(fetchAllHierarchies([hierarchy.model] as ParsedHierarchyNode[]));
          })
          .catch((err) => {
            return err;
          });
      });
      // get all assignments
      const asssignmentService = new OpenSRPService(ASSIGNMENTS_ENDPOINT, opensrpBaseURL);
      const assignmentsPromise = asssignmentService
        .list({ plan: defaultPlanId })
        .then((response: RawAssignment[]) => {
          const parsedAssignments = processRawAssignments(response);
          dispatch(fetchAssignments(parsedAssignments, assignmentsList.length > 0));
        });

      // fetch all organizations (pagination enabled)
      const organizationsPromise = fetchOrgsRecursively(opensrpBaseURL, 1000, t).then(
        (orgs: Organization[]) => {
          dispatch(fetchOrganizationsAction(orgs));
        }
      );

      Promise.all([plansPromise, assignmentsPromise, organizationsPromise])
        .catch(() => {
          sendErrorNotification(t('An error occurred'));
          setApiError(true);
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

  if (apiError) {
    return <BrokenPage />;
  }

  if (loading) {
    return <Spin size="large" className="custom-spinner" />;
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
        <title>{t('Team Assignment')}</title>
      </Helmet>
      <PageHeader title={t('Team Assignment')} className="page-header"></PageHeader>
      <Modal
        destroyOnClose={true}
        title={t('Assign/Unassign Teams | {{locationName}}', {
          locationName: assignedLocAndTeams?.locationName,
        })}
        visible={visible}
        onCancel={handleCancel}
        okText={t('Save')}
        cancelText={t('Cancel')}
        footer={[
          <Button type="primary" form="teamAssignment" key="submit" htmlType="submit">
            {t('Save')}
          </Button>,
          <Button
            id={t('Cancel')}
            key="cancel"
            onClick={() => {
              handleCancel();
            }}
          >
            {t('Cancel')}
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
                  sendSuccessNotification(t('Successfully Assigned Teams'));
                  setVisible(false);
                  setLoading(true);
                })
                .catch((err: Error) => {
                  sendErrorNotification(err.name, err.message);
                });
            }}
            initialValues={{ assignTeams: assignedLocAndTeams?.assignedTeams }}
          >
            <Form.Item label={t('Teams')} name="assignTeams">
              <Select
                mode="multiple"
                allowClear
                showSearch
                placeholder={t('Enter a Team name')}
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
              title: t('Actions'),
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
