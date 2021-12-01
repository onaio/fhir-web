import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Organization, Practitioner, PractitionerRole } from '../../types';
import Form, { FormField } from './Form';
import { useParams } from 'react-router';
import {
  FHIR_RESOURCES_PAGE_SIZE,
  PRACTITIONERROLE_ENDPOINT,
  PRACTITIONER_ENDPOINT,
  ORGANIZATION_ENDPOINT,
  ORGANIZATION_RESOURCE_TYPE,
  PRACTITIONER_RESOURCE_TYPE,
  PRACTITIONERROLE_RESOURCE_TYPE,
} from '../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import { Spin } from 'antd';
import { useQuery } from 'react-query';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { loadTeamPractitionerInfo } from '../../utils';
import { useTranslation } from '../../mls';

export interface Props {
  fhirBaseURL: string;
}

export const TeamsAddEdit: React.FC<Props> = (props: Props) => {
  const { fhirBaseURL } = props;
  const { t } = useTranslation();
  const fhirParams = {
    _count: FHIR_RESOURCES_PAGE_SIZE,
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
      onError: () => sendErrorNotification(t('An error occurred')),
      select: (res) => res.entry.map((e) => e.resource),
    }
  );

  const team = useQuery(
    [ORGANIZATION_ENDPOINT, params.id],
    async () => organizationAPI.read(`${params.id}`),
    {
      onError: () => sendErrorNotification(t('An error occurred')),
      select: (res) => res,
      enabled: params.id !== undefined,
    }
  );

  const allRoles = useQuery(
    PRACTITIONERROLE_ENDPOINT,
    async () => practitionerroleAPI.list(fhirParams),
    {
      onError: () => sendErrorNotification(t('An error occurred')),
      select: (res) => res.entry.map((e) => e.resource),
      enabled: params.id !== undefined,
    }
  );

  if (params.id && team.data && allRoles.data && !initialValue) {
    loadTeamPractitionerInfo({
      team: team.data,
      fhirBaseURL: fhirBaseURL,
      PractitionerRoles: allRoles.data,
    })
      .then(({ practitionerInfo, ...team }) => {
        setInitialValue({
          ...team,
          practitioners: practitionerInfo.map((practitioner) => practitioner.id),
        });
      })
      .catch(() => sendErrorNotification(t('An error occurred')));
  }

  if (!practitioners.data || (params.id && (!initialValue || !allRoles.data)))
    return <Spin size={'large'} />;

  return (
    <section className="layout-content">
      <Helmet>
        <title>{params.id ? t('Edit') : t('Create')} Team</title>
      </Helmet>

      <h5 className="mb-3 header-title">
        {initialValue?.name ? `${t('Edit Team')} | ${initialValue.name}` : t('Create Team')}
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
