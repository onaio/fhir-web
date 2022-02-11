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
import lang from '../../lang';
import { useQuery } from 'react-query';
import { FHIRServiceClass, BrokenPage, getResourcesFromBundle } from '@opensrp/react-utils';
import { loadTeamPractitionerInfo } from '../../utils';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import type { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import type { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';

export interface Props {
  fhirBaseURL: string;
}

export const TeamsAddEdit: React.FC<Props> = (props: Props) => {
  const { fhirBaseURL } = props;
  const fhirParams = {
    _count: FHIR_RESOURCES_PAGE_SIZE,
    _getpagesoffset: 0,
  };

  const params: { id?: string } = useParams();
  const [initialValue, setInitialValue] = useState<FormField>();
  const [apiError, setApiError] = useState<boolean>(false);

  const practitioners = useQuery(
    PRACTITIONER_ENDPOINT,
    async () =>
      new FHIRServiceClass<IBundle>(fhirBaseURL, PRACTITIONER_RESOURCE_TYPE).list(fhirParams),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res) => {
        return getResourcesFromBundle<IPractitioner>(res);
      },
    }
  );

  const team = useQuery(
    [ORGANIZATION_ENDPOINT, params.id],
    async () =>
      new FHIRServiceClass<Organization>(fhirBaseURL, ORGANIZATION_RESOURCE_TYPE).read(
        `${params.id}`
      ),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res) => res,
      enabled: params.id !== undefined,
    }
  );

  const allRoles = useQuery(
    PRACTITIONERROLE_ENDPOINT,
    async () =>
      new FHIRServiceClass<IBundle>(fhirBaseURL, PRACTITIONERROLE_RESOURCE_TYPE).list(fhirParams),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res) => {
        return getResourcesFromBundle<IPractitionerRole>(res);
      },
      enabled: params.id !== undefined,
    }
  );

  if (params.id && team.data && allRoles.data && !initialValue) {
    loadTeamPractitionerInfo({
      team: team.data,
      fhirBaseURL: fhirBaseURL,
      PractitionerRoles: allRoles.data as PractitionerRole[],
    })
      .then(({ practitionerInfo, ...team }) => {
        setInitialValue({
          ...team,
          practitioners: practitionerInfo.map((practitioner) => practitioner.id),
        });
      })
      .catch(() => {
        setApiError(true);
        sendErrorNotification(lang.ERROR_OCCURRED);
      });
  }

  if (
    (team.isError && !team.data) ||
    (allRoles.isError && !allRoles.data) ||
    (practitioners.isError && !practitioners.data) ||
    apiError
  ) {
    return <BrokenPage />;
  }

  if (team.isLoading || allRoles.isLoading || practitioners.isLoading) {
    return <Spin size={'large'} />;
  }

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
          practitioners={practitioners.data as Practitioner[]}
          practitionerRoles={allRoles.data ? (allRoles.data as PractitionerRole[]) : undefined}
        />
      </div>
    </section>
  );
};

export default TeamsAddEdit;
