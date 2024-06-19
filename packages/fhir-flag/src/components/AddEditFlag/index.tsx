import React from 'react';
import { Helmet } from 'react-helmet';
import { FlagForm } from './Form';
import { useParams } from 'react-router';
import {
 FlagResourceType,
 GroupResourceType,
 ListResourceType
} from '../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import { Spin } from 'antd';
import { useQuery } from 'react-query';
import {
  FHIRServiceClass,
  BrokenPage,
  getResourcesFromBundle,
  loadAllResources,
  BodyLayout
} from '@opensrp/react-utils';
import type { IFlag} from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IFlag';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { IList } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IList';
import {
  servicePointProfileInventoryListCoding,
} from '@opensrp/fhir-helpers';
// import { getOrgFormFields } from './utils';
// import { useTranslation } from '../../mls';
// import { getConfig } from '@opensrp/pkg-config';

export interface AddEditFlagProps {
  fhirBaseURL: string;
}

export interface RouteParams {
  id?: string;
}

export const AddEditFlag = (props: AddEditFlagProps) => {
  const { fhirBaseURL: fhirBaseUrl } = props;

  const { id: flagId } = useParams<RouteParams>();
  // const { t } = useTranslation();
  // const configuredPractAssignmentStrategy = getConfig('practToOrgAssignmentStrategy');

  const flag = useQuery(
    [FlagResourceType, flagId],
    async () =>
      new FHIRServiceClass<IFlag>(fhirBaseUrl, FlagResourceType).read(
        flagId as string
      ),
    {
      enabled: !!flagId,
    }
  );

  const inventoryGroup = flag.data?.subject.reference && useQuery(
    [GroupResourceType, flag.data?.subject?.reference],
    () => new FHIRServiceClass<IGroup>(fhirBaseUrl, GroupResourceType).read(flag.data?.subject?.reference as string),
    { enabled: !!flag.data?.subject?.reference }
  );

  const product = inventoryGroup && useQuery(
    [GroupResourceType, inventoryGroup.data?.member?.[0]?.entity?.reference],
    () => new FHIRServiceClass<IGroup>(fhirBaseUrl, GroupResourceType).read(inventoryGroup.data?.member?.[0]?.entity?.reference as string),
    { enabled: !!inventoryGroup.data?.member?.[0]?.entity?.reference }
  );

 const list = flag.data?.subject.reference && useQuery(
  [ListResourceType, flag.data.subject.reference],
  () => new FHIRServiceClass<IList>(fhirBaseUrl, ListResourceType).list({
    item: flag.data.subject.reference,
    code: `${servicePointProfileInventoryListCoding.system}|${servicePointProfileInventoryListCoding.code}`
  }),
  { enabled: !!flag.data?.subject?.reference }
);


console.log('flag', flag);
console.log('inventory Group', inventoryGroup);
console.log('product', product)
console.log('list----', list);

  if (
    flag.isLoading ||
    flag.isFetching ||
    // inventoryGroup?.isLoading ||
    // inventoryGroup?.isFetching ||
    // allPractitionerRoles.isLoading ||
    // allPractitionerRoles.isFetching
  ) {
    return <Spin size="large" className="custom-spinner"></Spin>;
  }

  if (flag.error && !flag.data) {
    return <BrokenPage errorMessage={(flag.error as Error).message} />;
  }

  // const assignedPractitionerRoles = (allPractitionerRoles.data ?? []).filter(
  //   (practitionerRole) =>
  //     practitionerRole.organization?.reference ===
  //     `${organizationResourceType}/${(organization.data as IOrganization).id}`
  // );

  // const initialValues = getOrgFormFields(organization.data, assignedPractitionerRoles);

  // const pageTitle = organization.data
  //   ? t('Edit team | {{teamName}}', { teamName: organization.data.name ?? '' })
  //   : t('Create team');
  const headerProps = {
    pageHeaderProps: {
      title: 'Close Flags',
      onBack: undefined,
    },
  };

  return (
    <BodyLayout headerProps={headerProps}>
      <Helmet>
        {/* <title>{pageTitle}</title> */}
      </Helmet>
      <div className="bg-white p-5">
        {/* <OrganizationForm
          fhirBaseUrl={fhirBaseUrl}
          initialValues={initialValues}
          practitioners={practitioners.data ?? []}
          existingPractitionerRoles={assignedPractitionerRoles}
          allPractitionerRoles={allPractitionerRoles.data ?? []}
          cancelUrl={ORGANIZATION_LIST_URL}
          successUrl={ORGANIZATION_LIST_URL}
          configuredPractAssignmentStrategy={configuredPractAssignmentStrategy}
        /> */}
      </div>
    </BodyLayout>
  );
};

export default AddEditFlag;
