import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { reducer, Organization, reducerName } from '../../ducks/organizations';
import Form, { FormField } from './Form';
import { useParams } from 'react-router';
import {
  PRACTITIONER_GET,
  TEAMS_GET,
  TEAM_PRACTITIONERS,
  PRACTITIONER_ROLE,
  PRACTITIONER_COUNT,
} from '../../constants';
import { OpenSRPService } from '@opensrp/react-utils';
import { sendErrorNotification } from '@opensrp/notifications';
import { Spin } from 'antd';
import { Practitioner, PractitionerPOST } from '../../ducks/practitioners';
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
        practitioners: response.practitioners.map((practitioner) => practitioner.identifier),
        practitionersList: response.practitioners,
      });
    })
    .catch(() => sendErrorNotification(langObj.ERROR_OCCURRED));
}

export interface Props {
  opensrpBaseURL: string;
  disableTeamMemberReassignment: boolean;
  paginationSize: number;
}

/** default component props */
export const defaultProps = {
  opensrpBaseURL: '',
};

/**
 * function to fetch a paginated practitioner object
 *
 * @param opensrpBaseURL - OpenSRP API base URL
 * @param practitionersEndpoint - OpenSRP practitioners endpoint
 * @param pageNumber - paginated page number
 * @param pageSize - number of practitioners in each page
 * @param errorNotification - the error message to show for a failed request
 * @returns {Promise<Practitioner[]>} an array of practitioners
 */
async function fetchPractitioners(
  opensrpBaseURL: string,
  practitionersEndpoint: string,
  pageNumber: number,
  pageSize: number,
  errorNotification: string = lang.ERROR_OCCURRED
): Promise<Practitioner[]> {
  const paginationParams = {
    pageNumber,
    pageSize,
  };
  const serve = new OpenSRPService(practitionersEndpoint, opensrpBaseURL);
  try {
    const practitioners: Practitioner[] = await serve.list(paginationParams);
    return practitioners;
  } catch (_) {
    sendErrorNotification(errorNotification);
    return [];
  }
}

/**
 * function to fetch paginated practitioners resource recursively
 *
 * @param opensrpBaseURL - OpenSRP API base URL
 * @param practitionersCountEndpoint - OpenSRP practitioners count endpoint
 * @param practitionersEndpoint - OpenSRP practitioners endpoint
 * @param pageSize - number of practitioners in each page
 * @returns {Promise<Practitioner[]>} - an array of all practitioners in a paginated endpoint
 */
async function fetchPractitionersRecursively(
  opensrpBaseURL: string,
  practitionersCountEndpoint: string,
  practitionersEndpoint: string,
  pageSize: number
): Promise<Practitioner[]> {
  // get the total number of practitioners
  const serve = new OpenSRPService(practitionersCountEndpoint, opensrpBaseURL);
  const practitionerCount: number = await serve.list();

  // get the maximum possible page numbers
  const maxPageNo = Math.ceil(practitionerCount / pageSize);

  // compose a promise array to resolve in parallel
  const promises: Promise<Practitioner[]>[] = [];
  for (let pageNumber = 1; pageNumber <= maxPageNo; pageNumber++) {
    promises.push(fetchPractitioners(opensrpBaseURL, practitionersEndpoint, pageNumber, pageSize));
  }

  // fetch practitioners recursively according to page numbers
  return Promise.all(promises)
    .then((practitioners: Practitioner[][]) => {
      // flatten 2D array - [[][]]
      const flatPractitionersArray = practitioners.flat();
      return flatPractitionersArray;
    })
    .catch((err) => {
      throw err;
    });
}

export const TeamsAddEdit: React.FC<Props> = (props: Props) => {
  const params: { id: string } = useParams();
  const [initialValue, setInitialValue] = useState<FormField | null>(null);
  const [practitioners, setPractitioners] = useState<Practitioner[] | null>(null);
  const [practitionersRole, setPractitionersRole] = useState<PractitionerPOST[] | null>(null);
  const { opensrpBaseURL, disableTeamMemberReassignment, paginationSize } = props;

  useEffect(() => {
    if (params.id) setupInitialValue(params.id, opensrpBaseURL, setInitialValue);
  }, [params.id, opensrpBaseURL]);

  /**
   * Fetch practitioners role array - array of all practitioners already assigned to teams
   */
  useEffect(() => {
    // only if configuration allows
    if (disableTeamMemberReassignment) {
      const serve = new OpenSRPService(PRACTITIONER_ROLE, opensrpBaseURL);
      serve
        .list()
        .then((response: PractitionerPOST[]) => {
          // filter inactive practitioners
          const filteredResponse = response.filter((practitioner) => practitioner.active);
          setPractitionersRole(filteredResponse);
        })
        .catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
    }
  }, [disableTeamMemberReassignment, opensrpBaseURL]);

  /**
   * fetch practitioners and diff inactive and already assigned to teams
   */
  useEffect(() => {
    if ((disableTeamMemberReassignment && practitionersRole) || !disableTeamMemberReassignment) {
      // fetch practitioners recursively from a paginated endpoint
      fetchPractitionersRecursively(
        opensrpBaseURL,
        PRACTITIONER_COUNT,
        PRACTITIONER_GET,
        paginationSize
      )
        .then((response: Practitioner[]) => {
          // filter out inactive practitioners
          const activePractitioners = response.filter((practitioner) => practitioner.active);

          /**
           * filter practitioners for already assigned team members
           *
           * @param practitionersRoleArr - a list of all assigned practitioners
           * @param practitionersArr - a list of all practitioners
           * @returns a list of filtered practitioner
           */
          function filterAlreadyAssigned(
            practitionersRoleArr: PractitionerPOST[],
            practitionersArr: Practitioner[]
          ) {
            // get identifiers of all practitioners already assigned
            const assignedPractitioners = practitionersRoleArr.map(
              (practitioner) => practitioner.practitioner
            );
            // filter out already assigned practitioners
            const filteredArray = practitionersArr.filter(
              (practitioner) => !assignedPractitioners.includes(practitioner.identifier)
            );
            return filteredArray;
          }

          // filter out already assigned practitioners if allowed by configurations
          const filteredResponse = disableTeamMemberReassignment
            ? filterAlreadyAssigned(practitionersRole as PractitionerPOST[], activePractitioners)
            : activePractitioners;

          setPractitioners(filteredResponse);
        })
        .catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
    }
  }, [disableTeamMemberReassignment, opensrpBaseURL, paginationSize, practitionersRole]);

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
          disableTeamMemberReassignment={disableTeamMemberReassignment}
        />
      </div>
    </section>
  );
};

export default TeamsAddEdit;
