import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TeamsDetail from '../TeamsDetail';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { OpenSRPService } from '@opensrp/react-utils';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { sendErrorNotification } from '@opensrp/notifications';
import {
  reducer,
  fetchOrganizationsAction,
  getOrganizationsArray,
  Organization,
  reducerName,
} from '../../ducks/organizations';
import {
  TEAMS_GET,
  TEAM_PRACTITIONERS,
  URL_ADD_TEAM,
  ASSIGNED_LOCATIONS_AND_PLANS,
} from '../../constants';
import Table from './Table';
import './TeamsView.css';
import { Spin } from 'antd';
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
  setDetail(row);

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

/** Function which shows the list of all teams and there details
 *
 * @param {Object} props - TeamsView component props
 * @returns {Function} returns team display
 */
export const TeamsView: React.FC<Props> = (props: Props) => {
  const dispatch = useDispatch();
  const teamsArray = useSelector((state) => getOrganizationsArray(state));
  const [detail, setDetail] = useState<Organization | null>(null);
  const [practitionersList, setPractitionersList] = useState<Practitioner[]>([]);
  const [assignedLocations, setAssignedLocations] = useState<OpenSRPJurisdiction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [value, setValue] = useState('');
  const [filter, setFilterData] = useState<Organization[] | null>(null);
  const { opensrpBaseURL } = props;
  useEffect(() => {
    if (isLoading) {
      const serve = new OpenSRPService(TEAMS_GET, opensrpBaseURL);
      serve
        .list()
        .then((response: Organization[]) => {
          dispatch(fetchOrganizationsAction(response));
          setIsLoading(false);
        })
        .catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
    }
  });

  /**
   * Returns filtered list of teams
   *
   * @param {object} e event received onChange
   * @param {object} e.target -
   * @param {object} e.target.value value to be filtered from tabel list
   */
  const onChange = (e: { target: { value: string } }) => {
    const currentValue = e.target.value;
    setValue(currentValue);
    const filteredData = teamsArray.filter((entry: { name: string }) =>
      entry.name.toLowerCase().includes(currentValue.toLowerCase())
    );
    setFilterData(filteredData as Organization[]);
  };

  if (isLoading) return <Spin size="large" />;

  return (
    <section className="layout-content">
      <Helmet>
        <title>{lang.TEAMS}</title>
      </Helmet>
      <h5 className="mb-3">{lang.TEAMS}</h5>
      <Row>
        <Col className="bg-white p-3" span={detail ? 19 : 24}>
          <div className="mb-3 d-flex justify-content-between">
            <h5>
              <Input
                placeholder={lang.SEARCH}
                size="large"
                value={value}
                prefix={<SearchOutlined />}
                onChange={onChange}
              />
            </h5>
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
              data={value.length < 1 ? teamsArray : (filter as Organization[])}
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
