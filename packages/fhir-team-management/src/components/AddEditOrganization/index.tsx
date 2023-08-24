import React from 'react';
import { Helmet } from 'react-helmet';
import { OrganizationForm } from './Form';
import { useParams } from 'react-router';
import {
  practitionerResourceType,
  organizationResourceType,
  practitionerRoleResourceType,
  ORGANIZATION_LIST_URL,
} from '../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import { Spin } from 'antd';
import { PageHeader } from '@opensrp/react-utils';
import { useQuery } from 'react-query';
import {
  FHIRServiceClass,
  BrokenPage,
  getResourcesFromBundle,
  loadAllResources,
} from '@opensrp/react-utils';
import type { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { getOrgFormFields } from './utils';
import { useTranslation } from '../../mls';
import { getConfig } from '@opensrp/pkg-config';

export interface AddEditOrganizationProps {
  fhirBaseURL: string;
}

export interface RouteParams {
  id?: string;
}

export const AddEditOrganization = (props: AddEditOrganizationProps) => {
  const { fhirBaseURL: fhirBaseUrl } = props;

  const { id: orgId } = useParams();

  console.log({ orgId })
  const { t } = useTranslation();
  const configuredPractAssignmentStrategy = getConfig('practToOrgAssignmentStrategy');

  const organization = useQuery(
    [organizationResourceType, orgId],
    async () =>
      new FHIRServiceClass<IOrganization>(fhirBaseUrl, organizationResourceType).read(
        orgId as string
      ),
    {
      enabled: !!orgId,
    }
  );

  const practitioners = useQuery(
    [practitionerResourceType],
    () => loadAllResources(fhirBaseUrl, practitionerResourceType),
    {
      select: (res) => getResourcesFromBundle(res) as IPractitionerRole[],
      onError: () => sendErrorNotification(t('There was a problem fetching practitioners')),
    }
  );

  // practitioners already assigned to this organization
  const allPractitionerRoles = useQuery(
    [practitionerResourceType, organizationResourceType, orgId],
    () => loadAllResources(fhirBaseUrl, practitionerRoleResourceType),
    {
      onError: () =>
        sendErrorNotification(t('There was a problem fetching assigned practitioners')),
      select: (res) => {
        return getResourcesFromBundle(res) as IPractitionerRole[];
      },
      enabled: !!orgId,
    }
  );

  if (
    (!organization.isIdle && organization.isLoading) ||
    (!practitioners.isIdle && practitioners.isLoading) ||
    (!allPractitionerRoles.isIdle && allPractitionerRoles.isLoading)
  ) {
    return <Spin size="large" className="custom-spinner"></Spin>;
  }

  if (organization.error && !organization.data) {
    return <BrokenPage errorMessage={(organization.error as Error).message} />;
  }

  const assignedPractitionerRoles = (allPractitionerRoles.data ?? []).filter(
    (practitionerRole) =>
      practitionerRole.organization?.reference ===
      `${organizationResourceType}/${(organization.data as IOrganization).id}`
  );

  const initialValues = getOrgFormFields(organization.data, assignedPractitionerRoles);

  const pageTitle = organization.data
    ? t('Edit team | {{teamName}}', { teamName: organization.data.name ?? '' })
    : t('Create team');
  console.log({ pageTitle })

  return (
    <section className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} />
      <div className="bg-white p-5">
        <OrganizationForm
          fhirBaseUrl={fhirBaseUrl}
          initialValues={initialValues}
          practitioners={practitioners.data ?? []}
          existingPractitionerRoles={assignedPractitionerRoles}
          allPractitionerRoles={allPractitionerRoles.data ?? []}
          cancelUrl={ORGANIZATION_LIST_URL}
          successUrl={ORGANIZATION_LIST_URL}
          configuredPractAssignmentStrategy={configuredPractAssignmentStrategy}
        />
      </div>
    </section>
  );
};

export default AddEditOrganization;
