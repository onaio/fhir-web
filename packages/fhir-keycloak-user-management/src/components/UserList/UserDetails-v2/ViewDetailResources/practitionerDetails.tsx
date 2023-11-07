import React from 'react';
import { useTranslation } from '../../../../mls';
import {
  TableLayout,
  parseFhirHumanName,
  Coding as CodingJsx,
  CodeableConcept as CodeableConceptJsx,
} from '@opensrp/react-utils';
import { practitionerResourceType } from '../../../../constants';
import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { CodeableConcept } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/codeableConcept';
import { PractitionerDetail } from '../types';
import { Alert } from 'antd';
import {
  PRACTITIONER_USER_TYPE_CODE,
  SUPERVISOR_USER_TYPE_CODE,
  UserListTypes,
  getUserType,
  getUserTypeCode,
} from '@opensrp/user-management';

export interface PractitionerDetailViewsProps {
  loading: boolean;
  practitionerDetails: PractitionerDetail['fhir'];
  error?: Error;
}

export const PractitionerDetailsView = (props: PractitionerDetailViewsProps) => {
  const { loading, practitionerDetails, error } = props;
  const { t } = useTranslation();

  if (error) {
    return (
      <Alert type="error">
        {'An error occurred while trying to fetch the practitioner details.'}
      </Alert>
    );
  }

  const practitioners = practitionerDetails.practitioner ?? [];
  const practitionerRoles = practitionerDetails.practitionerRoles ?? [];
  const tableData = processPractitionerDetails(practitioners, practitionerRoles);

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
      render: (value: boolean) => (value === true ? 'Active' : 'Inactive'),
    },
    {
      title: t('User Type'),
      dataIndex: 'userType' as const,
    },
    {
      title: t('Practitioner Role Coding'),
      dataIndex: 'concepts' as const,
      render: (concepts: CodeableConcept[]) => {
        console.log({ concepts });
        return concepts.map((concept) => <CodeableConceptJsx concept={concept} />);
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

/**
 * @param practitioners
 * @param practitionerRoles
 */
function processPractitionerDetails(
  practitioners: IPractitioner[],
  practitionerRoles: IPractitionerRole[]
) {
  interface TableData {
    id?: string;
    name?: string;
    active?: boolean;
    concepts: CodeableConcept[];
    userType?: string;
  }
  const tableData: Record<string, TableData> = {};
  const tempPractitionerRoleCodings: Record<
    string,
    { concepts: CodeableConcept[]; userType?: string }
  > = {};

  for (const res of practitioners) {
    const typedRes = res;
    const resName = typedRes.name?.[0]; // TODO - use get official name
    // add to store
    tableData[`${practitionerResourceType}/${typedRes.id}`] = {
      id: res.id,
      name: parseFhirHumanName(resName),
      active: res.active,
      concepts: [],
      userType: undefined,
    };
  }

  for (const res of practitionerRoles) {
    // practitionerRole resource
    const typedRes = res as IPractitionerRole;
    const practitionerId = typedRes.practitioner?.reference as string;

    // extract the coding
    const concepts = typedRes.code ?? [];
    let userType: string | undefined = undefined;
    const userTypeCode = getUserTypeCode(res);
    if (userTypeCode) {
      userType = getUserType(
        userTypeCode as typeof PRACTITIONER_USER_TYPE_CODE | typeof SUPERVISOR_USER_TYPE_CODE
      );
    }

    // have we encountered a corresponding practitioner for this role
    if (tableData[practitionerId] === undefined) {
      tableData[practitionerId].concepts = [...tableData[practitionerId].concepts, ...concepts];
      tableData[practitionerId].userType = userType;
    } else if (tempPractitionerRoleCodings[practitionerId] === undefined) {
      tempPractitionerRoleCodings[practitionerId] = { concepts: [] };
      tempPractitionerRoleCodings[practitionerId].concepts = [];
      tempPractitionerRoleCodings[practitionerId].userType = userType;
    }
    tempPractitionerRoleCodings[practitionerId].concepts = [
      ...tempPractitionerRoleCodings[practitionerId].concepts,
      ...concepts,
    ];
  }

  for (const [key, value] of Object.entries(tempPractitionerRoleCodings)) {
    // invariant: we should have encountered all possible practitioners whole practitioner Roles records are in tempPractitionerRoleCodings
    tableData[key].concepts = [...tableData[key].concepts, ...value.concepts];
    tableData[key].userType = value.userType;
  }

  console.log({ tableData, practitionerRoles });
  return Object.values(tableData);
}
