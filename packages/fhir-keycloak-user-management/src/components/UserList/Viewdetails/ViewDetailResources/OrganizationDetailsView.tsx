import React from 'react';
import { useTranslation } from '../../../../mls';
import { TableLayout, CodeableConcept as CodeableConceptJsx } from '@opensrp/react-utils';
import { PractitionerDetail } from '../types';
import { CodeableConcept } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/codeableConcept';
import { Alert } from 'antd';

export interface OrganizationDetailsViewProp {
  loading: boolean;
  practitionerDetails: PractitionerDetail['fhir'];
  error: Error | null;
}

export const OrganizationDetailsView = ({
  loading,
  practitionerDetails,
  error,
}: OrganizationDetailsViewProp) => {
  const { t } = useTranslation();

  if (error) {
    return (
      <Alert type="error">
        {t('An error occurred while trying to fetch the practitioner details.')}
      </Alert>
    );
  }

  // get organization Affiliation - use it tag the codings for the organizations.
  const organizations = practitionerDetails.teams ?? [];
  const tableData = organizations.map((resource) => {
    const { id, active, type, name } = resource;
    return {
      id,
      active,
      type: type ?? [],
      name,
    };
  });

  // identifier, status,
  const columns = [
    {
      title: t('Id'),
      dataIndex: 'id' as const,
    },
    {
      title: t('Name'),
      dataIndex: 'name' as const,
    },
    {
      title: t('Active'),
      dataIndex: 'active' as const,
      render: (isActive: string) => (isActive ? 'Active' : 'Inactive'),
    },
    {
      title: t('Type'),
      dataIndex: 'type' as const,
      render: (concepts: CodeableConcept[]) =>
        concepts.map((concept, index) => <CodeableConceptJsx key={index} concept={concept} />),
    },
  ];

  const tableProps = {
    datasource: tableData,
    columns,
    loading,
    size: 'small' as const,
  };

  return <TableLayout {...tableProps} />;
};
