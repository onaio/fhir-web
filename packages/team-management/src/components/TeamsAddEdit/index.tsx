import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { reducer, Organization, reducerName } from '../../ducks/organizations';
import Form, { FormField } from './Form';
import { useParams } from 'react-router';
import { getAccessToken } from '@onaio/session-reducer';
import { useSelector } from 'react-redux';
import {
  API_BASE_URL,
  ERROR_OCCURRED,
  PRACTITIONER_GET,
  TEAMS_GET,
  TEAM_PRACTITIONERS,
} from '../../constants';
import { OpenSRPService } from '@opensrp/server-service';
import { sendErrorNotification } from '@opensrp/notifications';
import { Spin } from 'antd';
import { Practitioner } from '../../ducks/practitioners';

import './TeamsAddEdit.css';

reducerRegistry.register(reducerName, reducer);

/**
 * Gets Team data
 *
 * @param {string} accessToken Token for api calles
 * @param {string} id id of the team
 * @returns {Promise<Object>} Object Containing Team Data
 */
export async function getTeamDetail(accessToken: string, id: string) {
  const serve = new OpenSRPService(accessToken, API_BASE_URL, TEAMS_GET + id);
  return await serve.list().then(async (response: Organization) => {
    return {
      name: response.name,
      active: response.active,
      practitioners: await getPractitonerDetail(accessToken, id),
    };
  });
}

/**
 * Gets Practioners assigned to a team
 *
 * @param {string} accessToken Token for api calles
 * @param {string} id id of the team
 * @returns {Promise<Array<Practitioner>>} list of Practitioner Assigned to a team
 */
export async function getPractitonerDetail(accessToken: string, id: string) {
  const serve = new OpenSRPService(accessToken, API_BASE_URL, TEAM_PRACTITIONERS + id);
  return await serve.list().then((response: Practitioner[]) => response.filter((e) => e.active));
}

/**
 * Set the InitialValue in component
 *
 * @param {string} accessToken Token for api calles
 * @param {string} id id of the team
 * @param {Function} setInitialValue Function to set intial value
 */
function setupInitialValue(accessToken: string, id: string, setInitialValue: Function) {
  getTeamDetail(accessToken, id)
    .then((response) => {
      setInitialValue({
        ...response,
        practitioners: response.practitioners.map((prac) => prac.identifier),
      });
    })
    .catch(() => sendErrorNotification(ERROR_OCCURRED));
}

const TeamsAddEdit: React.FC = () => {
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const params: { id: string } = useParams();
  const [initialValue, setInitialValue] = useState<FormField | null>(null);
  const [practitioner, setPractitioner] = useState<Practitioner[] | null>(null);

  useEffect(() => {
    if (params.id) setupInitialValue(accessToken, params.id, setInitialValue);
  }, [accessToken, params.id]);

  useEffect(() => {
    const serve = new OpenSRPService(accessToken, API_BASE_URL, PRACTITIONER_GET);
    serve
      .list()
      .then((response: Practitioner[]) => setPractitioner(response))
      .catch(() => sendErrorNotification(ERROR_OCCURRED));
  }, [accessToken]);

  if (!practitioner || (params.id && !initialValue)) return <Spin size={'large'} />;

  return (
    <section className="layout-content">
      <Helmet>
        <title>{params.id ? 'Edit' : 'Create'} Team</title>
      </Helmet>

      <h5 className="mb-3 header-title">
        {initialValue?.name ? `Edit Team | ${initialValue.name}` : 'Create Team'}
      </h5>

      <div className="bg-white p-5">
        <Form
          accessToken={accessToken}
          initialValue={initialValue}
          id={params.id}
          practitioner={practitioner}
        />
      </div>
    </section>
  );
};

export { TeamsAddEdit };
