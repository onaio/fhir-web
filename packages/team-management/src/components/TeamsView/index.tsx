import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TeamsDetail from '../TeamsDetail';
import { Dictionary } from '@onaio/utils';
import { RouteComponentProps } from 'react-router';
import { useDispatch } from 'react-redux';
import {
  OpenSRPService,
  SearchForm,
  getQueryParams,
  createChangeHandler,
} from '@opensrp/react-utils';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { sendErrorNotification } from '@opensrp/notifications';
import {
  reducer,
  fetchOrganizationsAction,
  removeOrganizationsAction,
  Organization,
  reducerName,
} from '../../ducks/organizations';
import {
  TEAMS_GET,
  TEAM_PRACTITIONERS,
  URL_ADD_TEAM,
  ASSIGNED_LOCATIONS_AND_PLANS,
  SEARCH_QUERY_PARAM,
} from '../../constants';
import Table from './Table';
import './TeamsView.css';
import { Link } from 'react-router-dom';
import { Practitioner } from '../../ducks/practitioners';
import { RawAssignment } from '@opensrp/team-assignment';
import { OpenSRPJurisdiction } from '@opensrp/location-management';
import lang, { Lang } from '../../lang';

/** Register reducer */
reducerRegistry.register(reducerName, reducer);

/**
 *  Function to populate the team details section of teams module
 *
 * @param row data selected from the table row
 * @param opensrpBaseURL openSrp server base url
 * @param setDetail function to populate team details section (set row data to state)
 * @param setPractitionersList function to populate the 'Team Members' section of team details
 * @param setAssignedLocations function to populate the 'Assigned Locations' section of team details
 * @param langObj translation strings object
 */
export const populateTeamDetails = (
  row: Organization,
  opensrpBaseURL: string,
  setDetail: React.Dispatch<React.SetStateAction<Organization | null>>,
  setPractitionersList: React.Dispatch<React.SetStateAction<Practitioner[]>>,
  setAssignedLocations: React.Dispatch<React.SetStateAction<OpenSRPJurisdiction[]>>,
  langObj: Lang = lang
) => {
  // get team members (practitioners) assigned to a team
  const getPractitioners = new OpenSRPService(TEAM_PRACTITIONERS + row.identifier, opensrpBaseURL);

  // get raw team assignments (list of jurisdiction and organization id's)
  const getRawTeamAssignments = new OpenSRPService(
    `${TEAMS_GET}${ASSIGNED_LOCATIONS_AND_PLANS}${row.identifier}`,
    opensrpBaseURL
  );

  Promise.all([
    getPractitioners.list() as Promise<Practitioner[]>,
    getRawTeamAssignments.list() as Promise<RawAssignment[]>,
  ])
    .then(([practitioners, rawAssignments]) => {
      setPractitionersList(practitioners);

      // get array jurisdictions from array of raw assignments
      Promise.all(
        // unwrap promises from their wrapped functions
        jurisdictionPromises(rawAssignments, opensrpBaseURL).map((promise) => promise())
      )
        .then((locations) => {
          setAssignedLocations(locations);
        })
        .catch(() => {
          sendErrorNotification(langObj.ERROR_OCCURRED);
        });
    })
    .catch(() => {
      sendErrorNotification(langObj.ERROR_OCCURRED);
    })
    .finally(() => setDetail(row));
};

/**
 * function that returns an array of jurisdiction promises from an array of rawAssignments
 *
 * @param rawAssignments - raw team assignments (list of jurisdiction and organization id's)
 * @param opensrpBaseURL -  openSrp server base url
 * @returns array of jurisdiction promises wrapped in functions
 */
const jurisdictionPromises = (rawAssignments: RawAssignment[], opensrpBaseURL: string) => {
  // wrap promises in plain functions to avoid immediate evocation
  return rawAssignments.map((assignment) => () =>
    jurisdictionFromId(assignment.jurisdictionId, opensrpBaseURL)
  );
};

/**
 * query a jurisdiction from a jurisdiction id
 *
 * @param jurisdictionId - jurisdiction id
 * @param opensrpBaseURL - openSrp server base url
 * @returns - promise that resolves to an opensrp jurisdiction
 */
const jurisdictionFromId = async (jurisdictionId: string, opensrpBaseURL: string) => {
  const getAssignedLocations = new OpenSRPService(
    `location/${jurisdictionId}?is_jurisdiction=true`,
    opensrpBaseURL
  );
  return getAssignedLocations.list() as Promise<OpenSRPJurisdiction>;
};

interface Props {
  opensrpBaseURL: string;
}

/** default component props */
const defaultProps = {
  opensrpBaseURL: '',
};

export type TeamsViewTypes = Props & RouteComponentProps;

/** Function which shows the list of all teams and there details
 *
 * @param {Object} props - TeamsView component props
 * @returns {Function} returns team display
 */
export const TeamsView: React.FC<TeamsViewTypes> = (props: TeamsViewTypes) => {
  const dispatch = useDispatch();
  const searchParam = getQueryParams(props.location)[SEARCH_QUERY_PARAM] ?? '';
  const [detail, setDetail] = useState<Organization | null>(null);
  const [practitionersList, setPractitionersList] = useState<Practitioner[]>([]);
  const [assignedLocations, setAssignedLocations] = useState<OpenSRPJurisdiction[]>([]);
  const { opensrpBaseURL } = props;

  /**
   * Function to fetch organizations
   *
   * @param {number} page - current Page number in Table
   * @param {number} pageSize - Page Size of the table
   * @param {string|undefined} searchquery - searchquery generated from Paginated data
   * @returns {Promise<Organization[]>} Return data Fetched from server
   */
  async function fetchTeams(
    page: number,
    pageSize: number,
    searchquery?: string
  ): Promise<Organization[]> {
    let filterParams: Dictionary = { pageNumber: page, pageSize: pageSize };
    if (searchquery) filterParams = { name: searchParam };
    const teamsService = new OpenSRPService(
      searchquery ? 'organization/search' : TEAMS_GET,
      opensrpBaseURL
    );
    const response: Organization[] = await teamsService.list(filterParams as Dictionary);
    dispatch(removeOrganizationsAction());
    dispatch(fetchOrganizationsAction(response));
    return response;
  }

  return (
    <section className="layout-content">
      <Helmet>
        <title>{lang.TEAMS}</title>
      </Helmet>
      <h5 className="mb-3">{lang.TEAMS}</h5>
      <Row>
        <Col className="bg-white p-3" span={detail ? 19 : 24}>
          <div className="mb-3 d-flex justify-content-between">
            <SearchForm
              defaultValue={getQueryParams(props.location)[SEARCH_QUERY_PARAM]}
              onChange={createChangeHandler(SEARCH_QUERY_PARAM, props)}
              size={'middle'}
            />
            <div>
              <Link to={URL_ADD_TEAM}>
                <Button type="primary">
                  <PlusOutlined />
                  {lang.CREATE_TEAM}
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-white">
            <Table
              searchParam={searchParam}
              fetchTeams={fetchTeams}
              onViewDetails={populateTeamDetails}
              opensrpBaseURL={opensrpBaseURL}
              setPractitionersList={setPractitionersList}
              setAssignedLocations={setAssignedLocations}
              setDetail={setDetail}
            />
          </div>
        </Col>
        {detail ? (
          <Col className="pl-3" span={5}>
            <TeamsDetail
              onClose={() => setDetail(null)}
              {...detail}
              teamMembers={practitionersList}
              assignedLocations={assignedLocations}
            />
          </Col>
        ) : null}
      </Row>
    </section>
  );
};

TeamsView.defaultProps = defaultProps;

export default TeamsView;
