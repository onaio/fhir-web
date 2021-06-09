import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { reducer, Organization, reducerName } from '../../ducks/organizations';
import Form, { FormField } from './Form';
import { useParams } from 'react-router';
import { PRACTITIONER_GET, TEAMS_GET, TEAM_PRACTITIONERS } from '../../constants';
import { OpenSRPService } from '@opensrp/react-utils';
import { sendErrorNotification } from '@opensrp/notifications';
import { Spin } from 'antd';
import { Practitioner } from '../../ducks/practitioners';
import lang, { Lang } from '../../lang';

reducerRegistry.register(reducerName, reducer);

/**
 * Gets Team data
 *
 * @param {string} id id of the team
 * @param {string} opensrpBaseURL - base url
 * @returns {Promise<Object>} Object Containing Team Data
 */
export async function getTeamDetail(id: string, opensrpBaseURL: string) {
  const serve = new OpenSRPService(TEAMS_GET + id, opensrpBaseURL);

  // fetch in parallel
  return Promise.all([
    getPractitionerDetail(id, opensrpBaseURL),
    serve.list() as Promise<Organization>,
  ])
    .then(([practitioners, Organization]) => ({
      name: Organization.name,
      active: Organization.active,
      practitioners: practitioners,
    }))
    .catch((error) => {
      throw error;
    });
}

/**
 * Gets Practioners assigned to a team
 *
 * @param {string} id id of the team
 * @param {string} opensrpBaseURL - base url
 * @returns {Promise<Array<Practitioner>>} list of Practitioner Assigned to a team
 */
export async function getPractitionerDetail(id: string, opensrpBaseURL: string) {
  const serve = new OpenSRPService(TEAM_PRACTITIONERS + id, opensrpBaseURL);
  return await serve.list().then((response: Practitioner[]) => response.filter((e) => e.active));
}

/**
 * Set the InitialValue in component
 *
 * @param {string} id id of the team
 * @param {string} opensrpBaseURL - base url
 * @param {Function} setInitialValue Function to set intial value
 * @param {Lang} langObj - the translation object lookup
 */
function setupInitialValue(
  id: string,
  opensrpBaseURL: string,
  setInitialValue: Function,
  langObj: Lang = lang
) {
  getTeamDetail(id, opensrpBaseURL)
    .then((response) => {
      setInitialValue({
        ...response,
        practitioners: response.practitioners.map((practitioner) => practitioner.name),
        practitionersList: response.practitioners,
      });
    })
    .catch(() => sendErrorNotification(langObj.ERROR_OCCURRED));
}

export interface Props {
  opensrpBaseURL: string;
}

/** default component props */
export const defaultProps = {
  opensrpBaseURL: '',
};

export const TeamsAddEdit: React.FC<Props> = (props: Props) => {
  const params: { id: string } = useParams();
  const [initialValue, setInitialValue] = useState<FormField | null>(null);
  const [practitioners, setPractitioners] = useState<Practitioner[] | null>(null);
  const { opensrpBaseURL } = props;

  useEffect(() => {
    if (params.id) setupInitialValue(params.id, opensrpBaseURL, setInitialValue);
  }, [params.id, opensrpBaseURL]);

  useEffect(() => {
    const serve = new OpenSRPService(PRACTITIONER_GET, opensrpBaseURL);
    serve
      .list()
      .then((response: Practitioner[]) => {
        // filter inactive practitioners
        const filteredResponse = response.filter((practitioner) => practitioner.active);
        setPractitioners(filteredResponse);
      })
      .catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
  }, [opensrpBaseURL]);

  if (!practitioners || (params.id && !initialValue)) return <Spin size={'large'} />;

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
          opensrpBaseURL={opensrpBaseURL}
          initialValue={initialValue}
          id={params.id}
          practitioners={practitioners}
        />
      </div>
    </section>
  );
};

export default TeamsAddEdit;
