/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TeamsDetail, { TeamsDetailProps } from '../TeamsDetail';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { OpenSRPService } from '@opensrp/server-service';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { sendErrorNotification } from '@opensrp/notifications';
import reducer, {
  fetchOrganizationsAction,
  getOrganizationsArray,
  Organization,
  reducerName,
} from '../../ducks/organizations';
import { getAccessToken } from '@onaio/session-reducer';
import { ERROR_OCCURRED, TEAMS_GET, TEAM_PRACTITIONERS, URL_ADD_TEAM } from '../../constants';
import Table, { TableData } from './Table';
import './TeamsView.css';
import { Spin } from 'antd';
import { Link } from 'react-router-dom';
import { Practitioner } from '../../ducks/practitioners';

/** Register reducer */
reducerRegistry.register(reducerName, reducer);

/**
 * Function to load selected Team for details
 *
 * @param {TableData} row data selected from the table
 * @param {string} accessToken - access token
 * @param {string} opensrpBaseURL - base url
 * @param {Function} setDetail funtion to set detail to state
 * @param {Function} setPractitionersList funtion to set detail to state
 */
export const loadSingleTeam = (
  row: TableData,
  accessToken: string,
  opensrpBaseURL: string,
  setDetail: (isLoading: string | Organization) => void,
  setPractitionersList: (isLoading: string | Practitioner[]) => void
): void => {
  const serve = new OpenSRPService(
    accessToken,
    opensrpBaseURL,
    TEAM_PRACTITIONERS + row.identifier
  );
  serve
    .list()
    .then((response: Practitioner[]) => {
      setPractitionersList(response);
      setDetail(row);
    })
    .catch(() => sendErrorNotification(ERROR_OCCURRED));
};

export interface Props {
  opensrpBaseURL: string;
}

/** default component props */
export const defaultProps = {
  opensrpBaseURL: '',
};

/** Function which shows the list of all teams and there details
 *
 * @param {Object} props - TeamsView component props
 * @returns {Function} returns team display
 */
const TeamsView: React.FC<Props> = (props: Props) => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const teamsArray = useSelector((state) => getOrganizationsArray(state));
  const [detail, setDetail] = useState<TeamsDetailProps | null>(null);
  const [practitionersList, setPractitionersList] = useState<Practitioner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [value, setValue] = useState('');
  const [filter, setfilterData] = useState<TableData[] | null>(null);
  const { opensrpBaseURL } = props;

  useEffect(() => {
    if (isLoading) {
      const serve = new OpenSRPService(accessToken, opensrpBaseURL, TEAMS_GET);
      serve
        .list()
        .then((response: Organization[]) => {
          dispatch(fetchOrganizationsAction(response));
          setIsLoading(false);
        })
        .catch(() => sendErrorNotification(ERROR_OCCURRED));
    }
  });

  const tableData: TableData[] = [];

  if (teamsArray.length) {
    teamsArray.forEach((team: Organization, i: number) => {
      tableData.push({
        key: i.toString(),
        id: team.id,
        name: team.name,
        active: team.active,
        identifier: team.identifier,
      });
    });
  }

  /**
   * Returns filted list of teams
   *
   * @param {object} e event recieved onChange
   * @param {object} e.target -
   * @param {object} e.target.value value to be filtered from tabel list
   */
  const onChange = (e: { target: { value: string } }) => {
    const currentValue = e.target.value;
    setValue(currentValue);
    const filteredData = tableData.filter((entry: { name: string }) =>
      entry.name.toLowerCase().includes(currentValue.toLowerCase())
    );
    setfilterData(filteredData as TableData[]);
  };

  if (isLoading) return <Spin size="large" />;

  return (
    <section className="layout-content">
      <Helmet>
        <title>Teams</title>
      </Helmet>
      <h5 className="mb-3">Teams</h5>
      <Row>
        <Col className="bg-white p-3" span={detail ? 19 : 24}>
          <div className="mb-3 d-flex justify-content-between">
            <h5>
              <Input
                placeholder="Search"
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
                  Create Team
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-white">
            <Table
              data={value.length < 1 ? tableData : (filter as TableData[])}
              onViewDetails={loadSingleTeam}
              accessToken={accessToken}
              opensrpBaseURL={opensrpBaseURL}
              setPractitionersList={
                setPractitionersList as (isLoading: string | Practitioner[]) => void
              }
              setDetail={setDetail as (isLoading: string | Organization) => void}
            />
          </div>
        </Col>
        {detail ? (
          <Col className="pl-3" span={5}>
            <TeamsDetail
              onClose={() => setDetail(null)}
              {...detail}
              teamMembers={practitionersList}
            />
          </Col>
        ) : (
          ''
        )}
      </Row>
    </section>
  );
};

TeamsView.defaultProps = defaultProps;

export default TeamsView;
