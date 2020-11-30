/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button, Input, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TeamsDetail, { TeamsDetailProps } from '../TeamsDetail';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { OpenSRPService } from '@opensrp/server-service';
import reducerRegistry from '@onaio/redux-reducer-registry';
import reducer, {
  fetchOrganizationsAction,
  getOrganizationsArray,
  Organization,
  reducerName,
} from '../../ducks/organizations';
import { getAccessToken } from '@onaio/session-reducer';
import { API_BASE_URL, TEAMS_ALL, TEAM_PRACTITIONERS, URL_ADD_TEAM } from '../../constants';
import Table, { TableData } from './Table';
import './TeamsView.css';
import { Spin } from 'antd';
import { Link } from 'react-router-dom';
import { Practitioner } from '../../ducks/practitioners';

reducerRegistry.register(reducerName, reducer);

export const loadSingleTeam = (
  row: TableData,
  accessToken: string,
  setDetail: (isLoading: string | Organization) => void,
  setPractitionersList: (isLoading: string | Practitioner[]) => void
): void => {
  const serve = new OpenSRPService(accessToken, API_BASE_URL, TEAM_PRACTITIONERS + row.identifier);
  serve
    .list()
    .then((response: Practitioner[]) => {
      setPractitionersList(response);
      setDetail(row);
    })
    .catch((e) => notification.error({ message: `${e}`, description: '' }));
};

const TeamsView: React.FC = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const teamsArray = useSelector((state) => getOrganizationsArray(state));
  const [detail, setDetail] = useState<TeamsDetailProps | null>(null);
  const [practitionersList, setPractitionersList] = useState<Practitioner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [value, setValue] = useState('');
  const [filter, setfilterData] = useState<TableData[] | null>(null);

  useEffect(() => {
    if (isLoading) {
      const serve = new OpenSRPService(accessToken, API_BASE_URL, TEAMS_ALL);
      serve
        .list()
        .then((response: Organization[]) => {
          dispatch(fetchOrganizationsAction(response));
          setIsLoading(false);
        })
        .catch((e) => notification.error({ message: `${e}`, description: '' }));
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
        <Col className="bg-white p-3 border-left" span={detail ? 19 : 24}>
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

export default TeamsView;
