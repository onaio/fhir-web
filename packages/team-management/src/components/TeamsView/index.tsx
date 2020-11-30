/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Menu, Dropdown, Button, Divider, Input, notification } from 'antd';
import { SettingOutlined, PlusOutlined } from '@ant-design/icons';
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
import { API_BASE_URL, TEAMS_ALL, URL_ADD_TEAM } from '../../constants';
import Table, { TableData } from './Table';
import './TeamsView.css';
import { Spin } from 'antd';
import { Link } from 'react-router-dom';

reducerRegistry.register(reducerName, reducer);

const TeamsView: React.FC = () => {
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const teamsArray = useSelector((state) => getOrganizationsArray(state));
  const dispatch = useDispatch();
  const [detail, setDetail] = useState<TeamsDetailProps | null>(null);
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
        date: '2017-10-31',
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
              <Divider type="vertical" />
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="1">Logout</Menu.Item>
                  </Menu>
                }
                placement="bottomRight"
              >
                <Button shape="circle" icon={<SettingOutlined />} type="text" />
              </Dropdown>
            </div>
          </div>
          <div className="bg-white p-4">
            <Table
              data={value.length < 1 ? tableData : (filter as TableData[])}
              onViewDetails={(e: TeamsDetailProps) => setDetail(e)}
            />
          </div>
        </Col>
        {detail ? (
          <Col className="pl-3" span={5}>
            <TeamsDetail onClose={() => setDetail(null)} {...detail} />
          </Col>
        ) : (
          ''
        )}
      </Row>
    </section>
  );
};

export default TeamsView;
