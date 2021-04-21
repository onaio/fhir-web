import React from 'react';
import { Helmet } from 'react-helmet';
import { FHIRResponse, Organization } from '../../ducks/organizations';
import Form from './Form';
import { useParams } from 'react-router';
import { PRACTITIONERROLE_GET, PRACTITIONER_GET, TEAMS_GET } from '../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import { Spin } from 'antd';
import { Practitioner, PractitionerRole } from '../../ducks/practitioners';
import lang from '../../lang';
import FHIR from 'fhirclient';
import { useQuery } from 'react-query';

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
    select: (res: FHIRResponse<Practitioner>) => res.entry.map((entry) => entry.resource),
  });

  const team = useQuery([TEAMS_GET, params.id], () => serve.request(TEAMS_GET + params.id), {
    onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
    select: (res: Organization) => res,
    enabled: params.id !== undefined,
  });

  const AllRoles = useQuery([PRACTITIONERROLE_GET], () => serve.request(PRACTITIONERROLE_GET), {
    onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
    select: (res: FHIRResponse<PractitionerRole>) => res.entry.map((entry) => entry.resource),
    enabled: params.id !== undefined,
  });

  if (params.id && team.data && AllRoles.data && allPractitioner.data) {
    const practitionerRolesAssigned = AllRoles.data
      .filter((role) => role.organization.identifier?.value === team.data.identifier[0].value)
      .map((role) => role.practitioner.identifier?.value);
    const practitionerAssigned = allPractitioner.data.filter((prac) =>
      practitionerRolesAssigned.includes(prac.identifier[0].value)
    );

    initialValue = {
      name: team.data.name,
      active: team.data.active,
      practitioners: practitionerAssigned.map((prac) => prac.id),
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
