import React from 'react';
import { EditAssignmentsModal, SelectOption } from '../AssignmentModal';
import { Divider } from 'antd';
import { Assignment, fetchAssignments } from '@opensrp/team-management';
import { Jurisdiction } from '../../ducks/jurisdictions';
import { Organization } from '@opensrp/team-management';
import {
  getAllJursPayload,
  updateAssignments,
  putJurisdictionsToPlan,
  retireAssignmentsByJur,
} from '../../helpers/dataLoaders';
import { OpenSRPService } from '../../helpers/dataLoaders';
import { fetchPlanDefinitions } from '../../ducks/planDefinitions';
import { PlanDefinition } from '@opensrp/plan-form-core';
import { useTranslation } from '../../mls';

interface ActionColumnProps {
  assignments: Assignment[];
  organizations: Organization[];
  jurisdictions: Jurisdiction[];
  assignedOrgsOptions: SelectOption[];
  assignedJursOptions: SelectOption[];
  serviceClass: typeof OpenSRPService;
  planCreator: typeof fetchPlanDefinitions;
  assignmentsCreator: typeof fetchAssignments;
  plan: PlanDefinition;
  baseURL: string;
  disableAssignments: boolean;
}

/**
 * rendered for each assignment table row in the actions columns
 *
 * @param props -  the props
 * @returns - the component
 */
export const ActionColumn = (props: ActionColumnProps) => {
  const {
    organizations,
    assignments,
    jurisdictions,
    assignedOrgsOptions,
    assignedJursOptions,
    plan,
    planCreator,
    serviceClass,
    assignmentsCreator,
    baseURL,
    disableAssignments,
  } = props;
  const { t } = useTranslation();

  const allOrganizationOptions = organizations.map((org) => ({
    key: org.identifier,
    value: org.identifier,
    label: org.name,
  }));

  const allJurisdictionOptions = jurisdictions.map((jurisdiction) => {
    return {
      key: jurisdiction.id,
      value: jurisdiction.id,
      label: jurisdiction.properties.name,
    };
  });

  /**
   * called when user saves assignment in teams assignment modal
   * makes new assignments, retires removed assignments for the jurisdiction range in this row
   *
   * @param {SelectOption[]} selected - the selected organization options
   * @returns {Promise<void | Error>} - promise
   */
  const teamsSaveHandler = (selected: SelectOption | SelectOption[]) => {
    const selectedOrgIds = Array.isArray(selected)
      ? selected.map((option) => option.value)
      : [selected.value];
    const initialOrgIds = assignedOrgsOptions.map((option) => option.value);
    const jurisdictions = assignedJursOptions.map((option) => option.value);
    const payload = getAllJursPayload(
      selectedOrgIds,
      plan,
      jurisdictions,
      initialOrgIds,
      assignments
    );
    return updateAssignments(baseURL, payload, assignmentsCreator, serviceClass);
  };

  /**
   * called if user clicks save on areas assignment modal
   *
   * @param {SelectOption[]} selected - the selected jurisdiction options
   * @returns {Promise<void | Error>} - promise
   */
  const areasSaveHandler = async (selected: SelectOption | SelectOption[]) => {
    // caveat - for MVP where we have one row; we can safely assume that removing an area is akin
    // to un-assigning it from the plan. This assumption will however fail once we have several rows
    const selectedJurs = Array.isArray(selected)
      ? selected.map((option) => option.value)
      : [selected.value];
    const plansPromise = putJurisdictionsToPlan(
      baseURL,
      plan,
      selectedJurs,
      false, // will work for MVP as long as we have just the one row; refer to caveat above.
      serviceClass,
      planCreator
    );
    // need to recompute the assignments and post those.
    // retire assignments associated with removed jurisdiction
    const initialJurs = assignedJursOptions.map((jurs) => jurs.value);
    const selectedOrgs = assignedOrgsOptions.map((option) => option.value);
    const retiredPlansPayload = retireAssignmentsByJur(
      selectedJurs,
      initialJurs,
      assignments,
      selectedOrgs,
      plan.identifier
    );
    // if we have assignments done for this row, and we add a jurisdiction,
    // means existing assignments should also apply for new jurisdiction
    const assignedPlansPayload = getAllJursPayload(
      selectedOrgs,
      plan,
      selectedJurs,
      selectedOrgs,
      assignments
    );
    const assignmentPayload = [...retiredPlansPayload, ...assignedPlansPayload];
    const assignmentPromise = updateAssignments(
      baseURL,
      assignmentPayload,
      assignmentsCreator,
      serviceClass,
      true
    );
    return Promise.all([plansPromise, assignmentPromise]).catch((e) => e);
  };

  const teamsIsDisabled = assignedJursOptions.length === 0 || disableAssignments;
  const teamsModalProps = {
    invokeText: t('Edit teams'),
    modalTitle: t('Edit teams'),
    placeHolder: t('Select teams'),
    options: allOrganizationOptions,
    existingOptions: assignedOrgsOptions,
    saveHandler: teamsSaveHandler,
    disabled: teamsIsDisabled,
  };

  const areasModalProps = {
    invokeText: t('Edit regions'),
    modalTitle: t('Edit regions'),
    placeHolder: t('Select regions'),
    options: allJurisdictionOptions,
    existingOptions: assignedJursOptions,
    saveHandler: areasSaveHandler,
    disabled: disableAssignments,
  };

  return (
    <>
      {/* areas assignment modal */}
      <EditAssignmentsModal {...areasModalProps} />
      <Divider type="vertical" />
      {/* teams assignment modal */}
      <EditAssignmentsModal {...teamsModalProps} />
    </>
  );
};
