import React from 'react';
import { CareTeamForm } from '@opensrp/fhir-care-team';
import type { CareTeamFormFields } from '@opensrp/fhir-care-team';
import type { OrganizationFormFields } from '@opensrp/fhir-team-management';
import { readDrafts } from '../Drafts/useDraftStore';
import { StepKey } from '../../types';

interface CareTeamStepAdapterProps {
  onSubmit: (values: CareTeamFormFields) => void;
  initialValues?: CareTeamFormFields;
  fhirBaseURL: string;
}

export const CareTeamStepAdapter: React.FC<CareTeamStepAdapterProps> = (props) => {
  const draftOrganizationOptions = readDrafts<OrganizationFormFields & { draftId: string }>(
    StepKey.ORGANIZATION
  ).map((o) => ({
    label: `${o.name || 'Unnamed organization'} (draft)`,
    value: `draft:${o.draftId}`,
  }));

  return (
    <CareTeamForm
      fhirBaseURL={props.fhirBaseURL}
      initialValues={props.initialValues ?? ({} as CareTeamFormFields)}
      disabled={[]}
      onDraftSubmit={props.onSubmit}
      draftOrganizationOptions={draftOrganizationOptions}
    />
  );
};