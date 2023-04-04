import React, { useState } from 'react';
import { Button } from 'antd';
import {
  BrokenPage,
  Column,
  getResourcesFromBundle,
  TableLayout,
  loadAllResources,
} from '@opensrp/react-utils';
import { IOrganizationAffiliation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganizationAffiliation';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { AffiliationModal } from './Form';
import { get } from 'lodash';
import { locationResourceType, TreeNode } from '@opensrp/fhir-location-management';
import { organizationAffiliationResourceType, organizationResourceType } from '../../constants';
import { reformatOrganizationByLocation } from './utils';
import { useQuery } from 'react-query';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { useTranslation } from '../../mls';

export interface TableData {
  id: string;
  key: string;
  name: string;
  description?: string;
  status?: string;
  physicalType?: string;
  partOf?: string;
  node: ILocation;
}

/**
 * Parse the hierarchy node into table data
 *
 * @param  locationNode - list of location nodes
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
      node: location.model.node,
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
  const [location, setLocation] = useState<ILocation>();
  const { t } = useTranslation();

  const {
    data: affiliationsData,
    isLoading: affiliationsLoading,
    error: affiliationsError,
    ...affiliationsQuery
  } = useQuery(
    [organizationAffiliationResourceType],
    () => loadAllResources(baseUrl, organizationAffiliationResourceType),
    {
      select: (res) => {
        return getResourcesFromBundle<IOrganizationAffiliation>(res);
      },
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
    return (
      <BrokenPage errorMessage={t('Unable to load teams or teams assignments at the moment')} />
    );
  }

  const tableDispData = parseTableData(locationNodes);
  const affiliationsByLocId = reformatOrganizationByLocation(affiliationsData ?? []);

  const columns: Column<TableData>[] = [
    {
      title: t('Name'),
      dataIndex: 'name',
    },
    {
      title: t('Assigned teams'),
      render: (_, record) => {
        const { id } = record;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const affiliations = affiliationsByLocId[`${locationResourceType}/${id}`] ?? [];
        return affiliations
          .map((affiliation) => {
            return affiliation.organization?.display;
          })
          .join(', ');
      },
    },
    {
      title: t('Actions'),
      width: '10%',
      // eslint-disable-next-line react/display-name
      render: (_, record) => (
        <Button
          type="link"
          className="action-button"
          onClick={() => {
            const { node } = record;

            setLocation(node);
            setSeeModal(true);
          }}
        >
          {t('Edit')}
        </Button>
      ),
    },
  ];

  const modalCancel = () => setSeeModal(false);

  return (
    <>
      <AffiliationModal
        baseUrl={baseUrl}
        location={location as ILocation}
        visible={seeModal}
        allOrgs={orgsData ?? []}
        affiliationsByLoc={affiliationsByLocId}
        handleCancel={modalCancel}
        allAffiliations={affiliationsData ?? []}
      />
      <TableLayout
        loading={orgsLoading || affiliationsLoading || affiliationsQuery.isRefetching}
        id="org-affiliation"
        persistState={true}
        datasource={tableDispData}
        columns={columns}
      />
    </>
  );
};

export default AffiliationTable;
