/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React from 'react';
import { ColumnsType, ColumnType } from 'antd/lib/table/interface';
import { TableColumnsNamespace } from '../../constants';
import { SelectOption } from '../AssignmentModal';
import { Assignment, fetchAssignments } from '@opensrp/team-assignment';
import { Dictionary, keyBy } from 'lodash';
import { Organization } from '@opensrp/team-management';
import { Jurisdiction } from '../../ducks/jurisdictions';
import { OpenSRPService } from '../../helpers/dataLoaders';
import { ActionColumn } from '../TableActionColumn';
import { PlanDefinition } from '@opensrp/plan-form-core/dist/types';
import { fetchPlanDefinitions } from '../../ducks/planDefinitions';
import { Column } from '@opensrp/react-utils';

/** describes antd's table data accessors */
export interface TableData {
  jurisdictions: string;
  organizations: string;
}

/** create a map such that we can group common assignments for jurisdictions and teams i.e
 * [{org: orgA, area: area1}, {org: orgA, area: area2}] => {org: [orgA], area: [area1, area2]}
 *
 * @param {Assignment[]} assignments - assignments response from api per plan
 * @returns {object} -
 */
export const compressAssignments = (assignments: Assignment[]) => {
  const mappingByOrg: Dictionary<string[]> = {};

  assignments.forEach((assignment) => {
    const jurisdictionId = assignment.jurisdiction;
    const orgId = assignment.organization;

    // start with mapping out districts per teams ie. get all districts with common teams
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!mappingByOrg[orgId]) {
      mappingByOrg[orgId] = [];
    }
    mappingByOrg[orgId].push(jurisdictionId);
  });

  const fullyGrouped: Dictionary<string[]> = {};
  Object.entries(mappingByOrg).forEach(([key, value]) => {
    const combinedJursIds = value.toString();
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!fullyGrouped[combinedJursIds]) {
      fullyGrouped[combinedJursIds] = [];
    }

    fullyGrouped[combinedJursIds].push(key);
  });
  return fullyGrouped;
};

/** describes what we should eventually have after compressing the assignments and merging the ids
 * with names, this prepares the data such that it can be used in a select field
 */
export interface MappedOptions {
  organizations: SelectOption[];
  jurisdictions: SelectOption[];
}

/**
 * util called on compressAssignments response, adds names to the ids
 *
 * @param fullyGrouped - compressed assignments object
 * @param organizations - a list of all organizations
 * @param jurisdictions - all jurisdictions that can be assigned
 * @param assignments - all the assignments
 * @param planJurisdictions - jurisdictions assigned to plan
 * @returns {object} -
 */
export const mergeIdsWithNames = (
  fullyGrouped: Dictionary<string[]>,
  organizations: Organization[],
  jurisdictions: Jurisdiction[],
  assignments: Assignment[] = [],
  planJurisdictions: string[] = []
) => {
  const merged: MappedOptions[] = [];
  const orgByIds = keyBy(organizations, 'identifier');
  const jursByIds = keyBy(jurisdictions, 'id');
  const assignmentsByJur = keyBy(assignments, 'jurisdiction');
  // const get plan jurisdictions that do not have an assignment, add those to datasource
  const jursWithoutAss = planJurisdictions.filter(
    (jurisdiction) => !assignmentsByJur[jurisdiction]
  );

  let grouped = fullyGrouped;
  if (jursWithoutAss.length > 0) {
    grouped = {
      ...fullyGrouped,
      [jursWithoutAss.toString()]: [] as string[],
    };
  }

  Object.entries(grouped).forEach(([key, value]) => {
    // key has jurisdictions ids, value has organization ids
    const keys = key.split(',');
    const tempMap: MappedOptions = {
      organizations: value.map((value) => {
        return {
          label: orgByIds[value]?.name ?? value,
          value: orgByIds[value]?.identifier ?? value,
          key: orgByIds[value]?.identifier ?? value,
        };
      }),
      jurisdictions: keys.map((value) => {
        return {
          label: jursByIds[value]?.properties?.name ?? value,
          value: jursByIds[value]?.id ?? value,
          key: jursByIds[value]?.id ?? value,
        };
      }),
    };
    merged.push(tempMap);
  });
  return merged;
};

/** factory: creates data to be fed into table
 *
 * @param {Organization[]} organizations - a list of all organizations
 * @param {Jurisdiction[]} jurisdictions - all jurisdictions that can be assigned
 * @param {Assignment[]} assignments - assignments response from api per plan
 * @param {string[]} planJurisdictions - jurisdictions assigned to the plan
 * @returns {object} -
 */
export const getDataSource = (
  organizations: Organization[],
  jurisdictions: Jurisdiction[],
  assignments: Assignment[],
  planJurisdictions: string[]
) => {
  // const get plan jurisdictions that do not have an assignment, add those to datasource
  const compressedAssignments = compressAssignments(assignments);
  const orgsAndJursOptions = mergeIdsWithNames(
    compressedAssignments,
    organizations,
    jurisdictions,
    assignments,
    planJurisdictions
  );

  const datasource = orgsAndJursOptions.map((mapping, index) => ({
    key: `${TableColumnsNamespace}-${index}`,
    organizations: mapping.organizations.map((option) => option.label).join(', ') || ' - ',
    jurisdictions: mapping.jurisdictions.map((option) => option.label).join(', ') || ' - ',
  }));
  if (datasource.length < 1) {
    datasource.push({
      key: TableColumnsNamespace,
      organizations: '',
      jurisdictions: '',
    });
  }
  return datasource;
};

/** non dynamic columns for assignment table component */
export const staticColumns: Column<TableData>[] = [
  {
    title: 'Assigned areas',
    dataIndex: 'jurisdictions',
    key: `${TableColumnsNamespace}-assigned-areas` as keyof TableData,
    width: '40%',
  },
  {
    title: 'Assigned teams',
    dataIndex: 'organizations',
    key: `${TableColumnsNamespace}-assigned-teams` as keyof TableData,
    width: '40%',
  },
];

/**
 * construct the full table columns for the plan assignment table
 *
 * @param  assignments - assignments response from api per plan
 * @param  organizations - a list of all organizations
 * @param  jurisdictions - all jurisdictions that can be assigned
 * @param  serviceClass -  opensrp service class
 * @param  planCreator - action creator to add plans
 * @param  assignmentsCreator - action creator to add assignments
 * @param  plan - the plan
 * @param  baseURL - the base url
 * @param  disableAssignments - whether to enable assignments
 */
export const getPlanAssignmentColumns = (
  assignments: Assignment[],
  organizations: Organization[],
  jurisdictions: Jurisdiction[],
  serviceClass: typeof OpenSRPService,
  planCreator: typeof fetchPlanDefinitions,
  assignmentsCreator: typeof fetchAssignments,
  plan: PlanDefinition,
  baseURL: string,
  disableAssignments: boolean
): Column<TableData>[] => {
  const ActionsColumnCustomRender: Column<TableData>['render'] = (_, __, index: number) => {
    const fullyGrouped = compressAssignments(assignments);
    const planJurisdictions = plan.jurisdiction.map((jur) => jur.code);
    const mergedOptions = mergeIdsWithNames(
      fullyGrouped,
      organizations,
      jurisdictions,
      assignments,
      planJurisdictions
    );
    const assignedOrgsOptions = mergedOptions[index]?.organizations ?? [];
    const assignedJursOptions = mergedOptions[index]?.jurisdictions ?? [];

    const props = {
      organizations,
      assignments,
      jurisdictions,
      assignedJursOptions,
      assignedOrgsOptions,
      serviceClass,
      planCreator,
      assignmentsCreator,
      plan,
      baseURL,
      disableAssignments,
    };
    return <ActionColumn {...props}></ActionColumn>;
  };

  const dynamicColumn: Column<TableData>[] = [
    {
      title: 'Actions',
      key: `${TableColumnsNamespace}-actions` as keyof TableData,
      render: ActionsColumnCustomRender,
      width: '20%',
    },
  ];
  const columns = [...staticColumns, ...dynamicColumn];
  return columns;
};
