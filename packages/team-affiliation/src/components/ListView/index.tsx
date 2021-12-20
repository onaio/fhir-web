import React, { useState } from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { Row, PageHeader, Col, Button, Modal, Form, Select } from 'antd';
import {
  TeamAffiliationLoading,
  columnsFactory,
  // getPayload,
  ActionsColumnCustomRender,
  getPayload,
  Assignment,
} from './utils';
import { RouteComponentProps } from 'react-router-dom';
import {
  OpenSRPService,
  TableLayout,
  FHIRServiceClass,
  BrokenPage,
  FHIRResponse,
} from '@opensrp/react-utils';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { Organization, getOrganizationsArray } from '@opensrp/team-management';
import {
  Tree,
  generateJurisdictionTree,
  ParsedHierarchyNode,
  RawOpenSRPHierarchy,
} from '@opensrp/location-management';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import lang from '../../lang';
import {
  LocationHirerchy,
  LocationHirerchyWrappar,
  OrganizationAffiliation,
  TreeNode,
  TreeNodeWrapper,
} from '../../types';
import {
  LOCATIONHIERARCHY_ENDPOINT,
  LOCATION_ENDPOINT,
  ORGANIZATIONAFFILIATION_ENDPOINT,
  POST_ORGANIZATIONAFFILIATION_ENDPOINT,
} from '../../constants';
import { useQuery, useQueries, UseQueryResult } from 'react-query';
import { useEffect } from 'react';
import { getConfig } from '@opensrp/pkg-config';

export interface TableData {
  id: string;
  locationName: string;
  existingAffiliations: any[];
  setExistingAffiliations: (affiliations: Assignment[]) => void;
  setAssignedLocAndOrgs: (affiliations: any) => void;
  setModalVisibility: (visible: true) => void;
  assignedOrgIds: string[];
  assignedOrgs: string;
}

interface TeamAffiliationViewProps {
  defaultPlanId: string;
}
interface AssignedLocationAndTeams {
  locationName: string;
  jurisdictionId: string;
  assignedOrgs: string[];
}

const TeamAffiliationView = (props: TeamAffiliationViewProps) => {
  const { defaultPlanId } = props;

  const fhirBaseURL = getConfig('fhirBaseURL') ?? '';

  const allOrganizations: Organization[] = useSelector((state) => getOrganizationsArray(state));
  const [loading, setLoading] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [assignedLocAndOrgs, setAssignedLocAndOrgs] = useState<AssignedLocationAndTeams | null>(
    null
  );
  const [currentParentChildren, setCurrentParentChildren] = useState<ParsedHierarchyNode[]>([]);
  const [existingAffiliations, setExistingAffiliations] = useState<Assignment[]>([]);
  const columns = columnsFactory(lang);
  const [selectedLocation, setSelectedLocation] = useState<LocationHirerchy>(
    {} as LocationHirerchy
  );

  //local states
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [locationHierarchiesData, setLocationHierarchiesData] = useState<ParsedHierarchyNode[]>([]);
  // const [detail, setDetail] = useState<LocationDetailData | 'loading' | null>(null);
  const [currentClickedNode, setCurrentClickedNode] = useState<ParsedHierarchyNode | null>(null);

  //side effects
  useEffect(() => {
    if (currentParentChildren) {
      console.log('currentParentChildren :: ', currentParentChildren);

      const refactorTableData = currentParentChildren.map(async (chidlren) => {
        const serve = new FHIRServiceClass(fhirBaseURL, ORGANIZATIONAFFILIATION_ENDPOINT);

        const res = await serve.list({ location: chidlren?.node?.id });
        const organizations = res?.entry?.map((entry) => entry?.resource?.organization?.display);
        console.log('organizations :: ', organizations);

        return {
          id: chidlren.id,
          locationName: chidlren.label,
          existingAffiliations: ['abc', 'def'],
          setExistingAffiliations,
          setAssignedLocAndOrgs,
          setModalVisibility: setVisible,
          assignedOrgIds: currentParentChildren.map((org) => org.id),
          assignedOrgs: organizations ? organizations.join(', ') : '-',
        };
      });

      Promise.all(refactorTableData)
        .then((data) => {
          setTableData(data);
        })
        .catch((err) => console.log('all promise err::', err));
    }
  }, [currentParentChildren]);

  //organization affiliation
  const organizationAffiliationService = new FHIRServiceClass<OrganizationAffiliation>(
    fhirBaseURL,
    ORGANIZATIONAFFILIATION_ENDPOINT
  );
  const organizations = useQuery(
    ORGANIZATIONAFFILIATION_ENDPOINT,
    async () => organizationAffiliationService.list(),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res) => res.entry.map((e) => e.resource),
    }
  );

  // //locations
  const locationsService = new FHIRServiceClass<OrganizationAffiliation>(
    fhirBaseURL,
    LOCATION_ENDPOINT
  );
  const locations = useQuery(LOCATION_ENDPOINT, async () => locationsService.list(), {
    onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
    select: (res) => res.entry.map((e) => e.resource),
  });

  const locationHierarchies = useQueries(
    locations?.data
      ? locations?.data
          ?.filter((loc) => loc.identifier?.find((loc) => loc.use === 'official'))
          .map((location) => {
            return {
              queryKey: [LOCATIONHIERARCHY_ENDPOINT, location.id],
              retry: false,
              queryFn: () =>
                new FHIRServiceClass<LocationHirerchy>(
                  fhirBaseURL,
                  LOCATIONHIERARCHY_ENDPOINT
                ).list({
                  identifier: location.identifier?.find((item) => item.use === 'official')?.value,
                }),
              onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
              // Todo : useQueries doesn't support select or types yet https://github.com/tannerlinsley/react-query/pull/1527
              // select: (res) => generateJurisdictionTree(res as RawOpenSRPHierarchy)?.model,
            };
          })
      : []
  ) as UseQueryResult<LocationHirerchyWrappar>[];

  const handleCancel = () => {
    setVisible(false);
  };

  const parseNode = (item: TreeNode): any => {
    const id = item?.node?.identifier?.find((item: any) => item.use === 'official')?.value ?? '';
    return {
      [id]: {
        id,
        label: item.label,
        node: { ...item.node },
        parent: item?.parent,
        children: item?.children
          ?.map((child) => getTrees(child))
          .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
      },
    };
  };

  const getTrees = (node: TreeNodeWrapper) => {
    if (Array.isArray(node.treeNode)) {
      return node.treeNode
        .map((item) => parseNode(item))
        .reduce((acc, curr) => ({ locationsHierarchy: { map: { ...acc, ...curr } } }), {});
    } else return parseNode(node.treeNode);
  };

  useDeepCompareEffect(() => {
    if (locationHierarchies?.every((item) => item.isSuccess)) {
      console.log('locationHierarchies', locationHierarchies);
      const allParentsAndChildren = locationHierarchies.map((item) =>
        item.data?.entry
          ?.map((e) => getTrees(e.resource.LocationHierarchyTree.locationsHierarchy.listOfNodes))
          .reduce((acc, curr) => ({ ...acc, ...curr }), {})
      );

      const allLocationHierarchyData = allParentsAndChildren.map(
        (hierarchy) => generateJurisdictionTree(hierarchy as RawOpenSRPHierarchy)?.model
      );

      console.log('allLocationHierarchyData', allLocationHierarchyData);

      setLocationHierarchiesData(allLocationHierarchyData);
    }
  }, [locationHierarchies]);

  if (
    locations.isError ||
    organizations.isError ||
    locationHierarchies.some((item) => item.isError)
  )
    return <BrokenPage />;

  if (
    !locations.isSuccess ||
    !organizations.isSuccess ||
    locationHierarchies?.every((item) => !item.isSuccess) ||
    !locationHierarchiesData?.length
  )
    return <TeamAffiliationLoading />;

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

  function filterFunction(input: string, option: any): boolean {
    let expr1 = false,
      expr2 = false;
    if (option.children) expr1 = option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    if (option.label) expr2 = option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    return expr1 || expr2;
  }

  return (
    <div className="content-section">
      <Helmet>
        <title>{lang.TEAM_AFFILIATION_PAGE_TITLE}</title>
      </Helmet>
      <PageHeader title={lang.TEAM_AFFILIATION_PAGE_TITLE} className="page-header" />
      <Modal
        destroyOnClose={true}
        title={`Assign/Unassign Organizations | ${assignedLocAndOrgs?.locationName}`}
        visible={visible}
        onCancel={handleCancel}
        okText={lang.SAVE}
        cancelText={lang.CANCEL}
        footer={[
          <Button type="primary" form="teamAffiliation" key="submit" htmlType="submit">
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
            name="teamAffiliation"
            onFinish={(values: { assignOrgs: string[] }) => {
              const { assignOrgs } = values;
              const payload = getPayload(
                assignOrgs,
                defaultPlanId,
                assignedLocAndOrgs?.jurisdictionId as string,
                assignedLocAndOrgs?.assignedOrgs,
                existingAffiliations
              );
              const serve = new FHIRServiceClass(
                fhirBaseURL,
                POST_ORGANIZATIONAFFILIATION_ENDPOINT
              );
              serve
                .create(payload)
                .then(() => {
                  sendSuccessNotification(lang.SUCCESSFULLY_ASSIGNED_ORGS);
                  setVisible(false);
                  setLoading(true);
                })
                .catch((err: Error) => {
                  sendErrorNotification(err.name, err.message);
                });
            }}
            initialValues={{ assignOrgs: assignedLocAndOrgs?.assignedOrgs }}
          >
            <Form.Item label={lang.TEAMS} name="assignOrgs">
              <Select
                mode="multiple"
                allowClear
                showSearch
                placeholder={lang.ENTER_ORG_NAME}
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
            data={locationHierarchiesData}
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
            id="TeamAffiliationList"
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

export { TeamAffiliationView };
