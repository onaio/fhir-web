/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TeamsDetail, { TeamsDetailProps } from '../TeamsDetail';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { OpenSRPService } from '@opensrp/react-utils';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { sendErrorNotification } from '@opensrp/notifications';
import {
  organizationsReducer,
  fetchOrganizationsAction,
  getOrganizationsArray,
  Organization,
  orgReducerName,
} from '../../ducks/organizations';
import { TEAMS_GET, TEAM_PRACTITIONERS, URL_ADD_TEAM } from '../../constants';
import Table, { TableData } from './Table';
import './TeamsView.css';
import { Spin } from 'antd';
import { Link } from 'react-router-dom';
import { Practitioner } from '../../ducks/practitioners';
import { CREATE_TEAM, ERROR_OCCURRED, SEARCH, TEAMS } from '../../lang';

/** Register reducer */
reducerRegistry.register(orgReducerName, organizationsReducer);

/**
 * Function to load selected Team for details
 *
 * @param {TableData} row data selected from the table
 * @param {string} opensrpBaseURL - base url
 * @param {Function} setDetail funtion to set detail to state
 * @param {Function} setPractitionersList funtion to set detail to state
 */
export const loadSingleTeam = (
  row: TableData,
  opensrpBaseURL: string,
  setDetail: (isLoading: string | Organization) => void,
  setPractitionersList: (isLoading: string | Practitioner[]) => void
): void => {
  const serve = new OpenSRPService(TEAM_PRACTITIONERS + row.identifier, opensrpBaseURL);
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
export const TeamsView: React.FC<Props> = (props: Props) => {
  const dispatch = useDispatch();
  const teamsArray = useSelector((state) => getOrganizationsArray(state));
  const [detail, setDetail] = useState<TeamsDetailProps | null>(null);
  const [practitionersList, setPractitionersList] = useState<Practitioner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [value, setValue] = useState('');
  const [filter, setfilterData] = useState<TableData[] | null>(null);
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
        <title>{TEAMS}</title>
      </Helmet>
      <h5 className="mb-3">{TEAMS}</h5>
      <Row>
        <Col className="bg-white p-3" span={detail ? 19 : 24}>
          <div className="mb-3 d-flex justify-content-between">
            <h5>
              <Input
                placeholder={SEARCH}
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
                  {CREATE_TEAM}
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-white">
            <Table
              data={value.length < 1 ? tableData : (filter as TableData[])}
              onViewDetails={loadSingleTeam}
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
