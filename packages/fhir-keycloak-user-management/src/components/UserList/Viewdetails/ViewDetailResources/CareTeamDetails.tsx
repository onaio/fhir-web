import React from 'react';
import { useTranslation } from '../../../../mls';
import { TableLayout, CodeableConcept as CodeableConceptJsx } from '@opensrp/react-utils';
import { PractitionerDetail } from '../types';
import { CodeableConcept } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/codeableConcept';
import { Alert } from 'antd';

export interface CareTeamDetailsViewProps {
  loading: boolean;
  practitionerDetails: PractitionerDetail['fhir'];
  error: Error | null;
}

export const CareTeamDetailsView = ({
  loading,
  practitionerDetails,
  error,
}: CareTeamDetailsViewProps) => {
  const { t } = useTranslation();

  if (error) {
    return (
      <Alert type="error">
        {'An error occurred while trying to fetch the practitioner details.'}
      </Alert>
    );
  }

  const careTeams = practitionerDetails.careteams ?? [];
  const tableData = careTeams.map((resource) => {
    const { id, status, name, category } = resource;
    return {
      id,
      status,
      name,
      category: category ?? [],
    };
  });

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
      title: t('Status'),
      dataIndex: 'status' as const,
    },
    {
      title: t('Category'),
      dataIndex: 'category' as const,
      render: (concepts: CodeableConcept[]) => {
        return concepts.map((concept, index) => (
          <CodeableConceptJsx key={index} concept={concept} />
        ));
      },
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
