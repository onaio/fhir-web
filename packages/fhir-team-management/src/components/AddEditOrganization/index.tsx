import React from 'react';
import { Helmet } from 'react-helmet';
import { OrganizationForm } from './Form';
import { useParams } from 'react-router';
import {
  practitionerResourceType,
  organizationResourceType,
  practitionerRoleResourceType,
} from '../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import { Spin } from 'antd';
import lang from '../../lang';
import { useQuery } from 'react-query';
import { FHIRServiceClass, BrokenPage, getResourcesFromBundle } from '@opensrp/react-utils';
import { getOrgFormFields, loadAllResources } from '../../utils';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import type { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';

export interface AddEditOrganizationProps {
  fhirBaseURL: string;
}

export interface RouteParams {
  id?: string;
}

export const AddEditOrganization = (props: AddEditOrganizationProps) => {
  const { fhirBaseURL: fhirBaseUrl } = props;

  const { id: orgId } = useParams<RouteParams>();

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
    () => new FHIRServiceClass<IBundle>(fhirBaseUrl, practitionerResourceType).list(),
    {
      select: (res) => getResourcesFromBundle(res) as IPractitionerRole[],
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
    }
  );

  // practitioners already assigned to this organization
  const assignedPractitioners = useQuery(
    [practitionerResourceType, organizationResourceType, orgId],
    async () =>
      loadAllResources(fhirBaseUrl, practitionerRoleResourceType, {
        organization: orgId as string,
      }),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res) => {
        return getResourcesFromBundle(res) as IPractitionerRole[];
      },
      enabled: !!orgId,
    }
  );

  if (
    (!organization.isIdle && organization.isLoading) ||
    (!practitioners.isIdle && practitioners.isLoading)
  ) {
    return <Spin size="large" className="custom-spinner"></Spin>;
  }

  if (organization.error && !organization.data) {
    return <BrokenPage errorMessage={(organization.error as Error).message} />;
  }

  const initialValues = getOrgFormFields(organization.data, assignedPractitioners.data);

  const pageTitle = organization.data
    ? `Edit team | ${organization.data?.name ?? ''}`
    : 'Create team';

  return (
    <section className="layout-content">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <h5 className="mb-3 header-title">{pageTitle}</h5>
      <div className="bg-white p-5">
        <OrganizationForm
          fhirBaseUrl={fhirBaseUrl}
          initialValues={initialValues}
          practitioners={practitioners.data ?? []}
          existingPractitionerRoles={assignedPractitioners.data ?? []}
        />
      </div>
    </section>
  );
};

export default AddEditOrganization;
