import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Organization, Practitioner, PractitionerRole } from '../../types';
import Form, { FormField } from './Form';
import { useParams } from 'react-router';
import {
  FHIR_RESOURCES_PAGE_SIZE,
  PRACTITIONERROLE_ENDPOINT,
  PRACTITIONER_ENDPOINT,
  TEAM_ENDPOINT,
} from '../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import { Spin } from 'antd';
import lang from '../../lang';
import { useQuery } from 'react-query';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { loadTeamPractitionerInfo } from '../../utils';

export interface Props {
  fhirBaseURL: string;
}

export const TeamsAddEdit: React.FC<Props> = (props: Props) => {
  const { fhirBaseURL } = props;
  const fhirParams = {
    _count: FHIR_RESOURCES_PAGE_SIZE,
    _getpagesoffset: 0,
  };

  const practitionerAPI = new FHIRServiceClass<Practitioner>(fhirBaseURL, 'Practitioner');
  const organizationAPI = new FHIRServiceClass<Organization>(fhirBaseURL, 'Organization');
  const practitionerroleAPI = new FHIRServiceClass<PractitionerRole>(
    fhirBaseURL,
    'PractitionerRole'
  );
  const params: { id?: string } = useParams();
  const [initialValue, setInitialValue] = useState<FormField>();

  const Practitioners = useQuery(
    PRACTITIONER_ENDPOINT,
    async () => practitionerAPI.list(fhirParams),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res) => res.entry.map((e) => e.resource),
    }
  );

  const team = useQuery(
    [TEAM_ENDPOINT, params.id],
    async () => organizationAPI.read(`${params.id}`),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res) => res,
      enabled: params.id !== undefined,
    }
  );

  const AllRoles = useQuery(
    PRACTITIONERROLE_ENDPOINT,
    async () => practitionerroleAPI.list(fhirParams),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res) => res.entry.map((e) => e.resource),
      enabled: params.id !== undefined,
    }
  );

  if (params.id && team.data && AllRoles.data && !initialValue) {
    loadTeamPractitionerInfo({
      team: team.data,
      fhirBaseURL: fhirBaseURL,
      PractitionerRoles: AllRoles.data,
    })
      .then(({ practitionerInfo, ...team }) => {
        setInitialValue({
          ...team,
          practitioners: practitionerInfo.map((prac) => prac.id),
        });
      })
      .catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
  }

  if (!Practitioners.data || (params.id && (!initialValue || !AllRoles.data)))
    return <Spin size={'large'} />;

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
          fhirbaseURL={fhirBaseURL}
          value={initialValue}
          practitioners={Practitioners.data}
          practitionerRoles={AllRoles.data ? AllRoles.data : undefined}
        />
      </div>
    </section>
  );
};

export default TeamsAddEdit;
