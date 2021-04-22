import React from 'react';
import { Helmet } from 'react-helmet';
import {
  FhirObject,
  FHIRResponse,
  Organization,
  Practitioner,
  PractitionerRole,
} from '../../types';
import Form from './Form';
import { useParams } from 'react-router';
import { PRACTITIONERROLE_GET, PRACTITIONER_GET, TEAMS_GET } from '../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import { Spin } from 'antd';
import lang from '../../lang';
import FHIR from 'fhirclient';
import { useQuery } from 'react-query';
import { ProcessFHIRResponse, ProcessFHIRObject } from '../../utils';

export interface Props {
  fhirbaseURL: string;
}

/** default component props */
export const defaultProps = {
  fhirbaseURL: '',
};

export const TeamsAddEdit: React.FC<Props> = (props: Props) => {
  const { fhirbaseURL } = props;

  const serve = FHIR.client(fhirbaseURL);
  const params: { id?: string } = useParams();
  let initialValue = null;

  const allPractitioner = useQuery(PRACTITIONER_GET, () => serve.request(PRACTITIONER_GET), {
    onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
    select: (res: FHIRResponse<Practitioner>) =>
      ProcessFHIRResponse(res).filter((e) => e.identifier.official),
  });

  const team = useQuery([TEAMS_GET, params.id], () => serve.request(TEAMS_GET + params.id), {
    onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
    select: (res: FhirObject<Organization>) => ProcessFHIRObject(res),
    enabled: params.id !== undefined,
  });

  const AllRoles = useQuery([PRACTITIONERROLE_GET], () => serve.request(PRACTITIONERROLE_GET), {
    onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
    select: (res: FHIRResponse<PractitionerRole>) =>
      ProcessFHIRResponse(res).filter((e) => e.identifier.official),
    enabled: params.id !== undefined,
  });

  if (params.id && team.data && AllRoles.data && allPractitioner.data) {
    const practitionerRolesAssigned = AllRoles.data
      .map((role) => role.organization.reference.replace('Organization/', ''))
      .filter((role) => role === team.data.identifier.official.value);

    const practitionerAssigned = allPractitioner.data.filter((prac) =>
      practitionerRolesAssigned.includes(prac.identifier.official.value)
    );

    initialValue = {
      name: team.data.name,
      active: team.data.active,
      practitioners: practitionerAssigned.map((prac) => prac.identifier.official.value),
    };
  }
  if (!allPractitioner.data || (params.id && !initialValue)) return <Spin size={'large'} />;

  return (
    <section className="layout-content">
      <Helmet>
        <title>{params.id ? lang.EDIT : lang.CREATE} Team</title>
      </Helmet>

      <h5 className="mb-3 header-title">
        {initialValue?.name ? `${lang.EDIT_TEAM} | ${initialValue.name}` : lang.CREATE_TEAM}
      </h5>

      <div className="bg-white p-5">
        <Form
          fhirbaseURL={fhirbaseURL}
          initialValue={initialValue}
          id={params.id}
          allPractitioner={allPractitioner.data}
        />
      </div>
    </section>
  );
};

export default TeamsAddEdit;
