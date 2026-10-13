import React from 'react';
import { Alert, Spin } from 'antd';
import { useQuery } from 'react-query';
import { OrganizationForm } from '@opensrp/fhir-team-management';
import type { OrganizationFormFields } from '@opensrp/fhir-team-management';
import { BodyLayout, getResourcesFromBundle, loadAllResources } from '@opensrp/react-utils';
import type { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { readDrafts } from '../Drafts/useDraftStore';
import { StepKey, UserFormValues } from '../../types';

const practitionerResourceType = 'Practitioner';

interface OrganizationStepAdapterProps {
  onSubmit: (values: OrganizationFormFields) => void;
  initialValues?: OrganizationFormFields;
  fhirBaseURL: string;
}

export const OrganizationStepAdapter: React.FC<OrganizationStepAdapterProps> = (props) => {
  const practitioners = useQuery(
    [practitionerResourceType],
    () => loadAllResources(props.fhirBaseURL, practitionerResourceType, { active: true }),
    {
      select: (res) => getResourcesFromBundle(res) as IPractitioner[],
      enabled: !!props.fhirBaseURL,
    }
  );

  if (!props.fhirBaseURL) {
    return <Alert type="error" message="The wizard did not receive a FHIR base URL." />;
  }

  if (practitioners.isLoading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  if (practitioners.isError) {
    return (
      <Alert
        type="error"
        message="Could not load practitioners"
        description={(practitioners.error as Error)?.message}
      />
    );
  }

  const draftPractitionerOptions = readDrafts<UserFormValues & { draftId: string }>(StepKey.USERS).map(
  (u) => ({
    label: `${[u.firstName, u.lastName].filter(Boolean).join(' ') || u.username} (draft)`,
    value: `draft:${u.draftId}`,
  })
);

  const headerProps = {
    pageHeaderProps: { title: 'Create organization', onBack: undefined },
  };

  return (
    <BodyLayout headerProps={headerProps}>
      <div className="bg-white p-5">
        <OrganizationForm
          fhirBaseUrl={props.fhirBaseURL}
          initialValues={props.initialValues ?? {}}
          disabled={[]}
          practitioners={practitioners.data ?? []}
          existingPractitionerRoles={[]}
          allPractitionerRoles={[]}
          onDraftSubmit={props.onSubmit}
          draftPractitionerOptions={draftPractitionerOptions}
        />
      </div>
    </BodyLayout>
  );
};