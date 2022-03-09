import React, { useState } from 'react';
import { Button, Divider, Dropdown, Menu } from 'antd';
import lang from '../../lang';
import { BrokenPage, Column, getResourcesFromBundle, TableLayout } from '@opensrp/react-utils';
import { IOrganizationAffiliation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganizationAffiliation';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { AffiliationForm } from './Form';
import { get } from 'lodash';
import { TreeNode } from '@opensrp/fhir-location-management';
import { organizationAffiliationResourceType, organizationResourceType } from '../../constants';
import { loadAllResources } from '../../utils';
import { sendErrorNotification } from '@opensrp/notifications';
import { reformatOrganizationByLocation } from './utils';
import { useQuery } from 'react-query';

export interface TableData {
  id: string;
  key: string;
  name: string;
  description?: string;
  status?: string;
  physicalType?: string;
  partOf?: string;
}

/**
 * Parse the hierarchy node into table data
 *
 * @param  hierarchy - hierarchy node to be parsed
 * @param locationNode
 * @returns array of table data
 */
export function parseTableData(locationNode: TreeNode[]) {
  const data: TableData[] = [];
  locationNode.forEach((location) => {
    const { model } = location;
    const { id, name, status, partOf, description } = model.node;
    data.push({
      id,
      key: model.nodeId,
      name,
      partOf: partOf?.display ?? '-',
      description,
      status,
      physicalType: get(model.node, 'physicalType.coding.0.display'),
    });
  });
  return data;
}

export interface Props {
  baseUrl: string;
  locationNodes: TreeNode[];
}

const AffiliationTable: React.FC<Props> = (props: Props) => {
  const { baseUrl, locationNodes } = props;
  const [seeModal, setSeeModal] = useState<boolean>(false);
  const [locationDets, setLocationDets] = useState<{ id: string; name: string }>();

  const {
    data: affiliationsData,
    isLoading: affiliationsLoading,
    error: affiliationsError,
  } = useQuery(
    [organizationAffiliationResourceType],
    () => loadAllResources(baseUrl, organizationAffiliationResourceType),
    {
      select: (res) => getResourcesFromBundle<IOrganizationAffiliation>(res),
    }
  );

  const {
    data: orgsData,
    isLoading: orgsLoading,
    error: orgsError,
  } = useQuery(
    [organizationResourceType],
    () => loadAllResources(baseUrl, organizationResourceType),
    {
      select: (res) => getResourcesFromBundle<IOrganization>(res),
    }
  );

  if ((affiliationsError && !affiliationsData) || (orgsError && !orgsData)) {
    return <BrokenPage errorMessage="Unable to load teams or teams assignments at the moment" />;
  }

  const tableDispData = parseTableData(locationNodes);
  const affiliationsByLocId = reformatOrganizationByLocation(affiliationsData ?? []);

  const columns: Column<TableData>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Assigned teams',
      render: (_, record) => {
        const { id } = record;
        const affiliations = affiliationsByLocId[id];
        return affiliations.map((affiliation) => {
          return <span key={affiliation.orgId}>{affiliation.orgName}</span>;
        });
      },
    },
    {
      title: 'Actions',
      width: '10%',
      // eslint-disable-next-line react/display-name
      render: (_, record) => (
        <Button
          type="link"
          className="action-button"
          onClick={() => {
            const { id, name } = record;
            setLocationDets({ id, name });
            setSeeModal(true);
          }}
        >
          {lang.EDIT}
        </Button>
      ),
    },
  ];

  const modalCancel = () => setSeeModal(false);

  return (
    <>
      <AffiliationForm
        baseUrl={baseUrl}
        locationName={locationDets?.name as string}
        visible={seeModal}
        allOrgs={orgsData ?? []}
        locationId={locationDets?.id as string}
        affiliationsByLoc={affiliationsByLocId}
        handleCancel={modalCancel}
      />
      <TableLayout
        loading={orgsLoading || affiliationsLoading}
        id="org-affiliation"
        persistState={true}
        datasource={tableDispData}
        columns={columns}
      />
    </>
  );
};

export default AffiliationTable;
