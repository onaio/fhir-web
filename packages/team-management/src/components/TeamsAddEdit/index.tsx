import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import reducerRegistry from '@onaio/redux-reducer-registry';
import reducer, { Organization, reducerName } from '../../ducks/organizations';
import Form, { FormField } from './Form';
import { useParams } from 'react-router';
import { getAccessToken } from '@onaio/session-reducer';
import { useSelector } from 'react-redux';
import { API_BASE_URL, PRACTITIONER_GET, TEAMS_GET, TEAM_PRACTITIONERS } from '../../constants';
import { OpenSRPService } from '@opensrp/server-service';
import { notification, Spin } from 'antd';
import { Practitioner } from '../../ducks/practitioners';

import './TeamsAddEdit.css';

reducerRegistry.register(reducerName, reducer);

/**
 * Gets Team data
 *
 * @param {string} accessToken Token for api calles
 * @param {string} id id of the team
 * @param {Function} setInitialValue function to set initial value
 * @returns {Promise<Object>} Object Containing Team Data
 */
export async function getTeamDetail(
  accessToken: string,
  id: string,
  setInitialValue: React.Dispatch<React.SetStateAction<FormField | null>>
) {
  const serve = new OpenSRPService(accessToken, API_BASE_URL, TEAMS_GET + id);
  return await serve
    .list()
    .then(async (response: Organization) => {
      setInitialValue({
        name: response.name,
        active: response.active,
        practitioners: await getPractinonerIdentifier(accessToken, id),
      });
    })
    .catch((e) => notification.error({ message: `${e}`, description: '' }));
}

/**
 * Gets Practioners assigned to a team
 *
 * @param {string} accessToken Token for api calles
 * @param {string} id id of the team
 * @returns {Promise<Array<string>>} list of Practitioner Assigned to a team
 */
export async function getPractinonerIdentifier(accessToken: string, id: string) {
  const serve = new OpenSRPService(accessToken, API_BASE_URL, TEAM_PRACTITIONERS + id);
  return await serve
    .list()
    .then((response: Practitioner[]) => response.map((prac) => prac.identifier));
}

export const TeamsAddEdit: React.FC = () => {
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const params: { id: string } = useParams();
  const [initialValue, setInitialValue] = useState<FormField | null>(null);
  const [practitioner, setPractitioner] = useState<Practitioner[] | null>(null);

  useEffect(() => {
    if (params.id) getTeamDetail(accessToken, params.id, setInitialValue);
  }, [accessToken, params.id]);

  useEffect(() => {
    const serve = new OpenSRPService(accessToken, API_BASE_URL, PRACTITIONER_GET);
    serve
      .list()
      .then((response: Practitioner[]) => setPractitioner(response))
      .catch((e) => notification.error({ message: `${e}`, description: '' }));
  }, [accessToken]);

  if (!practitioner || (params.id && !initialValue))
    return (
      <Spin
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '85vh',
        }}
        size={'large'}
      />
    );

  return (
    <section className="layout-content">
      <Helmet>
        <title>{params.id ? 'Edit' : 'Create'} Team</title>
      </Helmet>

      <h5 className="mb-3">{params.id ? 'Edit' : 'Create'} Team</h5>

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

export default TeamsAddEdit;
