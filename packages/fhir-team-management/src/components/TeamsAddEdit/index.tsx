import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Organization, Practitioner, PractitionerRole } from '../../types';
import Form, { FormField } from './Form';
import { useParams } from 'react-router';
import {
  PRACTITIONERROLE_ENDPOINT,
  PRACTITIONER_ENDPOINT,
  ORGANIZATION_ENDPOINT,
  ORGANIZATION_RESOURCE_TYPE,
  PRACTITIONER_RESOURCE_TYPE,
  PRACTITIONERROLE_RESOURCE_TYPE,
} from '../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import { Spin } from 'antd';
import lang from '../../lang';
import { useQuery } from 'react-query';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { loadTeamPractitionerInfo } from '../../utils';

export interface Props {
  fhirBaseURL: string;
  resourcePageSize: number;
}

export const TeamsAddEdit: React.FC<Props> = (props: Props) => {
  const { fhirBaseURL, resourcePageSize = 20 } = props;
  const fhirParams = {
    _count: resourcePageSize,
    _getpagesoffset: 0,
  };

  const practitionerAPI = new FHIRServiceClass<Practitioner>(
    fhirBaseURL,
    PRACTITIONER_RESOURCE_TYPE
  );
  const organizationAPI = new FHIRServiceClass<Organization>(
    fhirBaseURL,
    ORGANIZATION_RESOURCE_TYPE
  );
  const practitionerroleAPI = new FHIRServiceClass<PractitionerRole>(
    fhirBaseURL,
    PRACTITIONERROLE_RESOURCE_TYPE
  );
  const params: { id?: string } = useParams();
  const [initialValue, setInitialValue] = useState<FormField>();

  const practitioners = useQuery(
    PRACTITIONER_ENDPOINT,
    async () => practitionerAPI.list(fhirParams),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res) => res.entry.map((e) => e.resource),
    }
  );

  const team = useQuery(
    [ORGANIZATION_ENDPOINT, params.id],
    async () => organizationAPI.read(`${params.id}`),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res) => res,
      enabled: params.id !== undefined,
    }
  );

  const allRoles = useQuery(
    PRACTITIONERROLE_ENDPOINT,
    async () => practitionerroleAPI.list(fhirParams),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res) => res.entry.map((e) => e.resource),
      enabled: params.id !== undefined,
    }
  );

  if (params.id && team.data && allRoles.data && !initialValue) {
    loadTeamPractitionerInfo({
      team: team.data,
      fhirBaseURL: fhirBaseURL,
      PractitionerRoles: allRoles.data,
      resourcePageSize,
    })
      .then(({ practitionerInfo, ...team }) => {
        setInitialValue({
          ...team,
          practitioners: practitionerInfo.map((practitioner) => practitioner.id),
        });
      })
      .catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
  }

  if (!practitioners.data || (params.id && (!initialValue || !allRoles.data)))
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
          fhirBaseURL={fhirBaseURL}
          value={initialValue}
          practitioners={practitioners.data}
          practitionerRoles={allRoles.data ? allRoles.data : undefined}
        />
      </div>
    </section>
  );
};

export default TeamsAddEdit;
