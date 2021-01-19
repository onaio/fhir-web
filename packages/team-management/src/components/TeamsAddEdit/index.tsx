import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { reducer, Organization, reducerName } from '../../ducks/organizations';
import Form, { FormField } from './Form';
import { useParams } from 'react-router';
import {
  API_BASE_URL,
  ERROR_OCCURRED,
  PRACTITIONER_GET,
  TEAMS_GET,
  TEAM_PRACTITIONERS,
} from '../../constants';
import { OpenSRPService } from '@opensrp/react-utils';
import { sendErrorNotification } from '@opensrp/notifications';
import { Spin } from 'antd';
import { Practitioner } from '../../ducks/practitioners';

import './TeamsAddEdit.css';

reducerRegistry.register(reducerName, reducer);

/**
 * Gets Team data
 *
 * @param {string} id id of the team
 * @returns {Promise<Object>} Object Containing Team Data
 */
export async function getTeamDetail(id: string) {
  const serve = new OpenSRPService(TEAMS_GET + id, API_BASE_URL);
  return await serve.list().then(async (response: Organization) => {
    return {
      name: response.name,
      active: response.active,
      practitioners: await getPractitonerDetail(id),
    };
  });
}

/**
 * Gets Practioners assigned to a team
 *
 * @param {string} id id of the team
 * @returns {Promise<Array<Practitioner>>} list of Practitioner Assigned to a team
 */
export async function getPractitonerDetail(id: string) {
  const serve = new OpenSRPService(TEAM_PRACTITIONERS + id, API_BASE_URL);
  return await serve.list().then((response: Practitioner[]) => response.filter((e) => e.active));
}

/**
 * Set the InitialValue in component
 *
 * @param {string} id id of the team
 * @param {Function} setInitialValue Function to set intial value
 */
function setupInitialValue(id: string, setInitialValue: Function) {
  getTeamDetail(id)
    .then((response) => {
      setInitialValue({
        ...response,
        practitioners: response.practitioners.map((prac) => prac.identifier),
      });
    })
    .catch(() => sendErrorNotification(ERROR_OCCURRED));
}

const TeamsAddEdit: React.FC = () => {
  const params: { id: string } = useParams();
  const [initialValue, setInitialValue] = useState<FormField | null>(null);
  const [practitioner, setPractitioner] = useState<Practitioner[] | null>(null);

  useEffect(() => {
    if (params.id) setupInitialValue(params.id, setInitialValue);
  }, [params.id]);

  useEffect(() => {
    const serve = new OpenSRPService(PRACTITIONER_GET, API_BASE_URL);
    serve
      .list()
      .then((response: Practitioner[]) => setPractitioner(response))
      .catch(() => sendErrorNotification(ERROR_OCCURRED));
  }, []);

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
        <Form initialValue={initialValue} id={params.id} practitioner={practitioner} />
      </div>
    </section>
  );
};

export { TeamsAddEdit };
