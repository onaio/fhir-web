import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Organization, Practitioner, PractitionerRole } from '../../types';
import Form, { FormField } from './Form';
import { useParams } from 'react-router';
import { PRACTITIONERROLE_GET, PRACTITIONER_GET, TEAMS_GET } from '../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import { Spin } from 'antd';
import lang from '../../lang';
import { useQuery } from 'react-query';
import { FHIRResponse, FHIRService } from '@opensrp/react-utils';
import { loadTeamPractitionerInfo } from '../../utils';

export interface Props {
  fhirBaseURL: string;
}

export const TeamsAddEdit: React.FC<Props> = (props: Props) => {
  const { fhirBaseURL } = props;

  const params: { id?: string } = useParams();
  const [initialValue, setInitialValue] = useState<FormField>();

  const Practitioners = useQuery(
    PRACTITIONER_GET,
    async () => (await FHIRService(fhirBaseURL)).request(PRACTITIONER_GET),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res: FHIRResponse<Practitioner>) => res.entry.map((e) => e.resource),
    }
  );

  const team = useQuery(
    [TEAMS_GET, params.id],
    async () => (await FHIRService(fhirBaseURL)).request(`${TEAMS_GET}${params.id}`),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res: Organization) => res,
      enabled: params.id !== undefined,
    }
  );

  const AllRoles = useQuery(
    PRACTITIONERROLE_GET,
    async () => (await FHIRService(fhirBaseURL)).request(PRACTITIONERROLE_GET),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res: FHIRResponse<PractitionerRole>) => res.entry.map((e) => e.resource),
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
